import { contact, socials } from '~/data/site'

/**
 * JSON-LD helpers.
 *
 * bijlesbeta.nl emits Article, FAQPage, WebSite, Person and ImageObject
 * through Rank Math. Dropping that at cutover costs visible rich results —
 * the FAQ accordions and article bylines Google renders in the SERP — which is
 * a ranking-adjacent loss that shows up as fewer clicks rather than a lower
 * position, and so is easy to miss.
 *
 * These emit the same shapes by hand. Every `@id` is an absolute URL so the
 * nodes can reference each other across pages.
 */

function origin() {
  return String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
}

/** Absolute, trailing-slashed — the same canonical form as everything else. */
function absolute(path: string) {
  return `${origin()}${path.endsWith('/') ? path : `${path}/`}`
}

function push(node: Record<string, unknown>) {
  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(node) }],
  })
}

/**
 * The organisation itself, on every page.
 *
 * `LocalBusiness` rather than plain `Organization`: this is a business with a
 * street address that serves one region, and the address is the part worth
 * making machine-readable.
 */
export function useOrganisationJsonLd() {
  push({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${origin()}/#organisation`,
    'name': 'Bijles Bèta',
    'url': `${origin()}/`,
    'telephone': contact.phone,
    'email': contact.email,
    'priceRange': '€€',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': contact.address.street,
      'postalCode': contact.address.postalCode,
      'addressLocality': contact.address.city,
      'addressCountry': 'NL',
    },
    'areaServed': { '@type': 'City', 'name': 'Groningen' },
    'sameAs': socials.map((social) => social.href),
  })
}

/** The site node, with the search action the live site also declares. */
export function useWebsiteJsonLd() {
  push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin()}/#website`,
    'url': `${origin()}/`,
    'name': 'Bijles Bèta',
    'inLanguage': 'nl-NL',
    'publisher': { '@id': `${origin()}/#organisation` },
  })
}

/** A kennisbank article. `image` and `author` are what Google surfaces. */
export function useArticleJsonLd(article: {
  slug: string
  title: string
  excerpt: string
  author: string
  publishedAt: string
  coverImage?: string
}) {
  push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.excerpt,
    'datePublished': article.publishedAt,
    'author': { '@type': 'Person', 'name': article.author },
    'publisher': { '@id': `${origin()}/#organisation` },
    'mainEntityOfPage': absolute(`/kennisbank/${article.slug}`),
    ...(article.coverImage ? { image: `${origin()}${article.coverImage}` } : {}),
  })
}

/**
 * An FAQ block. Only pass questions that are actually on the page — Google
 * treats FAQ markup describing invisible content as a violation, not a hint.
 */
export function useFaqJsonLd(items: readonly { question: string, answer: string, lead?: string }[]) {
  if (!items.length) return

  push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': items.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': [item.lead, item.answer].filter(Boolean).join(' '),
      },
    })),
  })
}

/** A docent profile, matching the Person node the live profiles carry. */
export function usePersonJsonLd(tutor: { name: string, slug: string, study: string, photo: string }) {
  push({
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': tutor.name,
    'url': absolute(`/docenten/${tutor.slug}`),
    'image': tutor.photo,
    'jobTitle': 'Bijlesdocent',
    'worksFor': { '@id': `${origin()}/#organisation` },
    'alumniOf': { '@type': 'CollegeOrUniversity', 'name': 'Rijksuniversiteit Groningen' },
    'knowsAbout': tutor.study,
  })
}
