<script setup lang="ts">
/**
 * Renders one legal document: hero, numbered articles and the contact panel.
 *
 * Both /algemene-voorwaarden and /privacy use it, so the two documents can
 * never drift apart in layout. The content itself is data — see
 * `app/data/legal.ts`.
 */
import type { LegalDocument } from '~/data/legal'
import { company } from '~/data/legal'
import { contact } from '~/data/site'

defineProps<{ doc: LegalDocument }>()
</script>

<template>
  <div>
    <PageHero eyebrow="Juridisch" :title="doc.title" :intro="doc.meta" />

    <!-- Slot for the PDF band on the algemene voorwaarden. -->
    <slot name="before-body" />

    <section class="section bg-white">
      <div class="container-page max-w-[820px]">
        <template v-for="(block, i) in doc.intro ?? []" :key="`intro-${i}`">
          <p v-if="block.kind === 'p'" class="mb-4 leading-relaxed text-ink-700">
            {{ block.items[0]?.text }}
          </p>
        </template>

        <article
          v-for="(section, index) in doc.sections"
          :id="`artikel-${index + 1}`"
          :key="section.title"
          class="mt-11 scroll-mt-28 first:mt-8"
        >
          <h2 class="mb-4 text-[clamp(19px,1.9vw,22px)] tracking-[-0.02em]">
            {{ index + 1 }}. {{ section.title }}
          </h2>

          <template v-for="(block, b) in section.blocks" :key="b">
            <h3 v-if="block.kind === 'h3'" class="mt-6 mb-2 text-[15px]">
              {{ block.items[0]?.text }}
            </h3>

            <p v-else-if="block.kind === 'p'" class="mb-4 leading-relaxed text-ink-700">
              <template v-for="(item, k) in block.items" :key="k">
                <strong v-if="item.lead" class="font-bold text-ink-900">{{ item.lead }} </strong>
                <span>{{ item.text }}</span>
                <a
                  v-if="item.link"
                  :href="item.link.href"
                  class="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-700"
                >{{ item.link.label }}</a>
                <span v-if="item.after">{{ item.after }}</span>
              </template>
            </p>

            <component
              v-else
              :is="block.kind === 'ol' ? 'ol' : 'ul'"
              class="mb-4 flex flex-col gap-2.5 pl-6 leading-relaxed text-ink-700"
              :class="block.kind === 'ol' ? 'list-decimal' : 'list-disc'"
            >
              <li v-for="(item, k) in block.items" :key="k" class="pl-1">
                <strong v-if="item.lead" class="font-bold text-ink-900">{{ item.lead }} </strong>
                <span>{{ item.text }}</span>
                <a
                  v-if="item.link"
                  :href="item.link.href"
                  class="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-700"
                >{{ item.link.label }}</a>
                <span v-if="item.after">{{ item.after }}</span>
              </li>
            </component>
          </template>
        </article>

        <aside class="mt-12 rounded-panel border border-line-200 bg-mist p-6 sm:p-8">
          <h2 class="mb-3 text-[clamp(18px,1.8vw,21px)] tracking-[-0.02em]">
            {{ doc.contact.title }}
          </h2>
          <p v-if="doc.contact.body" class="mb-4 leading-relaxed text-ink-700">
            {{ doc.contact.body }}
          </p>
          <p class="font-bold">{{ company.legalName }}</p>
          <p class="text-ink-700">
            {{ contact.address.street }}, {{ contact.address.postalCode }}
            {{ contact.address.city }}
          </p>
          <p class="text-ink-700">
            E-mail:
            <a :href="company.emailHref" class="font-medium text-brand-700">{{ company.email }}</a>
          </p>
          <p class="text-ink-700">
            Telefoon:
            <a :href="company.phoneHref" class="font-medium text-brand-700">{{ company.phone }}</a>
          </p>
          <p class="text-ink-700">KvK-nummer: {{ company.kvk }}</p>
        </aside>
      </div>
    </section>
  </div>
</template>
