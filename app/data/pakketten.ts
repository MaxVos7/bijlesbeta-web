/**
 * `/pakketten` — how a package works, in the customer's words.
 *
 * The rules here must stay in step with the terms in `legal.ts`; the page is
 * the explanation, the terms are the contract.
 */

export const pakkettenPage = {
  seoTitle: 'Zo werken onze pakketten',
  seoDescription:
    'Een pakket loopt vier lesweken. Jij kiest je startweek, vakanties tellen niet mee en ongebruikte uren worden tegoed. Alle regels op een rij.',
  kicker: 'Pakketten',
  title: 'Zo werken onze pakketten',
  intro:
    'Een pakket loopt vier lesweken. Jij kiest in welke week je start, we sturen aan het begin de factuur en vakanties tellen niet mee. De zomervakantie is een pauze.',
  primaryCta: 'Gratis proefles',
  faqCta: 'Veelgestelde vragen',
} as const

export const pakketSteps = [
  {
    title: 'Kies je startweek',
    body: 'Je start deze week, of in een week die jou uitkomt. Je hoeft niet te wachten tot de eerste van de maand.',
  },
  {
    title: 'Je krijgt de factuur',
    body: 'Aan het begin van je pakket sturen we de factuur voor de hele periode. Je kunt al beginnen met bijles voordat je betaald hebt.',
  },
  {
    title: 'Vier lesweken bijles',
    body: 'Je pakket loopt vier lesweken. Zit er een vakantieweek tussen, dan loopt je pakket een week langer door.',
  },
  {
    title: 'Daarna loopt het door',
    body: 'Na vier lesweken begint vanzelf je volgende periode, met een nieuwe factuur. Wil je stoppen, laat het ons dan uiterlijk een week voor het einde van je periode weten.',
  },
] as const

/** A week in the timeline diagrams. */
export type WeekCell = { label: string; kind: 'les' | 'vakantie' | 'nieuw'; span?: number; note?: string }

export const vakantie = {
  title: 'Vakantieweken tellen niet mee',
  body: 'We rekenen in lesweken. In een schoolvakantie vallen er geen lessen, en die week gaat dus ook niet van je pakket af. Je krijgt altijd vier volle lesweken.',
  withoutLabel: 'Zonder vakantie',
  without: [
    { label: 'Lesweek 1', kind: 'les' },
    { label: 'Lesweek 2', kind: 'les' },
    { label: 'Lesweek 3', kind: 'les' },
    { label: 'Lesweek 4', kind: 'les' },
  ] as WeekCell[],
  withLabel: 'Met een vakantieweek',
  with: [
    { label: 'Lesweek 1', kind: 'les' },
    { label: 'Lesweek 2', kind: 'les' },
    { label: 'Vakantie', kind: 'vakantie', note: 'telt niet mee' },
    { label: 'Lesweek 3', kind: 'les' },
    { label: 'Lesweek 4', kind: 'les' },
  ] as WeekCell[],
  caption:
    'Voorbeeld. Welke weken vakantie zijn, staat bij ons vast. Je ziet de einddatum van je pakket terug in je factuur.',
  summerTitle: 'De zomervakantie werkt anders',
  summerBody:
    'Een pakket loopt niet door de zomervakantie heen. Als de zomervakantie begint terwijl je periode nog loopt, eindigt je periode daar. Je betaalt dan voor de lesweken die je hebt gehad, en je uren gaan naar rato mee: twee van de vier lesweken betekent de helft van de uren. Je nieuwe periode begint in de eerste lesweek na de zomer.',
  summerLabel: 'Een periode die voor de zomer begint',
  summer: [
    { label: 'Lesweek 1', kind: 'les' },
    { label: 'Lesweek 2', kind: 'les' },
    { label: 'Zomervakantie', kind: 'vakantie', span: 2, note: 'pauze, geen pakket' },
    { label: 'Nieuwe periode', kind: 'nieuw' },
  ] as WeekCell[],
  summerCaption:
    'Voorbeeld. Je betaalt voor twee lesweken en krijgt de helft van de uren van je pakket. Je tegoed blijft in de zomer gewoon staan.',
} as const

export const uren = {
  title: 'Zo werken de uren',
  body: 'In je pakket zit een vast aantal uren voor de vier lesweken, bijvoorbeeld 8 uur bij Standaard. Hoe je die uren over de weken verdeelt, bepaal je met je docent.',
  outcomes: [
    { title: 'Minder uren gevolgd', body: 'Wat je overhoudt wordt tegoed. Dat gebruik je in een volgende periode.' },
    { title: 'Precies je uren', body: 'Dan is er niets bij te rekenen en niets over.' },
    {
      title: 'Meer uren gevolgd',
      body: 'Je tegoed gaat eerst op. Daarna betaal je extra uren tegen het uurtarief van je pakket, kort na het einde van je periode.',
    },
  ],
  exampleTitle: 'Voorbeeld met een pakket van 8 uur',
  /** `package` = uit je pakket, `credit` = uit je tegoed, `extra`, `unused`. */
  periods: [
    {
      title: 'Eerste periode',
      sub: '8 uur in je pakket',
      blocks: ['package', 'package', 'package', 'package', 'package', 'package', 'unused', 'unused'],
      resultHtml: 'Je volgt <b>6 uur</b>. Er blijft <b>2 uur tegoed</b> over.',
    },
    {
      title: 'Tweede periode',
      sub: '8 uur in je pakket + 2 uur tegoed',
      blocks: [
        'package', 'package', 'package', 'package', 'package', 'package', 'package', 'package',
        'credit', 'credit', 'extra',
      ],
      resultHtml: 'Je volgt <b>11 uur</b>. Je pakket en je tegoed gaan op, en <b>1 uur is extra</b>.',
    },
  ],
  legend: [
    { kind: 'package', label: 'uur uit je pakket' },
    { kind: 'credit', label: 'uur uit je tegoed' },
    { kind: 'extra', label: 'extra uur' },
    { kind: 'unused', label: 'niet gebruikt' },
  ],
} as const

export const tegoed = {
  title: 'Je tegoed blijft staan zolang je pakket loopt',
  paragraphs: [
    'Uren die je overhoudt verlopen niet, zolang je pakket doorloopt. Ook in de zomervakantie blijft je tegoed staan. Stop je met je pakket, dan kun je je tegoed nog twee weken gebruiken, bijvoorbeeld voor losse lessen.',
    'Je tegoed kan niet groter worden dan de uren van je pakket. Heb je een pakket van 8 uur, dan bewaar je maximaal 8 uur. Wat daarboven komt, vervalt.',
  ],
  bar: [
    { title: 'Je pakket loopt', sub: 'Tegoed blijft geldig', kind: 'brand', weight: 5 },
    { title: '2 weken na je laatste periode', sub: 'Nog geldig', kind: 'soft', weight: 2 },
    { title: 'Daarna vervalt het', sub: '', kind: 'void', weight: 1.4 },
  ],
  caption: 'Begin je binnen die twee weken opnieuw met een pakket, dan blijft je tegoed gewoon staan.',
} as const

export const facturen = {
  title: 'Welke facturen krijg je?',
  items: [
    {
      tag: 'Aan het begin',
      title: 'Pakketfactuur',
      body: 'Je krijgt deze aan het begin van elke periode, voor de vier lesweken die je gaat volgen. Had je in je vorige periode extra uren, dan staan die ook op deze factuur.',
    },
    {
      tag: 'Na je periode',
      title: 'Afrekening',
      body: 'Volgt er niet direct een nieuwe periode, bijvoorbeeld omdat je stopt of omdat de zomervakantie begint, en had je extra uren? Dan sturen we kort na het einde van je periode een aparte afrekening.',
    },
  ],
  after:
    'Of je extra uren hebt gevolgd of tegoed overhoudt, weten we pas als je periode klaar is. Daarom rekenen we je periode af zodra de laatste lessen zijn ingevoerd. Dat is meestal binnen een paar dagen.',
} as const

export const losseLessen = {
  title: 'Liever geen pakket?',
  body: 'Dan volg je losse lessen. Die factureren we achteraf, één keer per maand. Dat geldt ook voor lessen in de zomervakantie, als je pakket dan pauzeert. Heb je tegoed, dan gaat dat eerst af. Een pakket loont wanneer je regelmatig bijles volgt, want dan betaal je een lager uurtarief.',
  link: { label: 'Bekijk de tarieven', to: '/tarieven' },
} as const

export const pakkettenFaqs = [
  {
    question: 'Kan ik op elk moment starten?',
    answer:
      'Ja. Je kiest zelf de week waarin je pakket begint, deze week of een latere week. Je periode loopt vanaf de maandag van die week.',
  },
  {
    question: 'Moet ik betalen voordat ik begin?',
    answer:
      'Je ontvangt de factuur aan het begin van je pakket. Je kunt al starten met bijles voordat je hebt betaald. We rekenen er wel op dat je de factuur op tijd betaalt.',
  },
  {
    question: 'Wat gebeurt er in een schoolvakantie?',
    answer:
      'Vakantieweken tellen niet mee voor je pakket. Je pakket loopt dan een week langer, zodat je vier lesweken krijgt. Alleen de zomervakantie werkt anders: dan pauzeert je pakket.',
  },
  {
    question: 'Mag ik meer uren volgen dan in mijn pakket zit?',
    answer:
      'Ja, dat kan altijd. Eerst gebruik je je eventuele tegoed. Daarna betaal je extra uren tegen het uurtarief van je pakket.',
  },
  {
    question: 'Hoe stop ik mijn pakket?',
    answer:
      'Laat het ons uiterlijk een week voor het einde van je lopende periode weten. Je huidige periode maak je altijd af, daarna stopt je pakket. Laat je het later weten, dan begint er nog één periode.',
  },
  {
    question: 'Hoe lang kan ik mijn tegoed nog gebruiken na het stoppen?',
    answer: 'Nog twee weken na het einde van je laatste periode. Daarna vervalt het tegoed.',
  },
  {
    question: 'Wat kost de eerste les?',
    answer: 'Niets. De proefles is gratis, en je zit nergens aan vast.',
  },
] as const

export const pakkettenCta = {
  title: 'Benieuwd welk pakket bij je past?',
  body: 'Plan een gratis proefles. Daarna kijken we samen naar wat jij nodig hebt.',
  button: 'Gratis proefles',
} as const
