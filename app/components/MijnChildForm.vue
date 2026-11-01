<script setup lang="ts">
import { mijnChildForm as copy } from '~/data/mijn'
import type { MijnChild } from '~/utils/mijn-types'

/*
  Adding a child and editing one share this form: `POST api/children` and
  `PATCH api/children/<id>`. The portal's own add and edit forms allowed the
  same fields. Who tutors a child and whether they are active stay with the
  office.
*/
const props = defineProps<{ child?: MijnChild }>()

type Options = {
  subjects: Array<{ id: number, name: string }>
  levels: Array<{ id: number, name: string }>
  max_subjects: number | null
}

const api = useMijnApi()

const options = ref<Options | null>(null)
const form = reactive({
  first_name: props.child?.first_name ?? '',
  last_name: props.child?.last_name ?? '',
  year: props.child?.year ? String(props.child.year) : '',
  level_id: props.child?.level_id ? String(props.child.level_id) : '',
  subjects: [...(props.child?.subject_ids ?? [])] as number[],
  school: props.child?.school ?? '',
  location_indication: '',
  date_time_indication: '',
})
const pending = ref(false)
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

onMounted(async () => {
  try {
    options.value = await api<Options>('children/options')
  }
  catch (e) {
    errorMessage.value = mijnErrorMessage(e)
  }
})

const atMaxSubjects = computed(() => {
  const max = options.value?.max_subjects
  return !!max && form.subjects.length >= max
})

/** A blank optional field is left out when editing, so it never wipes what the office filled in. */
function body() {
  const info: Record<string, unknown> = {
    [props.child ? 'current_year' : 'year']: form.year || null,
    level_id: form.level_id || null,
    subjects: form.subjects,
    school: form.school || null,
  }

  if (form.location_indication) info.location_indication = form.location_indication
  if (form.date_time_indication) info.date_time_indication = form.date_time_indication

  return {
    first_name: form.first_name,
    last_name: form.last_name || null,
    receiver_information: info,
  }
}

async function onSubmit() {
  pending.value = true
  errors.value = {}
  errorMessage.value = ''

  try {
    const saved = props.child
      ? await api<{ data: MijnChild }>(`children/${props.child.id}`, { method: 'PATCH', body: body() })
      : await api<{ data: MijnChild }>('children', { method: 'POST', body: body() })

    await navigateTo(`/mijn/leerlingen/${saved.data.id}/`)
  }
  catch (e: any) {
    const fieldErrors: Record<string, string[]> = e?.data?.errors ?? {}

    if ((e?.statusCode ?? e?.status) === 422 && Object.keys(fieldErrors).length) {
      errors.value = Object.fromEntries(Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0] ?? '']))
    }
    else {
      errorMessage.value = mijnErrorMessage(e)
    }
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <p v-if="!options && !errorMessage" class="mt-8 text-[15px] text-ink-700">{{ copy.loading }}</p>

  <form v-else-if="options" class="panel mt-6 flex max-w-[640px] flex-col gap-5 p-6 sm:p-9" novalidate @submit.prevent="onSubmit">
    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="child-first-name" class="field-label">{{ copy.firstName }}</label>
        <input id="child-first-name" v-model="form.first_name" type="text" required class="field-input" :aria-invalid="!!errors.first_name">
        <p v-if="errors.first_name" class="field-error">{{ errors.first_name }}</p>
      </div>
      <div>
        <label for="child-last-name" class="field-label">{{ copy.lastName }}</label>
        <input id="child-last-name" v-model="form.last_name" type="text" class="field-input" :aria-invalid="!!errors.last_name">
        <p v-if="errors.last_name" class="field-error">{{ errors.last_name }}</p>
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="child-year" class="field-label">{{ copy.year }}</label>
        <select id="child-year" v-model="form.year" class="field-input">
          <option value="">–</option>
          <option v-for="n in 8" :key="n" :value="String(n)">{{ n }}</option>
        </select>
        <p v-if="errors['receiver_information.year'] || errors['receiver_information.current_year']" class="field-error">
          {{ errors['receiver_information.year'] || errors['receiver_information.current_year'] }}
        </p>
        <p v-else class="field-hint mt-1.5">{{ copy.yearHint }}</p>
      </div>
      <div>
        <label for="child-level" class="field-label">{{ copy.level }}</label>
        <select id="child-level" v-model="form.level_id" class="field-input">
          <option value="">{{ copy.levelNone }}</option>
          <option v-for="level in options.levels" :key="level.id" :value="String(level.id)">{{ level.name }}</option>
        </select>
        <p v-if="errors['receiver_information.level_id']" class="field-error">{{ errors['receiver_information.level_id'] }}</p>
      </div>
    </div>

    <fieldset>
      <legend class="field-label">{{ copy.subjects }}</legend>
      <div class="mt-2 flex flex-wrap gap-x-5 gap-y-2">
        <label
          v-for="subject in options.subjects"
          :key="subject.id"
          class="flex items-center gap-2 text-[15px] text-ink-900"
        >
          <input
            v-model="form.subjects"
            type="checkbox"
            :value="subject.id"
            :disabled="atMaxSubjects && !form.subjects.includes(subject.id)"
          >
          {{ subject.name }}
        </label>
      </div>
      <p v-if="errors['receiver_information.subjects']" class="field-error">{{ errors['receiver_information.subjects'] }}</p>
      <p v-else class="field-hint mt-1.5">
        {{ options.max_subjects ? copy.subjectsMax(options.max_subjects) : copy.subjectsHint }}
      </p>
    </fieldset>

    <div>
      <label for="child-school" class="field-label">{{ copy.school }}</label>
      <input id="child-school" v-model="form.school" type="text" class="field-input">
      <p v-if="errors['receiver_information.school']" class="field-error">{{ errors['receiver_information.school'] }}</p>
    </div>

    <div>
      <label for="child-location" class="field-label">{{ copy.location }}</label>
      <textarea id="child-location" v-model="form.location_indication" rows="2" class="field-input" />
      <p class="field-hint mt-1.5">{{ copy.locationHint }}</p>
    </div>

    <div>
      <label for="child-datetime" class="field-label">{{ copy.dateTime }}</label>
      <textarea id="child-datetime" v-model="form.date_time_indication" rows="2" class="field-input" />
      <p class="field-hint mt-1.5">{{ copy.dateTimeHint }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button type="submit" class="btn-primary" :disabled="pending">
        {{ pending ? copy.pending : copy.submit }}
      </button>
      <NuxtLink
        :to="child ? `/mijn/leerlingen/${child.id}/` : '/mijn/leerlingen/'"
        class="text-[14px] font-semibold text-ink-800 underline"
      >
        {{ copy.cancel }}
      </NuxtLink>
    </div>

    <p v-if="errorMessage" class="field-error mt-0" role="alert">{{ errorMessage }}</p>
  </form>

  <p v-else class="field-error mt-6" role="alert">{{ errorMessage }}</p>
</template>
