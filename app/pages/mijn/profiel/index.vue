<script setup lang="ts">
import { mijnProfile as copy } from '~/data/mijn'

/*
  The account's details, from `GET api/account`. Read-only, as on the portal:
  a customer can't edit them there either, so a wrong detail goes through the
  office. The password is the one thing the account changes itself.
*/
definePageMeta({ layout: 'mijn', middleware: 'mijn' })
useHead({ title: copy.title })

type Account = {
  name: string
  email: string
  phone_number: string | null
  address: string | null
  address_comment: string | null
  children: Array<{ id: number, name: string }>
  strips: null | {
    remaining_minutes: number
    items: Array<{ id: number, minutes: number, ends_at: string | null }>
  }
}

const api = useMijnApi()

const account = ref<Account | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    account.value = (await api<{ data: Account }>('account')).data
  }
  catch (e) {
    error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})

const rows = computed(() => {
  const a = account.value
  if (!a) return []

  return [
    { label: copy.name, value: a.name },
    { label: copy.email, value: a.email },
    { label: copy.phone, value: a.phone_number },
    { label: copy.address, value: a.address },
    ...(a.address_comment ? [{ label: copy.addressComment, value: a.address_comment }] : []),
  ]
})
</script>

<template>
  <div class="container-page">
    <p class="kicker">{{ copy.kicker }}</p>
    <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.title }}</h1>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ copy.loading }}</p>

    <template v-else-if="account">
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <section class="panel p-6 sm:p-7">
          <h2 class="font-display text-[18px] font-bold text-ink-900">{{ copy.detailsTitle }}</h2>
          <dl class="mt-4 flex flex-col gap-3 text-[15px]">
            <div v-for="row in rows" :key="row.label">
              <dt class="text-[13px] text-ink-700">{{ row.label }}</dt>
              <dd class="text-ink-900">{{ row.value || copy.empty }}</dd>
            </div>
            <div v-if="account.children.length">
              <dt class="text-[13px] text-ink-700">{{ copy.children }}</dt>
              <dd class="text-ink-900">
                <template v-for="(child, i) in account.children" :key="child.id">
                  <NuxtLink :to="`/mijn/leerlingen/${child.id}/`" class="underline">{{ child.name }}</NuxtLink><template v-if="i < account.children.length - 1">, </template>
                </template>
              </dd>
            </div>
          </dl>
          <p class="mt-5 text-[14px] text-ink-700">
            {{ copy.changeNote }}
            <NuxtLink to="/contact/" class="font-semibold text-ink-800 underline">{{ copy.contact }}</NuxtLink>
          </p>
        </section>

        <div class="flex flex-col gap-4">
          <section class="panel p-6 sm:p-7">
            <h2 class="font-display text-[18px] font-bold text-ink-900">{{ copy.passwordTitle }}</h2>
            <NuxtLink to="/mijn/wachtwoord/" class="btn-secondary mt-4">{{ copy.passwordCta }}</NuxtLink>
          </section>

          <section v-if="account.strips" class="panel p-6 sm:p-7">
            <h2 class="font-display text-[18px] font-bold text-ink-900">{{ copy.stripsTitle }}</h2>
            <p class="mt-3 text-[15px] text-ink-800">
              {{ copy.stripsRemaining(hoursAndMinutes(account.strips.remaining_minutes)) }}
            </p>
            <table v-if="account.strips.items.length" class="mt-4 w-full text-left text-[14px]">
              <thead>
                <tr class="text-[13px] text-ink-700">
                  <th class="pb-2 font-normal">{{ copy.stripsMinutes }}</th>
                  <th class="pb-2 font-normal">{{ copy.stripsEndsAt }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="strip in account.strips.items" :key="strip.id" class="border-t border-line-200">
                  <td class="py-2 text-ink-900">
                    {{ hoursAndMinutes(strip.minutes) }}<template v-if="strip.minutes < 0"> {{ copy.stripsNegative }}</template>
                  </td>
                  <td class="py-2 text-ink-900">{{ strip.ends_at ? longDate(strip.ends_at) : copy.empty }}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
