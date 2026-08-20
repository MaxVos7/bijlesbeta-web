<script setup lang="ts">
/**
 * The short proefles form: name, phone, email, consent.
 *
 * Used twice on a landing page — once in the hero, once in TrialCta — so the
 * field ids are namespaced with `useId()` rather than hard-coded.
 *
 * **It does not end in a thank-you.** On the live site this is Gravity Forms
 * form 1, whose confirmation is a redirect to
 * `/aanmelden/?naam=…&telefoon=…&e-mailadres=…` — the block collects the three
 * fields that are most likely to be abandoned halfway through the wizard, and
 * then hands the visitor to the wizard with them already filled in. Turning
 * that back into a success message would strand every visitor one step short
 * of an actual registration.
 *
 * `/api/lead` mails the office in parallel, for the ones who still don't
 * finish. See "The proefles block" in CLAUDE.md before changing either half.
 */
const props = withDefaults(
  defineProps<{
    /** Where the block sits, mailed to the office as form 1's page field is. */
    source?: string
  }>(),
  { source: '' },
)

const uid = useId()
const route = useRoute()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  consent: false,
  // Honeypot — bots fill this, humans never see it.
  website: '',
})

/** Caps on the controls themselves, from the same rules the checks read. */
const LEAD_MAX = maxLengths(LEAD_RULES)

const status = ref<'idle' | 'pending' | 'error'>('idle')
const message = ref('')

/** The body that would be posted, and what `LEAD_RULES` is checked against. */
const payload = () => ({
  name: form.name,
  phone: form.phone,
  email: form.email,
  page: props.source || route.path,
  website: form.website,
})

/*
  Live form 1 requires the name and the phone number and leaves the e-mail
  optional — the reverse of what this form used to ask for. The number is what
  the office rings when somebody drops out of the wizard, so it is the field
  that must not be missing, and the address is the one that can be.
*/
function submit() {
  if (status.value === 'pending') return

  if (!form.name.trim() || !form.phone.trim() || !form.consent) {
    status.value = 'error'
    message.value = 'Vul je naam en telefoonnummer in en ga akkoord met het privacybeleid.'
    return
  }

  /*
    Checked against the same `LEAD_RULES` the route parses with — the number so
    that what lands in the query string is one `/aanmelden` will accept (see
    `shared/utils/phone.ts`), and the address because this form checked it
    nowhere at all. A typo there used to 422 the POST, and nobody ever found
    out: the visitor is redirected regardless and the result is ignored, so the
    lead mail the office follows up on simply never arrived.
  */
  const problem = Object.values(checkForm(LEAD_RULES, payload()))[0]

  if (problem) {
    status.value = 'error'
    message.value = problem.kind === 'phone'
      ? 'Vul een geldig telefoonnummer in, bijvoorbeeld 0612345678.'
      : describeProblem(problem)
    return
  }

  status.value = 'pending'
  message.value = ''

  handOff()
}

async function handOff() {
  /*
    Deliberately not awaited before the redirect, and deliberately not allowed
    to stop it. The visitor's next step is the wizard; a mail that didn't leave
    is our problem, and their details travel in the URL either way. `catch`
    swallows rather than reports for the same reason — there is nothing the
    visitor could do about it, and they are already on the next page.
  */
  $fetch('/api/lead', { method: 'POST', body: payload() }).catch(() => {})

  /*
    The same three parameter names the live confirmation uses, so links and
    bookmarks that were built against bijlesbeta.nl still prefill here. The
    trailing slash is the canonical form — see the SEO section in CLAUDE.md.
  */
  await navigateTo({
    path: '/aanmelden/',
    query: {
      naam: form.name.trim(),
      telefoon: normalisePhone(form.phone) ?? form.phone.trim(),
      ...(form.email.trim() ? { 'e-mailadres': form.email.trim() } : {}),
    },
  })
}
</script>

<template>
  <div>
    <form class="flex flex-col gap-3.5" novalidate @submit.prevent="submit">
      <label class="sr-only" :for="`${uid}-name`">Naam</label>
      <input :id="`${uid}-name`" v-model="form.name" :maxlength="LEAD_MAX.name" class="field-input mt-0" type="text" placeholder="Naam" autocomplete="name">

      <label class="sr-only" :for="`${uid}-phone`">Telefoonnummer</label>
      <input :id="`${uid}-phone`" v-model="form.phone" :maxlength="LEAD_MAX.phone" class="field-input mt-0" type="tel" placeholder="Telefoonnummer" autocomplete="tel">

      <label class="sr-only" :for="`${uid}-email`">E-mailadres</label>
      <input :id="`${uid}-email`" v-model="form.email" :maxlength="LEAD_MAX.email" class="field-input mt-0" type="email" placeholder="E-mailadres" autocomplete="email">

      <label class="group flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-normal text-ink-700">
        <input v-model="form.consent" class="sr-only" type="checkbox">
        <span
          class="mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded border-[1.5px] border-field-line bg-white transition group-has-[:checked]:border-accent-500 group-has-[:checked]:bg-accent-400 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
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
        <!-- "privacybeleid" is set plain here, not as a link, matching the live
             form. The linked version still stands in the longer SignupForm. -->
        <span>Ik ga akkoord met het privacybeleid.<span class="text-danger">(Vereist)</span></span>
      </label>

      <div aria-hidden="true" class="absolute left-[-9999px]">
        <label :for="`${uid}-website`">Laat dit veld leeg</label>
        <input :id="`${uid}-website`" v-model="form.website" type="text" tabindex="-1" autocomplete="off">
      </div>

      <p v-if="status === 'error'" class="text-[12.5px] text-danger" role="alert">{{ message }}</p>

      <button
        type="submit"
        class="btn-primary w-full py-[17px] leading-[15px]"
        :disabled="status === 'pending'"
      >
        {{ status === 'pending' ? 'Even geduld…' : 'Proefles claimen' }}
      </button>
    </form>
  </div>
</template>
