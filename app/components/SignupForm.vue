<script setup lang="ts">
import {
  GRONINGEN_CITY_CODE,
  GRONINGEN_MUNICIPALITY_CODE,
  emptySignupValues,
  signupCopy,
  signupSteps,
  type SignupField,
  type SignupValues,
} from '~/data/signup'

const totalSteps = signupSteps.length

const step = ref(1)
const values = reactive<SignupValues>(emptySignupValues())
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const showError = ref(false)
const errorMessage = ref('')

const currentStep = computed(() => signupSteps[step.value - 1]!)
const fields = computed(() => currentStep.value.fields(values))
const isLastStep = computed(() => step.value === totalSteps)

function fieldId(field: SignupField) {
  return `signup-${field.name}`
}

/** Required fields on this step that are still empty. */
const missing = computed(() =>
  fields.value.filter((field) => {
    if (!field.required) return false
    if (field.kind === 'checkbox') return values.subjects.length === 0
    return !String(values[field.name] ?? '').trim()
  }),
)

const consentMissing = computed(() => isLastStep.value && !values.consent)

/**
 * Changing level or school year swaps which Bijlesvakken are offered. Anything
 * ticked in the previous set has to go, or the visitor submits a subject that
 * was no longer on screen. `null` means this step has no subject question at
 * all, which must leave the existing answers alone.
 */
watch(
  () => {
    const field = fields.value.find((candidate) => candidate.kind === 'checkbox')
    return field ? field.options.join('|') : null
  },
  (options) => {
    if (options === null) return
    const allowed = new Set(options ? options.split('|') : [])
    values.subjects = values.subjects.filter((subject) => allowed.has(subject))
  },
)

/**
 * The last step warns about travel costs and reachability. Both depend on the
 * address codes, which only exist once the lookup has resolved — so neither
 * warning shows while the address is still being filled in.
 */
const showTravelWarning = computed(
  () =>
    isLastStep.value &&
    values.location === 'at_home' &&
    values.cityCode !== '' &&
    values.cityCode !== GRONINGEN_CITY_CODE &&
    values.municipalityCode === GRONINGEN_MUNICIPALITY_CODE,
)

const showRegionWarning = computed(
  () =>
    isLastStep.value &&
    values.location === 'at_home' &&
    values.municipalityCode !== '' &&
    values.municipalityCode !== GRONINGEN_MUNICIPALITY_CODE,
)

// Address lookup — postcode + huisnummer fill street, city and the two codes.
let lookupTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => [values.postalCode, values.houseNumber],
  ([postcode, houseNumber]) => {
    // Codes belong to the previous address; drop them before looking up again
    // so a stale gemeentecode can never drive the warnings.
    values.cityCode = ''
    values.municipalityCode = ''

    clearTimeout(lookupTimer)
    if (!postcode?.trim() || !houseNumber?.trim()) return
    lookupTimer = setTimeout(lookupAddress, 400)
  },
)

onBeforeUnmount(() => clearTimeout(lookupTimer))

async function lookupAddress() {
  try {
    const result = await $fetch('/api/adres', {
      query: { postcode: values.postalCode, huisnummer: values.houseNumber },
    })

    if (!result.found) return

    if (result.street) values.street = result.street
    if (result.city) values.city = result.city
    values.cityCode = result.cityCode
    values.municipalityCode = result.municipalityCode
  } catch {
    // Best effort: the visitor fills street and city in themselves.
  }
}

async function advance() {
  if (missing.value.length > 0 || consentMissing.value) {
    showError.value = true
    await focusFirstInvalid()
    return
  }

  showError.value = false

  if (!isLastStep.value) {
    step.value += 1
    return
  }

  await submit()
}

async function focusFirstInvalid() {
  await nextTick()
  const target = missing.value[0]
  const id = target ? fieldId(target) : 'signup-consent'
  document.getElementById(id)?.focus()
}

function back() {
  if (step.value === 1) return
  step.value -= 1
  showError.value = false
}

async function submit() {
  if (status.value === 'pending') return

  status.value = 'pending'
  errorMessage.value = ''

  try {
    await $fetch('/api/aanmelden', { method: 'POST', body: { ...values } })
    status.value = 'success'
  } catch (error: any) {
    status.value = 'error'
    errorMessage.value =
      error?.data?.message ??
      'Er ging iets mis bij het versturen. Probeer het later opnieuw of bel ons.'
  }
}

function reset() {
  Object.assign(values, emptySignupValues())
  step.value = 1
  status.value = 'idle'
  showError.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div class="panel p-[22px] sm:p-8">
    <div class="mb-[22px] text-center">
      <p class="text-[13.5px] font-semibold text-brand-700">{{ signupCopy.kicker }}</p>
      <h2 class="mt-1.5 text-[21px]">{{ signupCopy.title }}</h2>
    </div>

    <!-- Confirmation -->
    <div v-if="status === 'success'" class="px-2.5 py-[30px] text-center" role="status">
      <span
        class="mb-[18px] inline-flex h-[54px] w-[54px] items-center justify-center rounded-full bg-success-50"
      >
        <svg
          class="h-[26px] w-[26px] text-success-900"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12l6 6L20 6" />
        </svg>
      </span>
      <h3 class="text-[19px]">{{ signupCopy.successTitle }}</h3>
      <p class="mx-auto mt-2.5 mb-[22px] text-sm leading-relaxed text-ink-700">
        {{ signupCopy.successBody }}
      </p>
      <button type="button" class="btn-secondary" @click="reset">
        {{ signupCopy.successAgain }}
      </button>
    </div>

    <form v-else novalidate @submit.prevent="advance">
      <p class="mb-2 text-[13px] font-semibold text-ink-700">
        {{ signupCopy.stepLabel(step, totalSteps) }}
      </p>

      <div class="mb-[26px] grid grid-cols-4 gap-[5px]" aria-hidden="true">
        <span
          v-for="index in totalSteps"
          :key="index"
          class="h-[5px] rounded-[3px]"
          :class="index <= step ? 'bg-brand-500' : 'bg-line-200'"
        />
      </div>

      <h3 class="text-[17px]">{{ currentStep.title }}</h3>
      <p class="mt-1.5 mb-6 text-[12.5px] leading-relaxed text-ink-600">
        {{ currentStep.intro }}
      </p>

      <div class="flex flex-col gap-[22px]">
        <div v-for="field in fields" :key="field.name">
          <!-- Choice groups: radio and checkbox -->
          <fieldset v-if="field.kind === 'radio' || field.kind === 'checkbox'">
            <legend class="field-label">
              {{ field.label
              }}<span v-if="field.required" class="text-xs font-medium text-danger">
                {{ signupCopy.requiredMark }}</span>
            </legend>
            <p v-if="field.hint" class="field-hint">{{ field.hint }}</p>

            <div
              v-if="field.kind === 'radio'"
              class="mt-2 flex flex-col gap-[9px]"
            >
              <label
                v-for="(option, index) in field.options"
                :key="option.value"
                class="group flex cursor-pointer items-center gap-[11px] text-[13.5px] leading-snug"
              >
                <input
                  :id="index === 0 ? fieldId(field) : undefined"
                  v-model="values[field.name]"
                  class="sr-only"
                  type="radio"
                  :name="fieldId(field)"
                  :value="option.value"
                >
                <span
                  class="flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full border-[1.5px] border-line-400 transition group-has-[:checked]:border-accent-500 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
                >
                  <span
                    class="h-[9px] w-[9px] rounded-full bg-accent-500 opacity-0 group-has-[:checked]:opacity-100"
                  />
                </span>
                {{ option.label }}
              </label>
            </div>

            <div v-else class="mt-2 flex flex-wrap gap-x-[18px] gap-y-[9px]">
              <label
                v-for="(option, index) in field.options"
                :key="option"
                class="group flex cursor-pointer items-center gap-2.5 text-[13.5px]"
              >
                <input
                  :id="index === 0 ? fieldId(field) : undefined"
                  v-model="values.subjects"
                  class="sr-only"
                  type="checkbox"
                  :value="option"
                >
                <span
                  class="flex h-[18px] w-[18px] flex-none items-center justify-center rounded border-[1.5px] border-line-400 transition group-has-[:checked]:border-accent-500 group-has-[:checked]:bg-accent-400 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
                >
                  <svg
                    class="h-[11px] w-[11px] opacity-0 group-has-[:checked]:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 12l6 6L20 6" />
                  </svg>
                </span>
                {{ option }}
              </label>
            </div>
          </fieldset>

          <!-- Single inputs: select and text -->
          <template v-else>
            <label :for="fieldId(field)" class="field-label">
              {{ field.label
              }}<span v-if="field.required" class="text-xs font-medium text-danger">
                {{ signupCopy.requiredMark }}</span>
            </label>
            <p v-if="field.hint" class="field-hint">{{ field.hint }}</p>

            <select
              v-if="field.kind === 'select'"
              :id="fieldId(field)"
              v-model="values[field.name]"
              class="field-input"
            >
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <input
              v-else
              :id="fieldId(field)"
              v-model="values[field.name]"
              class="field-input"
              :type="field.inputType ?? 'text'"
              :placeholder="field.placeholder"
              :autocomplete="field.autocomplete"
            >
          </template>
        </div>

        <p v-if="showTravelWarning" class="text-[12.5px] leading-relaxed text-danger">
          {{ signupCopy.travelWarning }}
        </p>
        <p v-if="showRegionWarning" class="text-[12.5px] leading-relaxed text-danger">
          {{ signupCopy.regionWarning }}
        </p>

        <label v-if="isLastStep" class="group flex cursor-pointer items-start gap-[11px] text-[12.5px] leading-normal text-ink-700">
          <input id="signup-consent" v-model="values.consent" class="sr-only" type="checkbox">
          <span
            class="mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded border-[1.5px] border-line-400 transition group-has-[:checked]:border-accent-500 group-has-[:checked]:bg-accent-400 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
          >
            <svg
              class="h-[11px] w-[11px] opacity-0 group-has-[:checked]:opacity-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12l6 6L20 6" />
            </svg>
          </span>
          <span>
            {{ signupCopy.consentPrefix }}
            <NuxtLink to="/algemene-voorwaarden" class="border-b border-ink-900">
              {{ signupCopy.consentTerms }}
            </NuxtLink>
            {{ signupCopy.consentAnd }}
            <NuxtLink to="/privacy" class="border-b border-ink-900">
              {{ signupCopy.consentPrivacy }}
            </NuxtLink>.<span class="text-danger"> {{ signupCopy.requiredMark }}</span>
          </span>
        </label>

        <!-- Honeypot — bots fill this, humans never see it. -->
        <div aria-hidden="true" class="absolute left-[-9999px]">
          <label for="signup-website">Laat dit veld leeg</label>
          <input id="signup-website" v-model="values.website" type="text" tabindex="-1" autocomplete="off">
        </div>

        <p v-if="showError" class="text-[12.5px] text-danger" role="alert">
          {{ signupCopy.invalid }}
        </p>
        <p v-if="status === 'error'" class="text-[12.5px] text-danger" role="alert">
          {{ errorMessage }}
        </p>

        <div class="flex items-center gap-3">
          <button v-if="step > 1" type="button" class="btn-secondary flex-none px-5 py-3.5" @click="back">
            {{ signupCopy.back }}
          </button>
          <button
            type="submit"
            class="btn-primary flex-1 py-[15px] text-[14.5px]"
            :disabled="status === 'pending'"
          >
            {{
              status === 'pending'
                ? signupCopy.submitting
                : isLastStep
                  ? signupCopy.submit
                  : signupCopy.next
            }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
