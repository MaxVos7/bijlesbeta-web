<script setup lang="ts">
import {
  GRONINGEN_CITY_CODE,
  GRONINGEN_MUNICIPALITY_CODE,
  SIGNUP_MAX,
  emptySignupValues,
  signupCopy,
  signupSteps,
  type SignupField,
  type SignupTextKey,
  type SignupValues,
} from '~/data/signup'

const totalSteps = signupSteps.length

const step = ref(1)
const values = reactive<SignupValues>(emptySignupValues())

/*
  Prefilled from the query string, which is how the short proefles block hands
  a visitor over: its confirmation is a redirect to
  `/aanmelden/?naam=…&telefoon=…&e-mailadres=…`. The three parameter names are
  bijlesbeta.nl's own — they map onto Gravity Forms' fields 1.3, 4 and 3, which
  are this wizard's `contactFirstName`, `studentPhone` and `email` — so a link
  built against the live site prefills here too. See `LeadForm.vue`.

  Read once at setup rather than watched: this seeds the form, it doesn't own
  it, and a visitor who edits a field must not have it overwritten by a
  navigation that leaves the query string in place.
*/
const query = useRoute().query

function prefill(param: string, key: 'contactFirstName' | 'studentPhone' | 'email') {
  const raw = query[param]
  const value = (Array.isArray(raw) ? raw[0] : raw) ?? ''
  if (value) values[key] = String(value).slice(0, SIGNUP_MAX[key])
}

prefill('naam', 'contactFirstName')
prefill('telefoon', 'studentPhone')
prefill('e-mailadres', 'email')
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const showError = ref(false)
const errorMessage = ref('')

/*
  A rejected submit left its red message under the form until the next submit,
  so correcting the offending field looked like it had done nothing. Editing
  any answer clears it; the per-field messages stay, since those are still
  accurate until the step is re-checked.
*/
watch(
  () => JSON.stringify(values),
  () => {
    if (errorMessage.value) errorMessage.value = ''
  },
)

/** Focused on every step change so a keyboard or screen reader lands on the
    new questions rather than back at the top of the document. */
const heading = ref<HTMLElement | null>(null)

const currentStep = computed(() => signupSteps[step.value - 1]!)
const fields = computed(() => currentStep.value.fields(values))
const isLastStep = computed(() => step.value === totalSteps)

function fieldId(name: SignupTextKey | 'subjects') {
  return `signup-${name}`
}

function filled(name: SignupTextKey) {
  return String(values[name] ?? '').trim() !== ''
}

/**
 * The body that would be posted.
 *
 * Every answer the rules know about is forced to a string on the way out.
 * `SignupValues` types them all as strings, but `v-model` on an
 * `<input type="number">` casts silently and typing can't see it: `schoolYear`
 * left here as the number `4`, the endpoint's `z.string()` refused it, and the
 * visitor lost four steps of answers to a generic red line. The binding no
 * longer casts — see the `<input>` below — and this makes it impossible for
 * the same thing to happen again by a different route.
 */
function payload(): Record<string, unknown> {
  const body: Record<string, unknown> = { ...values }
  for (const name of Object.keys(SIGNUP_RULES) as SignupTextKey[]) {
    body[name] = String(values[name] ?? '')
  }
  return body
}

/**
 * Everything the endpoint would refuse, over that body — the same rule table
 * `server/api/aanmelden.post.ts` builds its schema from, so the wizard cannot
 * accept an answer the endpoint won't. Fields the visitor hasn't reached yet
 * are in here too; only the ones on the current step are ever shown.
 */
const problems = computed(() => checkForm(SIGNUP_RULES, payload()))
const subjectsProblem = computed(() => checkList(SIGNUP_SUBJECTS_RULE, values.subjects))

/** The wizard's own wording for a problem, where it has one. */
function say(problem: FieldProblem | null | undefined): string {
  if (!problem) return ''

  switch (problem.kind) {
    case 'required': return signupCopy.fieldRequired
    case 'tooLong': return signupCopy.tooLong(problem.limit)
    case 'email': return signupCopy.invalidEmail
    case 'phone': return signupCopy.invalidPhone
    case 'wholeNumber': return signupCopy.wholeNumber
    case 'numberMin': return signupCopy.numberMin(problem.limit)
    case 'numberMax': return signupCopy.numberRange(problem.limit)
    default: return describeProblem(problem)
  }
}

/**
 * What's wrong with a field on screen, or `null`.
 *
 * The wizard asks for more than the endpoint insists on, and deliberately: a
 * conditional question is required *here* while the endpoint has to accept it
 * blank, because only the wizard knows which questions were put to this
 * visitor. So its own `required` is checked first, and everything else comes
 * from the shared rules.
 */
function problemFor(field: SignupField): FieldProblem | null {
  if (field.kind === 'checkbox') {
    if (field.required && values.subjects.length === 0) return { kind: 'required' }
    return subjectsProblem.value
  }

  if (field.kind === 'name') {
    if (field.required && field.parts.some((part) => !filled(part.name))) {
      return { kind: 'required' }
    }
    return field.parts.map((part) => problems.value[part.name]).find(Boolean) ?? null
  }

  if (field.required && !filled(field.name)) return { kind: 'required' }

  return problems.value[field.name] ?? null
}

/**
 * The message under a field, or `''` while it is fine. Gravity Forms validates
 * a page at a time and prints its complaint under the offending field, so
 * these only appear once the visitor has tried to move on.
 */
function errorFor(field: SignupField): string {
  return showError.value ? say(problemFor(field)) : ''
}

/** Every field on this step that would fail validation, in document order. */
const invalid = computed(() => fields.value.filter((field) => problemFor(field) !== null))

/**
 * The first answer in the whole payload the endpoint would refuse, whichever
 * step asked for it — the guard that runs before the submit, since a step's
 * own checks can only see the questions it put on screen.
 */
function outstanding(): { name: SignupTextKey | 'subjects', problem: FieldProblem } | null {
  for (const name of Object.keys(SIGNUP_RULES) as SignupTextKey[]) {
    const problem = problems.value[name]
    if (problem) return { name, problem }
  }

  return subjectsProblem.value ? { name: 'subjects', problem: subjectsProblem.value } : null
}

/** Which step asks for a field, or `null` if none of them do. */
function stepOf(name: SignupTextKey | 'subjects'): number | null {
  for (const [index, candidate] of signupSteps.entries()) {
    const asked = candidate.fields(values).some((field) =>
      field.kind === 'name'
        ? field.parts.some((part) => part.name === name)
        : field.name === name,
    )
    if (asked) return index + 1
  }

  return null
}

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
const lookingUp = ref(false)

watch(
  () => [values.postalCode, values.houseNumber],
  ([postcode, houseNumber]) => {
    // Codes belong to the previous address; drop them before looking up again
    // so a stale gemeentecode can never drive the warnings.
    values.cityCode = ''
    values.municipalityCode = ''

    clearTimeout(lookupTimer)
    if (!postcode?.trim() || !houseNumber?.trim()) {
      lookingUp.value = false
      return
    }

    lookingUp.value = true
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
  } finally {
    lookingUp.value = false
  }
}

async function advance() {
  if (invalid.value.length > 0 || consentMissing.value) {
    showError.value = true
    await focusFirstInvalid()
    return
  }

  showError.value = false

  if (!isLastStep.value) {
    step.value += 1
    await nextTick()
    heading.value?.focus()
    return
  }

  /*
    Nothing leaves this form that the endpoint would refuse. The step's own
    checks have passed, so this only ever catches an answer given on an
    earlier step — one that a later answer invalidated, or that was never the
    shape the endpoint takes. The visitor is sent back to the question rather
    than told, at the end of four steps, that something somewhere is wrong.
  */
  const blocking = outstanding()

  if (blocking) {
    showError.value = true
    const owner = stepOf(blocking.name)

    if (owner === null) {
      // No step asks for it, so there is nothing to send the visitor back to.
      // Says what is wrong rather than posting a submission that would fail.
      errorMessage.value = say(blocking.problem)
      return
    }

    step.value = owner
    await nextTick()
    await focusFirstInvalid()
    return
  }

  await submit()
}

async function focusFirstInvalid() {
  await nextTick()
  const target = invalid.value[0]
  const id = target
    ? fieldId(target.kind === 'name' ? target.parts[0]!.name : target.name)
    : 'signup-consent'
  document.getElementById(id)?.focus()
}

async function back() {
  if (step.value === 1) return
  step.value -= 1
  showError.value = false
  await nextTick()
  heading.value?.focus()
}

async function submit() {
  if (status.value === 'pending') return

  status.value = 'pending'
  errorMessage.value = ''

  try {
    const result = await $fetch('/api/aanmelden', { method: 'POST', body: payload() })

    // 200 with `ok: false` when it reached nobody — see `deliveryResult`.
    if (result.ok === false) {
      status.value = 'error'
      errorMessage.value = result.message
      return
    }

    status.value = 'success'
  } catch (error: any) {
    status.value = 'error'
    errorMessage.value =
      error?.data?.data?.message ??
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
  <!--
    The panel is the live form column itself: white on the 8px surface radius
    with 24px of padding and a 12px rhythm, carrying no shadow of its own.
  -->
  <div class="flex flex-col gap-3 rounded-panel bg-white p-6">
    <p
      class="text-center font-display text-[15px] leading-[15px] font-bold text-accent-500"
    >
      {{ signupCopy.kicker }}
    </p>
    <h2 class="text-center text-[22px] leading-[44px] tracking-normal text-ink-900">
      {{ signupCopy.title }}
    </h2>

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
      <!--
        The progress block is only as wide as its own label on the live form —
        a 78px bar, not a full-width one — so the wrapper is sized to content.
      -->
      <div class="mb-6 w-fit">
        <p class="mb-4 font-display text-[14px] leading-[14px] font-semibold text-field-hint">
          {{ signupCopy.stepLabel(step, totalSteps) }}
        </p>
        <div
          class="h-2.5 overflow-hidden rounded-full bg-field-track"
          role="progressbar"
          :aria-valuenow="step"
          aria-valuemin="1"
          :aria-valuemax="totalSteps"
          :aria-valuetext="signupCopy.stepLabel(step, totalSteps)"
        >
          <div
            class="h-full rounded-full bg-brand-500 transition-[width] duration-300"
            :style="{ width: `${(step / totalSteps) * 100}%` }"
          />
        </div>
      </div>

      <h3
        ref="heading"
        tabindex="-1"
        class="mt-2 mb-4 font-display text-[20px] leading-6 font-bold tracking-normal focus:outline-none"
      >
        {{ currentStep.title }}
      </h3>
      <p class="font-display text-[12.8px] leading-[19.2px]">{{ currentStep.intro }}</p>

      <div class="mt-5 grid gap-5">
        <div v-for="field in fields" :key="field.name">
          <!-- Choice groups: radio and checkbox -->
          <fieldset v-if="field.kind === 'radio' || field.kind === 'checkbox'">
            <legend class="field-label-lg">
              {{ field.label }}<span
                v-if="field.required"
                class="field-required"
              >&nbsp;{{ signupCopy.requiredMark }}</span>
            </legend>
            <div v-if="field.kind === 'radio'" class="flex flex-col gap-3">
              <label
                v-for="(option, index) in field.options"
                :key="option.value"
                class="group flex cursor-pointer items-center"
              >
                <input
                  :id="index === 0 ? fieldId(field.name) : undefined"
                  v-model="values[field.name]"
                  class="sr-only"
                  type="radio"
                  :name="fieldId(field.name)"
                  :value="option.value"
                  :aria-describedby="field.hint ? `${fieldId(field.name)}-hint` : undefined"
                >
                <span
                  class="flex h-5 w-5 flex-none items-center justify-center rounded-full border border-field-line bg-white shadow-field transition group-has-[:checked]:border-accent-500 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
                >
                  <span
                    class="h-2.5 w-2.5 rounded-full bg-accent-500 opacity-0 group-has-[:checked]:opacity-100"
                  />
                </span>
                <span class="ml-3 font-display text-[14px] leading-5 text-field-label">
                  {{ option.label }}
                </span>
              </label>
            </div>

            <div v-else class="flex flex-col gap-3">
              <label
                v-for="(option, index) in field.options"
                :key="option"
                class="group flex cursor-pointer items-center"
              >
                <input
                  :id="index === 0 ? fieldId('subjects') : undefined"
                  v-model="values.subjects"
                  class="sr-only"
                  type="checkbox"
                  :value="option"
                >
                <span
                  class="flex h-5 w-5 flex-none items-center justify-center border border-field-line bg-white text-ink-900 shadow-field transition group-has-[:checked]:border-accent-500 group-has-[:checked]:bg-accent-500 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
                >
                  <svg
                    class="h-3 w-3 opacity-0 group-has-[:checked]:opacity-100"
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
                <span class="ml-3 font-display text-[14px] leading-5 text-field-label">
                  {{ option }}
                </span>
              </label>
            </div>

            <!-- Gravity Forms prints the description under the control, not
                 between the label and it. -->
            <p v-if="field.hint" :id="`${fieldId(field.name)}-hint`" class="field-hint-lg">
              {{ field.hint }}
            </p>
          </fieldset>

          <!-- Gravity Forms' Name field: one label over two inputs on a row -->
          <fieldset v-else-if="field.kind === 'name'">
            <legend class="field-label-lg">
              {{ field.label }}<span
                v-if="field.required"
                class="field-required"
              >&nbsp;{{ signupCopy.requiredMark }}</span>
            </legend>
            <div class="grid gap-3 sm:grid-cols-2">
              <input
                v-for="part in field.parts"
                :id="fieldId(part.name)"
                :key="part.name"
                v-model="values[part.name]"
                class="field-input-lg"
                type="text"
                :maxlength="SIGNUP_MAX[part.name]"
                :placeholder="part.placeholder"
                :autocomplete="part.autocomplete"
                :aria-label="part.placeholder"
                :aria-invalid="Boolean(errorFor(field)) || undefined"
              >
            </div>
          </fieldset>

          <!-- Single inputs: select and text -->
          <template v-else>
            <label :for="fieldId(field.name)" class="field-label-lg">
              {{ field.label }}<span
                v-if="field.required"
                class="field-required"
              >&nbsp;{{ signupCopy.requiredMark }}</span>
            </label>

            <select
              v-if="field.kind === 'select'"
              :id="fieldId(field.name)"
              v-model="values[field.name]"
              class="field-select-lg"
              :aria-invalid="Boolean(errorFor(field)) || undefined"
              :aria-describedby="field.hint ? `${fieldId(field.name)}-hint` : undefined"
            >
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <!--
              Bound by hand rather than with `v-model`, because `v-model` on an
              `<input type="number">` casts the value to a number — silently,
              and regardless of `SignupValues` typing every answer as a string.
              `schoolYear` then left as `4` rather than `"4"`, and the endpoint's
              `z.string()` refused the whole submission with a 422 at the end of
              the wizard.
            -->
            <input
              v-else
              :id="fieldId(field.name)"
              :value="values[field.name]"
              class="field-input-lg"
              @input="values[field.name] = ($event.target as HTMLInputElement).value"
              :type="field.inputType ?? 'text'"
              :placeholder="field.placeholder"
              :autocomplete="field.autocomplete"
              :min="field.min"
              :max="field.max"
              :maxlength="field.inputType === 'number' ? undefined : SIGNUP_MAX[field.name]"
              :aria-invalid="Boolean(errorFor(field)) || undefined"
              :aria-describedby="field.hint ? `${fieldId(field.name)}-hint` : undefined"
            >

            <p v-if="field.hint" :id="`${fieldId(field.name)}-hint`" class="field-hint-lg">
              {{ field.hint }}
            </p>
          </template>

          <p v-if="errorFor(field)" class="field-error" role="alert">{{ errorFor(field) }}</p>
        </div>

        <p
          v-if="lookingUp"
          class="font-display text-[13px] leading-[18.6px] text-field-hint"
          role="status"
        >
          {{ signupCopy.lookingUpAddress }}
        </p>

        <p v-if="showTravelWarning" class="text-[13px] leading-[18.6px] text-danger">
          {{ signupCopy.travelWarning }}
        </p>
        <p v-if="showRegionWarning" class="text-[13px] leading-[18.6px] text-danger">
          {{ signupCopy.regionWarning }}
        </p>

        <div v-if="isLastStep">
          <label class="group flex cursor-pointer items-start">
            <input id="signup-consent" v-model="values.consent" class="sr-only" type="checkbox">
            <span
              class="mt-0.5 flex h-5 w-5 flex-none items-center justify-center border border-field-line bg-white text-ink-900 shadow-field transition group-has-[:checked]:border-accent-500 group-has-[:checked]:bg-accent-500 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
            >
              <svg
                class="h-3 w-3 opacity-0 group-has-[:checked]:opacity-100"
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
            <span class="ml-3 font-display text-[14px] leading-5 text-field-label">
              {{ signupCopy.consentPrefix }}
              <NuxtLink to="/algemene-voorwaarden" class="border-b border-ink-900">
                {{ signupCopy.consentTerms }}
              </NuxtLink>
              {{ signupCopy.consentAnd }}
              <NuxtLink to="/privacy" class="border-b border-ink-900">
                {{ signupCopy.consentPrivacy }}
              </NuxtLink>.<span class="field-required">{{ signupCopy.requiredMark }}</span>
            </span>
          </label>
          <p v-if="showError && consentMissing" class="field-error" role="alert">
            {{ signupCopy.fieldRequired }}
          </p>
        </div>

        <!-- Honeypot — bots fill this, humans never see it. -->
        <div aria-hidden="true" class="absolute left-[-9999px]">
          <label for="signup-website">Laat dit veld leeg</label>
          <input id="signup-website" v-model="values.website" type="text" tabindex="-1" autocomplete="off">
        </div>

        <p v-if="showError" class="text-[13px] leading-[18.6px] text-danger" role="alert">
          {{ signupCopy.invalid }}
        </p>
        <p v-if="status === 'error'" class="text-[13px] leading-[18.6px] text-danger" role="alert">
          {{ errorMessage }}
        </p>

        <!--
          `Vorige` sits on its own line above a full-width `Volgende`: the live
          footer is a wrapping flex row and the next button spans it, so the
          back button can never share the line.
        -->
        <div class="mt-6 flex flex-wrap gap-2">
          <button
            v-if="step > 1"
            type="button"
            class="h-[38px] flex-none rounded-btn border border-field-line bg-ink-900 px-4 font-display text-[14px] leading-[14px] font-medium text-white transition hover:bg-ink-850"
            @click="back"
          >
            {{ signupCopy.back }}
          </button>
          <button
            type="submit"
            class="h-[49px] w-full rounded-btn bg-brand-500 font-display text-[15px] leading-[15px] font-bold text-ink-900 shadow-field transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
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
