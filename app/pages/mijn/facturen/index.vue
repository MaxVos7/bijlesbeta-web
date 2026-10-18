<script setup lang="ts">
import { mijnInvoices } from '~/data/mijn'

/*
  A customer's invoices: what the invoices page on mijn.bijlesbeta.nl shows a
  customer, from `GET api/invoices`. Paying happens on the billing provider's
  own page; the PDF comes through `/api/mijn/invoices/<id>/pdf`.
*/
definePageMeta({
  layout: 'mijn',
  middleware: [
    'mijn',
    () => {
      const { user } = useMijnSession()
      if (user.value && !user.value.is_customer) return navigateTo('/mijn/', { replace: true })
    },
  ],
})
useHead({ title: mijnInvoices.title })

type Invoice = {
  id: string
  number: string | null
  month: string | null
  amount_due: number
  status: string | null
  pay_url: string | null
}

const api = useMijnApi()

const invoices = ref<Invoice[]>([])
const loading = ref(true)
const error = ref('')

/** "oktober 2026" from the API's `Y-m`. */
function invoiceMonth(month: string | null) {
  if (!month) return ''
  const [y, m] = month.split('-').map(Number)
  return new Date(y!, m! - 1, 1).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
}

/** "€ 123,45" from cents. */
function euros(cents: number) {
  return (cents / 100).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

onMounted(async () => {
  try {
    const result = await api<{ data: Invoice[] }>('invoices')
    invoices.value = result.data
  }
  catch (e) {
    error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-page">
    <p class="kicker">{{ mijnInvoices.kicker }}</p>
    <h1 class="mt-3 text-[32px] leading-[44px]">{{ mijnInvoices.title }}</h1>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>

    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ mijnInvoices.loading }}</p>

    <div v-else-if="!invoices.length && !error" class="panel mt-6 p-6 text-[15px] text-ink-700 sm:p-9">
      {{ mijnInvoices.empty }}
    </div>

    <ul v-else class="mt-6 flex flex-col gap-3">
      <li
        v-for="invoice in invoices"
        :key="invoice.id"
        class="panel flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6"
      >
        <div class="min-w-0">
          <p class="font-display text-[16px] font-bold text-ink-900 first-letter:uppercase">
            {{ invoiceMonth(invoice.month) }}
          </p>
          <p v-if="invoice.number" class="mt-1 text-[13px] text-ink-700">
            {{ mijnInvoices.number }} {{ invoice.number }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span class="font-display text-[16px] font-bold text-ink-900">{{ euros(invoice.amount_due) }}</span>
          <span
            v-if="invoice.status"
            class="rounded-btn px-2 py-0.5 font-display text-[12px] font-bold"
            :class="invoice.status === 'paid'
              ? 'bg-success-50 text-success-900'
              : invoice.status === 'open'
                ? 'bg-brand-500 text-ink-900'
                : 'border border-black/10 text-ink-800'"
          >
            {{ mijnInvoices.status[invoice.status] ?? invoice.status }}
          </span>

          <a
            :href="`/api/mijn/invoices/${encodeURIComponent(invoice.id)}/pdf`"
            target="_blank"
            rel="noopener"
            class="btn-secondary"
          >
            {{ mijnInvoices.pdf }}
          </a>
          <a
            v-if="invoice.pay_url"
            :href="invoice.pay_url"
            target="_blank"
            rel="noopener"
            class="btn-primary"
          >
            {{ mijnInvoices.pay }}
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>
