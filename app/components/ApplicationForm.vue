<script setup lang="ts">
import { werkenBij } from '~/data/site'

/*
  The docent application form from /werken-bij.

  Posts multipart to `/api/solliciteren`, which uploads the CV and then hands
  the application to the portal's `register-external-applicant` — the endpoint
  the Gravity Forms webhook uses today. The CV is a real upload, not a
  filename: the portal requires a `resume_url` and fetches it, so a submission
  without a readable file is refused rather than recorded half-complete.
*/

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  subjects: [] as string[],
  study: '',
  motivation: '',
  postalCode: '',
  houseNumber: '',
  heardFrom: '',
  privacy: false,
  // Honeypot — bots fill this, humans never see it.
  website: '',
})

const fileInput = ref<HTMLInputElement | null>(null)
const cvFile = ref<File | null>(null)
const cvFileName = computed(() => cvFile.value?.name ?? '')

/** `1,2 MB` / `340 KB`, in the Dutch decimal comma. */
const cvFileSize = computed(() => {
  const bytes = cvFile.value?.size ?? 0
  if (!bytes) return ''
  const mb = bytes / 1024 / 1024
  return mb >= 1 ? `${mb.toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
})

/** A chosen file the checks accept — the state the drop zone confirms. */
const cvAccepted = computed(() => Boolean(cvFile.value) && !errors.value.cv)

function clearCv() {
  cvFile.value = null
  // The input keeps its value, so without this the applicant can't re-pick the
  // same file: choosing it again would fire no `change` event.
  if (fileInput.value) fileInput.value.value = ''
  const { cv, ...rest } = errors.value
  errors.value = rest
}

/** What the portal's resume job can read back, mirrored in the API route. */
const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_CV_BYTES = 10 * 1024 * 1024

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  cvFile.value = file

  // Checked here as well as in the API route, so the applicant hears about a
  // file the portal can't read before they fill in the rest.
  const { cv, ...rest } = errors.value
  errors.value = rest

  if (!file) return
  if (file.size > MAX_CV_BYTES) {
    errors.value = { ...errors.value, cv: 'Je CV is te groot. Gebruik een bestand van maximaal 10 MB.' }
  }
  else if (!CV_TYPES.includes(file.type)) {
    errors.value = { ...errors.value, cv: 'Gebruik een pdf- of Word-bestand voor je CV.' }
  }
}

/** Caps on the controls themselves, from the same rules the checks read. */
const APPLICATION_MAX = maxLengths(APPLICATION_RULES)

/** The answers as they are posted: every text field trimmed. */
function trimmed(): Record<string, string> {
  const answers: Record<string, string> = {}
  for (const name of Object.keys(APPLICATION_RULES) as (keyof typeof APPLICATION_RULES)[]) {
    answers[name] = String(form[name] ?? '').trim()
  }
  return answers
}

/**
 * Checked against `APPLICATION_RULES`, the same table `/api/solliciteren`
 * builds its schema from, so nothing this form accepts can be refused by the
 * endpoint. It used to check the phone number and the presence of an answer
 * and nothing else — a motivation over 5000 characters or an e-mail zod
 * refuses cost the applicant everything they had typed, CV and all.
 *
 * The wording per field is kept where the shared copy would be blander; only
 * the rules are shared, not the Dutch.
 */
function validate() {
  // Trimmed exactly as `submit` trims them, so the check and the submission
  // see the same answers.
  const problems = checkForm(APPLICATION_RULES, trimmed())

  const next: Record<string, string> = {}
  for (const [name, problem] of Object.entries(problems)) next[name] = describeProblem(problem!)

  if (problems.firstName?.kind === 'required') next.firstName = 'Vul je voornaam in.'
  if (problems.lastName?.kind === 'required') next.lastName = 'Vul je achternaam in.'
  if (problems.phone?.kind === 'required') next.phone = 'Vul je telefoonnummer in.'
  if (problems.study?.kind === 'required') next.study = 'Vul je studie in.'
  if (problems.postalCode?.kind === 'required') next.postalCode = 'Vul je postcode in.'
  if (problems.houseNumber?.kind === 'required') next.houseNumber = 'Vul je huisnummer in.'
  if (problems.motivation?.kind === 'tooShort') {
    next.motivation = 'Vertel ons iets meer (minimaal 10 tekens).'
  }

  const subjects = checkList(APPLICATION_SUBJECTS_RULE, form.subjects)
  if (subjects) next.subjects = subjects.kind === 'tooFew' ? 'Kies minimaal één vak.' : describeProblem(subjects)

  if (!cvFile.value) next.cv = 'Voeg je CV toe om te solliciteren.'
  else if (cvFile.value.size > MAX_CV_BYTES) {
    next.cv = 'Je CV is te groot. Gebruik een bestand van maximaal 10 MB.'
  }
  else if (!CV_TYPES.includes(cvFile.value.type)) {
    next.cv = 'Gebruik een pdf- of Word-bestand voor je CV.'
  }
  if (!form.privacy) next.privacy = 'Ga akkoord met het privacybeleid om te versturen.'
  errors.value = next
  return Object.keys(next).length === 0
}

async function submit() {
  if (status.value === 'pending' || !validate()) return

  status.value = 'pending'
  errorMessage.value = ''

  // Multipart rather than JSON, so the CV travels with the answers. The text
  // parts are the ones `validate` just checked, rather than a second reading
  // of the form — the two can't describe different answers.
  const body = new FormData()
  for (const [name, value] of Object.entries(trimmed())) body.append(name, value)
  body.append('privacy', String(form.privacy))
  // One part per checked box; the route collects them back into an array.
  for (const subject of form.subjects) body.append('subjects', subject)
  if (cvFile.value) body.append('cv', cvFile.value, cvFile.value.name)

  try {
    const result = await $fetch('/api/solliciteren', { method: 'POST', body })

    // 200 with `ok: false` when it reached nobody — see `deliveryResult`.
    if (result.ok === false) {
      status.value = 'error'
      errorMessage.value = result.message
      return
    }

    status.value = 'success'
  }
  catch (error: any) {
    status.value = 'error'
    errorMessage.value
      = error?.data?.data?.message
        ?? 'Er ging iets mis bij het versturen. Probeer het later opnieuw of mail ons.'
  }
}
</script>

<template>
  <!--
    The live panel is a flat 8px white surface with 24px of padding and no
    elevation, so `panel`'s shadow is switched off here rather than removed
    from the utility, which other pages still want.
  -->
  <div class="panel min-w-0 self-start p-6 shadow-none">
    <div class="mb-[26px] text-center">
      <p class="mb-1 font-display text-[15px] font-bold text-accent-500">
        {{ werkenBij.apply.formKicker }}
      </p>
      <h3 class="text-[22px] leading-[44px] tracking-[-0.02em]">{{ werkenBij.apply.formTitle }}</h3>
    </div>

    <div
      v-if="status === 'success'"
      class="rounded-field border border-success-500 bg-success-50 p-6"
      role="status"
    >
      <h3 class="text-lg text-success-900">Bedankt voor je sollicitatie</h3>
      <p class="mt-2 text-sm leading-relaxed text-success-900">
        We hebben je gegevens ontvangen en nemen contact op voor het inplannen van een
        sollicitatiegesprek.
      </p>
    </div>

    <form v-else class="flex flex-col gap-5" novalidate @submit.prevent="submit">
      <div>
        <span class="field-label mb-1.5">
          Naam <span class="text-brand-700">(Vereist)</span>
        </span>
        <div class="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
          <div>
            <input
              id="sollicitatie-voornaam"
              v-model="form.firstName"
              :maxlength="APPLICATION_MAX.firstName"
              type="text"
              placeholder="Voornaam"
              autocomplete="given-name"
              class="field-input-lg"
              :aria-invalid="Boolean(errors.firstName)"
            >
            <label for="sollicitatie-voornaam" class="mt-1.5 block text-[12.5px] text-ink-500">
              Voornaam
            </label>
            <p v-if="errors.firstName" class="field-error">{{ errors.firstName }}</p>
          </div>
          <div>
            <input
              id="sollicitatie-achternaam"
              v-model="form.lastName"
              :maxlength="APPLICATION_MAX.lastName"
              type="text"
              placeholder="Achternaam"
              autocomplete="family-name"
              class="field-input-lg"
              :aria-invalid="Boolean(errors.lastName)"
            >
            <label for="sollicitatie-achternaam" class="mt-1.5 block text-[12.5px] text-ink-500">
              Achternaam
            </label>
            <p v-if="errors.lastName" class="field-error">{{ errors.lastName }}</p>
          </div>
        </div>
      </div>

      <div>
        <label for="sollicitatie-telefoon" class="field-label mb-1.5">
          Telefoon <span class="text-brand-700">(Vereist)</span>
        </label>
        <input
          id="sollicitatie-telefoon"
          v-model="form.phone"
          :maxlength="APPLICATION_MAX.phone"
          type="tel"
          placeholder="Telefoonnummer"
          autocomplete="tel"
          class="field-input-lg"
          :aria-invalid="Boolean(errors.phone)"
        >
        <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
      </div>

      <div>
        <label for="sollicitatie-email" class="field-label mb-1.5">
          E-mailadres <span class="text-brand-700">(Vereist)</span>
        </label>
        <input
          id="sollicitatie-email"
          v-model="form.email"
          :maxlength="APPLICATION_MAX.email"
          type="email"
          placeholder="E-mailadres"
          autocomplete="email"
          class="field-input-lg"
          :aria-invalid="Boolean(errors.email)"
        >
        <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
      </div>

      <fieldset>
        <legend class="field-label mb-2.5">
          Bijlesvakken <span class="text-brand-700">(Vereist)</span>
        </legend>
        <div
          class="grid gap-x-[18px] gap-y-2.5 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]"
        >
          <label
            v-for="option in werkenBij.subjectOptions"
            :key="option"
            class="flex items-center gap-2.5 text-[13.5px]"
          >
            <input
              v-model="form.subjects"
              type="checkbox"
              :value="option"
              class="h-5 w-5 flex-none accent-accent-500"
            >
            {{ option }}
          </label>
        </div>
        <p v-if="errors.subjects" class="field-error">{{ errors.subjects }}</p>
      </fieldset>

      <div>
        <label for="sollicitatie-studie" class="field-label mb-1.5">
          Mijn studie <span class="text-brand-700">(Vereist)</span>
        </label>
        <input
          id="sollicitatie-studie"
          v-model="form.study"
          :maxlength="APPLICATION_MAX.study"
          type="text"
          placeholder="Mijn studie"
          class="field-input-lg"
          :aria-invalid="Boolean(errors.study)"
        >
        <p v-if="errors.study" class="field-error">{{ errors.study }}</p>
      </div>

      <div>
        <label for="sollicitatie-motivatie" class="field-label mb-1.5">
          Mijn motivatie <span class="text-brand-700">(Vereist)</span>
        </label>
        <textarea
          id="sollicitatie-motivatie"
          v-model="form.motivation"
          :maxlength="APPLICATION_MAX.motivation"
          rows="6"
          placeholder="Mijn motivatie"
          class="field-input-lg resize-y py-0"
          :aria-invalid="Boolean(errors.motivation)"
        />
        <p v-if="errors.motivation" class="field-error">{{ errors.motivation }}</p>
      </div>

      <div>
        <span class="field-label mb-2">
          CV uploaden <span class="text-brand-700">(Vereist)</span>
        </span>
        <!--
          The chosen file has to be unmistakable: an attached CV that looks like
          an empty drop zone gets attached twice or not at all. So the accepted
          state changes the whole panel — a green wash and rule, a check rather
          than the upload cloud, and the name in full ink over its size — and
          offers a way back out.
        -->
        <div
          class="flex flex-col items-center justify-center gap-3 rounded-field border border-dashed px-5 py-[34px]"
          :class="
            cvAccepted
              ? 'border-success-500 bg-success-50'
              : errors.cv
                ? 'border-danger bg-white'
                : 'border-ink-300 bg-white'
          "
        >
          <svg
            v-if="cvAccepted"
            class="h-[30px] w-[30px] text-success-900"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
            <path d="M14 3v5h5" />
            <path d="M9.5 14l2 2 3.5-3.5" />
          </svg>
          <svg
            v-else
            class="h-[30px] w-[30px] text-brand-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M16.5 18H18a3.5 3.5 0 000-7 5 5 0 00-9.6-1.4A4 4 0 006.5 18H8" />
            <path d="M12 21V11M8.5 14.5L12 11l3.5 3.5" />
          </svg>

          <div v-if="cvAccepted" class="flex max-w-full flex-col items-center gap-1">
            <p class="max-w-full truncate text-[13.5px] font-semibold text-ink-800">
              {{ cvFileName }}
            </p>
            <p class="text-[12.5px] text-success-900">{{ cvFileSize }} · toegevoegd</p>
          </div>
          <p v-else class="max-w-full truncate text-[13.5px] text-ink-600">
            {{ cvFileName || 'Sleep bestanden hierheen of' }}
          </p>

          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            class="sr-only"
            :aria-invalid="Boolean(errors.cv)"
            @change="onFileChange"
          >
          <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <button type="button" class="btn-primary text-[13.5px]" @click="fileInput?.click()">
              {{ cvFile ? 'Ander bestand kiezen' : 'Selecteer bestanden' }}
            </button>
            <button
              v-if="cvFile"
              type="button"
              class="text-[13px] font-semibold text-ink-600 underline transition hover:text-ink-800"
              @click="clearCv"
            >
              Verwijderen
            </button>
          </div>
        </div>
        <!-- Sized off the constant so the promise and the check can't drift. -->
        <p class="mt-2.5 text-[12.5px] text-ink-500">
          Pdf of Word, max. {{ MAX_CV_BYTES / 1024 / 1024 }} MB.
        </p>
        <p v-if="errors.cv" class="field-error" role="alert">{{ errors.cv }}</p>
      </div>

      <div class="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        <div>
          <label for="sollicitatie-postcode" class="field-label mb-1.5">
            Postcode <span class="text-brand-700">(Vereist)</span>
          </label>
          <input
            id="sollicitatie-postcode"
            v-model="form.postalCode"
            :maxlength="APPLICATION_MAX.postalCode"
            type="text"
            placeholder="1234AB"
            autocomplete="postal-code"
            class="field-input-lg"
            :aria-invalid="Boolean(errors.postalCode)"
          >
          <p v-if="errors.postalCode" class="field-error">{{ errors.postalCode }}</p>
        </div>
        <div>
          <label for="sollicitatie-huisnummer" class="field-label mb-1.5">
            Huisnummer <span class="text-brand-700">(Vereist)</span>
          </label>
          <input
            id="sollicitatie-huisnummer"
            v-model="form.houseNumber"
            :maxlength="APPLICATION_MAX.houseNumber"
            type="text"
            placeholder="1A"
            class="field-input-lg"
            :aria-invalid="Boolean(errors.houseNumber)"
          >
          <p v-if="errors.houseNumber" class="field-error">{{ errors.houseNumber }}</p>
        </div>
      </div>

      <div>
        <label for="sollicitatie-bron" class="field-label mb-1.5">Ik ken jullie van</label>
        <input
          id="sollicitatie-bron"
          v-model="form.heardFrom"
          :maxlength="APPLICATION_MAX.heardFrom"
          type="text"
          placeholder="Ik ken jullie van"
          class="field-input-lg"
          :aria-invalid="Boolean(errors.heardFrom)"
        >
        <p v-if="errors.heardFrom" class="field-error">{{ errors.heardFrom }}</p>
      </div>

      <div aria-hidden="true" class="absolute left-[-9999px]">
        <label for="sollicitatie-website">Laat dit veld leeg</label>
        <input
          id="sollicitatie-website"
          v-model="form.website"
          type="text"
          tabindex="-1"
          autocomplete="off"
        >
      </div>

      <div>
        <label class="mt-3.5 flex items-start gap-3 text-[13.5px] leading-normal">
          <input
            v-model="form.privacy"
            type="checkbox"
            class="mt-0.5 h-5 w-5 flex-none accent-accent-500"
            :aria-invalid="Boolean(errors.privacy)"
          >
          <span>
            Ik ga akkoord met het
            <NuxtLink to="/privacy" class="underline">privacybeleid</NuxtLink>.<span
              class="text-brand-700"
            >(Vereist)</span>
          </span>
        </label>
        <p v-if="errors.privacy" class="field-error">{{ errors.privacy }}</p>
      </div>

      <p v-if="status === 'error'" class="field-error" role="alert">{{ errorMessage }}</p>

      <button type="submit" class="btn-primary w-full py-4 hover:bg-ink-900 hover:text-white" :disabled="status === 'pending'">
        {{ status === 'pending' ? 'Versturen…' : 'Aanmelden' }}
      </button>
    </form>
  </div>
</template>
