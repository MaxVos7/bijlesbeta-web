<script setup lang="ts">
import { mijnTrainings as copy } from '~/data/mijn'

/*
  The trainings a customer is invited to, from `GET api/trainings`, and the
  sessions they sign up for (`POST api/trainings/<id>/signup`). A link in the
  invitation opens this page on that invitation (`?uitnodiging=<id>`).
*/
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })
useHead({ title: copy.title })

type Session = {
  id: number
  start_at: string | null
  end_at: string | null
  location: string | null
  provider_name: string | null
  is_full: boolean
}

type Invitation = {
  id: number
  name: string
  description: string | null
  enrolled_event_ids: number[]
  events: Session[]
}

const route = useRoute()
const api = useMijnApi()

const invitations = ref<Invitation[]>([])
const chosen = reactive<Record<number, number[]>>({})
const loading = ref(true)
const error = ref('')
const pendingId = ref<number | null>(null)
const savedId = ref<number | null>(null)

const highlighted = computed(() => Number(route.query.uitnodiging) || null)

const when = new Intl.DateTimeFormat('nl-NL', {
  weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
})
const time = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit' })

function describe(session: Session) {
  if (!session.start_at) return ''
  const start = when.format(new Date(session.start_at))
  return session.end_at ? `${start} – ${time.format(new Date(session.end_at))}` : start
}

onMounted(async () => {
  try {
    invitations.value = (await api<{ data: Invitation[] }>('trainings')).data
    for (const invitation of invitations.value) chosen[invitation.id] = [...invitation.enrolled_event_ids]
  }
  catch (e) {
    error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})

async function save(invitation: Invitation) {
  pendingId.value = invitation.id
  savedId.value = null
  error.value = ''

  try {
    await api(`trainings/${invitation.id}/signup`, { method: 'POST', body: { event_ids: chosen[invitation.id] } })
    invitation.enrolled_event_ids = [...chosen[invitation.id]!]
    savedId.value = invitation.id
  }
  catch (e) {
    error.value = mijnErrorMessage(e)
  }
  finally {
    pendingId.value = null
  }
}
</script>

<template>
  <div class="container-page">
    <p class="kicker">{{ copy.kicker }}</p>
    <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.title }}</h1>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ copy.loading }}</p>

    <div v-else-if="!invitations.length && !error" class="panel mt-6 p-6 text-[15px] text-ink-700 sm:p-9">
      {{ copy.empty }}
    </div>

    <div v-else class="mt-6 flex flex-col gap-6">
      <section
        v-for="invitation in invitations"
        :key="invitation.id"
        class="panel p-6 sm:p-9"
        :class="{ 'ring-2 ring-brand-500': invitation.id === highlighted }"
      >
        <h2 class="font-display text-[22px] font-bold text-ink-900">{{ invitation.name }}</h2>
        <p v-if="invitation.description" class="mt-2 text-[15px] leading-relaxed text-ink-700">{{ invitation.description }}</p>
        <p class="mt-4 text-[14px] font-semibold text-ink-800">{{ copy.sessions }}</p>

        <ul class="mt-3 flex flex-col gap-3">
          <li v-for="session in invitation.events" :key="session.id">
            <label class="flex items-start gap-3 text-[15px] text-ink-900" :class="{ 'opacity-60': session.is_full }">
              <input
                v-model="chosen[invitation.id]"
                type="checkbox"
                class="mt-1"
                :value="session.id"
                :disabled="session.is_full"
              >
              <span>
                {{ describe(session) }}
                <span v-if="session.is_full" class="ml-1 font-semibold">({{ copy.full }})</span>
                <span v-if="session.location || session.provider_name" class="block text-[14px] text-ink-700">
                  {{ [session.location, session.provider_name].filter(Boolean).join(' · ') }}
                </span>
              </span>
            </label>
          </li>
        </ul>

        <div class="mt-6 flex flex-wrap items-center gap-4">
          <button type="button" class="btn-primary" :disabled="pendingId === invitation.id" @click="save(invitation)">
            {{ pendingId === invitation.id ? copy.pending : copy.save }}
          </button>
          <p v-if="savedId === invitation.id" class="text-[14px] text-success-900" role="status">{{ copy.saved }}</p>
        </div>
      </section>
    </div>
  </div>
</template>
