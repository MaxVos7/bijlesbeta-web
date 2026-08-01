/**
 * Kennisbank articles.
 *
 * Deliberately a plain TypeScript module rather than a CMS: it keeps the
 * dependency surface at zero and the content typed. If the kennisbank grows
 * past ~20 articles or non-developers need to edit it, swap this for
 * @nuxt/content (markdown files) — the page components only depend on the
 * `Article` shape below.
 */

export type ArticleBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export type Article = {
  slug: string
  title: string
  category: 'Wiskunde' | 'Natuurkunde' | 'Scheikunde' | 'Studietips'
  excerpt: string
  readingMinutes: number
  publishedAt: string
  body: ArticleBlock[]
}

export const articles: Article[] = [
  {
    slug: 'effectief-leren-voor-je-wiskundetoets',
    title: 'Effectief leren voor je wiskundetoets',
    category: 'Studietips',
    excerpt:
      'Wiskunde leer je niet door te lezen, maar door te maken. Zo pak je de week voor een toets aan.',
    readingMinutes: 4,
    publishedAt: '2026-01-14',
    body: [
      {
        type: 'paragraph',
        text: 'De meeste leerlingen die bij ons binnenkomen met een onvoldoende voor wiskunde leren wél, maar op de verkeerde manier. Ze lezen de theorie door, kijken naar uitgewerkte voorbeelden en denken: dit snap ik. Tot ze voor een opgave zitten die net anders is.',
      },
      { type: 'heading', text: 'Begin bij de opgaven, niet bij de theorie' },
      {
        type: 'paragraph',
        text: 'Pak een opgave uit het hoofdstuk en probeer die te maken zonder eerst de theorie te herhalen. Waar je vastloopt, weet je precies wat je nog niet beheerst. Dat is waardevollere informatie dan een hoofdstuk dat je passief hebt doorgelezen.',
      },
      { type: 'heading', text: 'Werk met een foutenlijst' },
      {
        type: 'paragraph',
        text: 'Houd tijdens het oefenen bij welke fouten je maakt. Niet "ik snapte het niet", maar concreet: tekenfout bij het uitwerken van haakjes, verkeerde formule voor de afgeleide, eenheid vergeten. Na een paar dagen zie je een patroon, en dat patroon is je leerdoel.',
      },
      { type: 'heading', text: 'Een werkbare weekindeling' },
      {
        type: 'list',
        items: [
          'Dag 1–2: alle opgaven van het hoofdstuk maken, fouten noteren.',
          'Dag 3: alleen de onderwerpen uit je foutenlijst opnieuw oefenen.',
          'Dag 4: een oude toets of examenopgave maken op tijd.',
          'Dag 5: nakijken, laatste hiaten wegwerken, formules doornemen.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Loop je er alleen niet uit? Tijdens een proefles kijken we samen waar het misgaat en maken we een plan dat bij jouw toetsweek past.',
      },
    ],
  },
  {
    slug: 'formules-onthouden-bij-natuurkunde',
    title: 'Formules onthouden bij natuurkunde (zonder stampen)',
    category: 'Natuurkunde',
    excerpt:
      'Je hoeft niet elke formule uit je hoofd te kennen. Je moet weten wanneer je welke pakt.',
    readingMinutes: 5,
    publishedAt: '2026-02-03',
    body: [
      {
        type: 'paragraph',
        text: 'Natuurkunde voelt voor veel leerlingen als een lijst formules die je uit je hoofd moet leren. Maar bij het examen mag je BINAS gebruiken. Het probleem is dus zelden dat je de formule niet kent, maar dat je niet weet welke situatie om welke formule vraagt.',
      },
      { type: 'heading', text: 'Denk in grootheden, niet in formules' },
      {
        type: 'paragraph',
        text: 'Schrijf bij elke opgave eerst op wat gegeven is en wat gevraagd wordt, mét eenheden. Zoek daarna de formule die die grootheden verbindt. Deze gewoonte lost het grootste deel van de "ik weet niet waar ik moet beginnen"-problemen op.',
      },
      { type: 'heading', text: 'Controleer met eenheden' },
      {
        type: 'paragraph',
        text: 'Als je antwoord in meters per seconde moet zijn, maar je uitkomst heeft de eenheid joule, dan weet je dat er iets misging — nog voordat je het antwoord nakijkt. Eenheden zijn de goedkoopste controle die er is.',
      },
      { type: 'heading', text: 'Bouw je eigen overzicht' },
      {
        type: 'list',
        items: [
          'Per onderwerp: welke grootheden komen erin voor?',
          'Welke formules verbinden die grootheden?',
          'Welk type opgave hoort erbij, en aan welk signaalwoord herken je dat?',
        ],
      },
      {
        type: 'paragraph',
        text: 'Zo\'n overzicht maken is zelf al het halve leerwerk, en je houdt er een spiekbriefje aan over dat écht van jou is.',
      },
    ],
  },
  {
    slug: 'rekenen-aan-reacties-scheikunde',
    title: 'Rekenen aan reacties: de stappen die altijd werken',
    category: 'Scheikunde',
    excerpt:
      'Mol, massa, molmassa. Eén vast stappenplan waarmee je vrijwel elke rekenopgave uit de scheikunde aankunt.',
    readingMinutes: 6,
    publishedAt: '2026-03-11',
    body: [
      {
        type: 'paragraph',
        text: 'Rekenen aan reacties is het onderdeel waar de meeste punten liggen — en waar de meeste punten verloren gaan. Het goede nieuws: bijna elke opgave volgt hetzelfde stramien.',
      },
      { type: 'heading', text: 'Het stappenplan' },
      {
        type: 'list',
        items: [
          'Stap 1: schrijf de reactievergelijking op en maak hem kloppend.',
          'Stap 2: reken wat je hebt om naar mol (via massa en molmassa, of via volume en concentratie).',
          'Stap 3: gebruik de molverhouding uit de reactievergelijking om naar de gevraagde stof te gaan.',
          'Stap 4: reken van mol terug naar wat gevraagd wordt: gram, liter of concentratie.',
        ],
      },
      { type: 'heading', text: 'Waar het meestal misgaat' },
      {
        type: 'paragraph',
        text: 'Verreweg de meeste fouten ontstaan in stap 1 en stap 3. Een reactievergelijking die niet klopt maakt elke berekening daarna zinloos, en een omgekeerde molverhouding levert een antwoord op dat er plausibel uitziet maar fout is.',
      },
      { type: 'heading', text: 'Overmaat en ondermaat' },
      {
        type: 'paragraph',
        text: 'Krijg je hoeveelheden van twéé beginstoffen, dan is dat vrijwel altijd een overmaat-opgave. Reken voor beide stoffen uit hoeveel product ze zouden opleveren; de kleinste uitkomst is het antwoord, want die stof is op het eerst.',
      },
      {
        type: 'paragraph',
        text: 'Oefen dit stappenplan tot het automatisch gaat. Dan houd je tijdens de toets tijd en aandacht over voor de opgaven die echt om nadenken vragen.',
      },
    ],
  },
]

export const categories = ['Wiskunde', 'Natuurkunde', 'Scheikunde', 'Studietips'] as const

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}
