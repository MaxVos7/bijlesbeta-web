/**
 * Kennisbank articles.
 *
 * Deliberately a plain TypeScript module rather than a CMS: it keeps the
 * dependency surface at zero and the content typed. If the kennisbank grows
 * past ~40 articles or non-developers need to edit it, swap this for
 * @nuxt/content (markdown files) — the page components only depend on the
 * shapes below.
 *
 * `tags` doubles as both the pill labels on a card/cover and the vocabulary
 * for the kennisbank's filter chips (see `filterTags`) — there is no
 * separate single `category` field.
 *
 * Body copy is stored as arrays of `Run`s rather than markdown or HTML so a
 * paragraph or list item can mix bold, italic, subscript and links without
 * `v-html` — see `LegalItem` in `legal.ts` for the same idea in a simpler
 * shape. A bare string is shorthand for a single plain run.
 */

export type Run =
  | string
  | { text: string; bold?: boolean; em?: boolean; sub?: boolean; link?: string }

export type ArticleTable = {
  type: 'table'
  /** Header row; the first entry is the blank corner cell above the row headers. */
  columns: string[]
  rows: { header: string; cells: Run[][] }[]
}

export type ArticleBlock =
  | { type: 'heading'; level?: 2 | 3; text: string }
  | { type: 'paragraph'; text: Run[] }
  | { type: 'list'; ordered?: boolean; items: Run[][] }
  | ArticleTable

export type Article = {
  slug: string
  title: string
  tags: string[]
  excerpt: string
  author: string
  publishedAt: string
  readingMinutes: number
  wordCount: number
  /**
   * Cover photograph, `/img/kennisbank/<slug>.jpg` by convention. The card and
   * the article header fall back to the dashed placeholder both when this is
   * undefined and when the file 404s, so a slug may be listed here before its
   * artwork lands in `public/img/kennisbank/`.
   */
  coverImage?: string
  /** Empty for cards that only exist on the overview grid so far — the detail page then shows just the excerpt. */
  body: ArticleBlock[]
}

const strong = (text: string): Run => ({ text, bold: true })
const em = (text: string): Run => ({ text, em: true })
const sub = (text: string): Run => ({ text, sub: true })
const link = (text: string, href = '#'): Run => ({ text, link: href })

export const articles: Article[] = [
  {
    slug: 'kruistabel',
    title: 'Statistiek: Werken met de Kruistabel',
    tags: ['Examenstof', 'Havo 5', 'Statistiek'],
    excerpt:
      'Kruistabel statistiek: bereken phi (φ) en bepaal of verschil groot, middelmatig of gering is. Met praktisch voorbeeld over schoolexcursie keuze.',
    author: 'Stefan',
    publishedAt: '2026-02-07',
    readingMinutes: 7,
    wordCount: 1265,
    coverImage: '/img/kennisbank/kruistabel.jpg',
    body: [
      {
        type: 'paragraph',
        text: [
          'Op het formuleblad van je examen wiskunde A staan zes methodes waarmee je een uitspraak kunt doen over het verschil tussen twee groepen. De kruistabel met phi (φ) is er daar één van, en hij komt regelmatig terug op het eindexamen. In dit artikel leggen we stap voor stap uit wat een kruistabel is, hoe je hem invult, en hoe je met de phi-formule bepaalt of een verschil groot, middelmatig of gering is. Aan het eind werken we een volledige voorbeeldopgave uit, precies zoals je die op je examen tegenkomt.',
        ],
      },
      { type: 'heading', text: 'Wat is een kruistabel?' },
      {
        type: 'paragraph',
        text: [
          'Een kruistabel (ook wel ',
          strong('2×2 tabel'),
          ') is een overzichtelijke manier om een groep mensen of objecten op twee verschillende manieren in tweeën te splitsen. Je maakt daarbij gebruik van twee ',
          strong('nominale variabelen'),
          '. Dat zijn variabelen die je in categorieën indeelt zonder rangorde. Denk aan jongens/meisjes, geslaagd/gezakt, of voor/tegen.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Door deze twee splitsingen te combineren krijg je vier groepen. Elke groep levert één getal op, en samen vormen die vier getallen jouw kruistabel:',
        ],
      },
      {
        type: 'table',
        columns: ['', 'Groep A', 'Groep B'],
        rows: [
          { header: 'Eigenschap 1', cells: [[em('a')], [em('b')]] },
          { header: 'Eigenschap 2', cells: [[em('c')], [em('d')]] },
        ],
      },
      {
        type: 'paragraph',
        text: [
          'De letters ',
          em('a'),
          ', ',
          em('b'),
          ', ',
          em('c'),
          ' en ',
          em('d'),
          ' zijn altijd ',
          strong('absolute aantallen'),
          ', en dus geen ',
          link('percentages', '/kennisbank/rekenen-met-procenten'),
          ' of verhoudingen. Met deze vier getallen kun je vervolgens de phi-coëfficiënt (φ) berekenen.',
        ],
      },
      { type: 'heading', text: 'De formule voor phi (φ)' },
      {
        type: 'paragraph',
        text: ['De phi-coëfficiënt bereken je met de volgende formule, die ook op je formuleblad staat:'],
      },
      { type: 'paragraph', text: ['$$\\phi = \\frac{ad-bc}{\\sqrt{(a+b)(a+c)(b+d)(c+d)}}$$'] },
      {
        type: 'paragraph',
        text: [
          'De uitkomst van φ is een getal dat (in theorie) tussen –1 en 1 ligt. Hoe verder de waarde van nul af ligt, hoe groter het verschil tussen de twee groepen. Het invullen van deze formule is in feite een ',
          link('substitutieopgave', '/kennisbank/substitutie'),
          ': je vervangt de letters door de getallen uit je kruistabel en rekent stap voor stap uit.',
        ],
      },
      { type: 'heading', text: 'Vuistregels: groot, middelmatig of gering verschil' },
      {
        type: 'paragraph',
        text: ['Op het formuleblad staan vuistregels waarmee je de uitkomst van φ interpreteert:'],
      },
      {
        type: 'list',
        items: [
          ['Als φ < –0,4 of φ > 0,4, dan zeggen we: ', strong('“het verschil is groot”')],
          [
            'Als –0,4 ≤ φ < –0,2 of 0,2 < φ ≤ 0,4, dan zeggen we: ',
            strong('“het verschil is middelmatig”'),
          ],
          ['Als –0,2 ≤ φ ≤ 0,2, dan zeggen we: ', strong('“het verschil is gering”')],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Let op:'),
          ' de grenzen –0,4 en 0,4 vallen bij ',
          em('middelmatig'),
          ', niet bij ',
          em('groot'),
          '. En –0,2 en 0,2 vallen bij ',
          em('gering'),
          '. Dit is een veelgemaakte fout op het examen, dus bestudeer de ≤ en < tekens op je formuleblad goed!',
        ],
      },
      { type: 'heading', text: 'Wanneer gebruik je de kruistabel op het examen?' },
      {
        type: 'paragraph',
        text: [
          'Op het formuleblad van wiskunde A staan zes methodes om een verschil tussen twee groepen te meten. Het is belangrijk dat je weet wanneer je welke methode kiest. De kruistabel met phi is de juiste keuze wanneer aan deze twee voorwaarden wordt voldaan:',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Ten eerste: je hebt twee ',
          strong('nominale variabelen'),
          '. Dat zijn variabelen die je kunt indelen in categorieën zonder volgorde, zoals geslacht (jongen/meisje), voorkeur (A/B), of uitkomst (wel/niet).',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Ten tweede: je kunt beide variabelen in precies ',
          strong('twee groepen'),
          ' splitsen, zodat je een 2×2 tabel krijgt.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Heb je in plaats daarvan gegevens met gemiddelden en standaardafwijkingen? Dan gebruik je de ',
          link('effectgrootte', '/kennisbank/effectgrootte'),
          '. Heb je twee groepen met ordinale gegevens en meer dan twee categorieën? Dan kijk je naar het maximaal verschil in cumulatief percentage (max V',
          sub('cp'),
          ') of vergelijk je boxplots.',
        ],
      },
      { type: 'heading', text: 'Voorbeeld: kruistabel invullen en phi berekenen' },
      {
        type: 'paragraph',
        text: [
          'Hieronder werken we een volledige voorbeeldopgave uit. We doen dit stap voor stap, precies zoals je dat op je examen ook zou doen.',
        ],
      },
      { type: 'heading', level: 3, text: 'De opgave' },
      {
        type: 'paragraph',
        text: [
          'Alle havoleerlingen van een middelbare school gaan samen op excursie. Er werd gestemd tussen twee opties: het Mediapark in Hilversum of het Rijksmuseum in Amsterdam. Op de havo van deze school zitten in totaal 410 jongens en 445 meisjes. Van de jongens stemden er 236 voor het Mediapark, en van de meisjes stemden er 160 voor het Mediapark.',
        ],
      },
      {
        type: 'paragraph',
        text: [em('Vraag: bereken of er tussen de jongens en de meisjes een groot, middelmatig of gering verschil is.')],
      },
      { type: 'heading', level: 3, text: 'Stap 1: Groepen splitsen' },
      {
        type: 'paragraph',
        text: [
          'De strategie bij een kruistabel-opdracht is altijd hetzelfde: je splitst je totale groep op twee verschillende manieren in tweeën. In dit geval zijn de twee splitsingen:',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'De eerste splitsing is ',
          strong('geslacht'),
          ': jongens en meisjes. De tweede splitsing is ',
          strong('stemkeuze'),
          ': Mediapark en Rijksmuseum.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'De splitsing jongen/meisje is al gegeven. We moeten nu de stemkeuze per groep uitrekenen. Omdat 236 van de 410 jongens voor het Mediapark kozen, wilden 410 – 236 = ',
          strong('174 jongens'),
          ' naar het Rijksmuseum. Voor de meisjes geldt: 445 – 160 = ',
          strong('285 meisjes'),
          ' wilden naar het Rijksmuseum.',
        ],
      },
      { type: 'heading', level: 3, text: 'Stap 2: Kruistabel invullen' },
      {
        type: 'paragraph',
        text: [
          'Nu vullen we de vier getallen in de kruistabel in. Een handig geheugensteuntje: denk aan ',
          strong('“A, B, Ja, Nee”'),
          '. Je ziet dan direct dat de twee splitsingen los van elkaar staan. In plaats van A en B gebruiken we jongens en meisjes, en voor Ja/Nee gebruiken we Rijksmuseum/Mediapark. Het maakt niet uit welke splitsing je waar neerzet, want je eindantwoord voor φ is hetzelfde.',
        ],
      },
      {
        type: 'table',
        columns: ['', 'Jongens (A)', 'Meisjes (B)'],
        rows: [
          { header: 'Rijksmuseum (Ja)', cells: [['(', em('a'), ' =) 174'], ['(', em('b'), ' =) 285']] },
          { header: 'Mediapark (Nee)', cells: [['(', em('c'), ' =) 236'], ['(', em('d'), ' =) 160']] },
        ],
      },
      { type: 'heading', level: 3, text: 'Stap 3: Phi berekenen en conclusie trekken' },
      { type: 'paragraph', text: ['We vullen de getallen in de formule in:'] },
      {
        type: 'paragraph',
        text: ['$$\\phi = \\frac{174 \\times 160 – 285 \\times 236}{\\sqrt{(174+285)(174+236)(285+160)(236+160)}}$$'],
      },
      { type: 'paragraph', text: ['$$= \\frac{27.840 – 67.260}{\\sqrt{459 \\times 410 \\times 445 \\times 396}}$$'] },
      { type: 'paragraph', text: ['$$\\phi \\approx –0{,}216$$'] },
      {
        type: 'paragraph',
        text: [
          'We vergelijken deze uitkomst met de vuistregels. Omdat –0,4 ≤ –0,216 < –0,2 geldt: ',
          strong('het verschil is middelmatig'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Het verschil in stemgedrag tussen jongens en meisjes is middelmatig, met φ ≈ –0,22.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Controleer op je GR:'),
          ' Je kunt de berekening van φ eenvoudig controleren op je grafische rekenmachine. Vul de hele formule in één keer in en let daarbij extra goed op de haakjes. Rond pas af in je eindantwoord, niet tussendoor.',
        ],
      },
      { type: 'heading', text: 'Veelgemaakte fouten bij de kruistabel' },
      {
        type: 'paragraph',
        text: [
          'Bij het nakijken van toetsen en examens zien we steeds dezelfde fouten terugkomen. Hier zijn de vijf meest voorkomende, en hoe je ze voorkomt.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('1. Percentages in plaats van aantallen invullen.'),
          ' De getallen ',
          em('a'),
          ', ',
          em('b'),
          ', c en ',
          em('d'),
          ' in de kruistabel moeten altijd absolute aantallen zijn. Geeft de opgave percentages? ',
          link('Reken deze dan eerst om naar aantallen.'),
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('2. Tussentijds afronden.'),
          ' Rond pas af in je uiteindelijke antwoord. Als je tussenstappen afrondt, kan je eindantwoord net aan de verkeerde kant van een vuistregelgrens uitkomen, waardoor je de verkeerde conclusie trekt.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('3. Haakjes vergeten bij het invullen op de rekenmachine.'),
          ' De noemer van de phi-formule bevat vier factoren die elk tussen haakjes staan. Vergeet je er één, dan komt er een compleet ander getal uit. Tip: typ de formule in je GR precies zo over als hij op het formuleblad staat.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('4. De vuistregels verkeerd aflezen.'),
          ' Let op: φ = –0,4 valt bij ',
          em('middelmatig'),
          ' (niet bij groot), en φ = 0,2 valt bij ',
          em('gering'),
          ' (niet bij middelmatig). Kijk goed naar de ≤ en < tekens.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('5. Geen conclusie formuleren.'),
          ' Het berekenen van φ is niet het eindantwoord. Je moet altijd een conclusie schrijven in woorden, zoals: “Het verschil is middelmatig.” Vergeet dit niet, want hier worden punten voor gegeven.',
        ],
      },
      { type: 'heading', text: 'Samenvatting: stappenplan kruistabel en phi' },
      { type: 'paragraph', text: ['Gebruik dit stappenplan als checklist bij iedere kruistabel-opgave op je examen:'] },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Bepaal de twee nominale splitsingen in de opgave.'],
          ['Bereken de ontbrekende aantallen (totaal minus het gegeven aantal).'],
          ['Vul de vier aantallen in de 2×2 kruistabel in als ', em('a'), ', ', em('b'), ', ', em('c'), ' en ', em('d'), '.'],
          ['Bereken φ met de formule van het formuleblad.'],
          ['Vergelijk φ met de vuistregels en schrijf je conclusie op.'],
        ],
      },
      { type: 'heading', level: 3, text: 'Meer wiskunde uitleg in de kennisbank' },
      {
        type: 'paragraph',
        text: [
          'Wil je ook andere onderwerpen van het formuleblad oefenen? Lees dan onze uitleg over de ',
          link('effectgrootte', '/kennisbank/effectgrootte'),
          ', oefen je ',
          link('substitutievaardigheden', '/kennisbank/substitutie'),
          ', of bekijk onze artikelen over ',
          link('lineaire verbanden', '/kennisbank/lineaire-verbanden'),
          ' en ',
          link('exponentiële verbanden', '/kennisbank/exponentiele-verbanden'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Hulp nodig bij statistiek?'),
          ' Bij ',
          link('Bijles Bèta', '/'),
          ' helpen onze wiskundedocenten je met alle onderwerpen van het formuleblad, van kruistabellen tot betrouwbaarheidsintervallen. ',
          link('Bekijk onze examentraining', '/examentraining'),
          ' voor wiskunde in Groningen.',
        ],
      },
    ],
  },
  {
    slug: 'effectgrootte',
    title: 'Statistiek: Werken met de Effectgrootte',
    tags: ['Examenstof', 'Wiskunde A'],
    excerpt:
      'Statistiek effectgrootte berekenen: wanneer is verschil groot, gemiddeld of gering? Stap-voor-stap uitleg met standaardafwijking en steekproefgemiddelden.',
    author: 'Stefan',
    publishedAt: '2026-02-07',
    readingMinutes: 6,
    wordCount: 1020,
    coverImage: '/img/kennisbank/effectgrootte.jpg',
    body: [],
  },
  {
    slug: 'substitutie',
    title: 'Substitutie: Eerst denken, dan doen',
    tags: ['Examenstof', 'Wiskunde A'],
    excerpt:
      'Substitutie wiskunde uitgelegd: variabelen vrijmaken en vervangen in formules. Van simpele voorbeelden tot vliegtuigberekeningen uit het eindexamen.',
    author: 'Stefan',
    publishedAt: '2026-02-07',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/substitutie.jpg',
    body: [],
  },
  {
    slug: 'lineaire-verbanden',
    title: 'Lineaire verbanden: Waar het misgaat op de toets',
    tags: ['Examenstof', 'Havo 5', 'Wiskunde A'],
    excerpt:
      'Lineaire verbanden Havo uitgelegd: y=ax+b met inzichtsvragen uit eindexamen 2023. Leer hellingsgetal en startgetal berekenen met praktische voorbeelden.',
    author: 'Stefan',
    publishedAt: '2025-12-18',
    readingMinutes: 6,
    wordCount: 1020,
    coverImage: '/img/kennisbank/lineaire-verbanden.jpg',
    body: [],
  },
  {
    slug: 'rekenen-met-procenten',
    title: 'Rekenen met procenten',
    tags: ['Examenstof', 'Havo 5', 'Wiskunde A'],
    excerpt:
      'Procenten berekenen zonder formules: leer de 3 gouden regels voor groeifactoren en percentages. Van 60% afname tot populatiegroei met praktijkvoorbeelden.',
    author: 'Stefan',
    publishedAt: '2025-12-18',
    readingMinutes: 6,
    wordCount: 1020,
    coverImage: '/img/kennisbank/rekenen-met-procenten.jpg',
    body: [],
  },
  {
    slug: 'exponentiele-verbanden',
    title: 'Exponentiële verbanden: wat gebeurt er als de tijd verandert?',
    tags: ['Examenstof', 'Havo 5', 'Wiskunde A'],
    excerpt:
      'Exponentiële groei en afname begrijpen: van bankrente tot mobiele data. Leer werken met groeifactor g en tijdseenheden met praktische voorbeelden.',
    author: 'Stefan',
    publishedAt: '2025-12-18',
    readingMinutes: 6,
    wordCount: 1020,
    coverImage: '/img/kennisbank/exponentiele-verbanden.jpg',
    body: [],
  },
  {
    slug: 'afgeleide-functies',
    title: 'Afgeleide functies — wat betekent dat eigenlijk?',
    tags: ['Wiskunde'],
    excerpt:
      "Wat is een afgeleide functie? Begrijp instantane snelheid met praktische voorbeelden: van auto's tot fietsers. Leer wanneer de afgeleide wel en niet bestaat.",
    author: 'Thomas Smeman',
    publishedAt: '2025-12-04',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/afgeleide-functies.jpg',
    body: [],
  },
  {
    slug: 'technieken-voor-differentieren',
    title: 'Technieken voor differentiëren',
    tags: ['Wiskunde'],
    excerpt:
      'Leer differentiëren met productregel, quotiëntregel en kettingregel. Stap-voor-stap uitleg met voorbeelden van sin(x), cos(x) en samengestelde functies.',
    author: 'Thomas Smeman',
    publishedAt: '2025-12-04',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/technieken-voor-differentieren.jpg',
    body: [],
  },
  {
    slug: 'periodiek-systeem',
    title: 'Het Periodiek Systeem – Verdiepende Vragen en Uitwerkingen',
    tags: ['Natuurkunde', 'Scheikunde'],
    excerpt:
      'Het periodiek systeem uitgelegd: groepen, perioden en elektronenstructuur. Van alkalimetalen tot edelgassen met praktische vragen over bindingen en atoomnummers.',
    author: 'Thomas Smeman',
    publishedAt: '2025-12-04',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/periodiek-systeem.jpg',
    body: [],
  },
  {
    slug: 'zouten',
    title: 'Zouten: molecuulformules en oplosreacties',
    tags: ['Scheikunde'],
    excerpt:
      'Zouten uitgelegd: molecuulformules opstellen, oplosreacties en neerslagreacties. Van natriumfosfaat tot zilverchloride met BINAS tabel 32 en uitwerkingen.',
    author: 'Marieke Spijker',
    publishedAt: '2025-11-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/zouten.jpg',
    body: [],
  },
  {
    slug: 'radioactief-verval',
    title: 'Radioactief verval',
    tags: ['Natuurkunde'],
    excerpt:
      'Radioactief verval berekenen: bepaal de benodigde massa I-125 voor medische behandeling. Stap-voor-stap uitleg met halveringstijd, activiteit en vervalconstante.',
    author: 'Marieke Spijker',
    publishedAt: '2025-11-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/radioactief-verval.jpg',
    body: [],
  },
  {
    slug: 'ph-berekeningen',
    title: 'pH–berekeningen',
    tags: ['Scheikunde'],
    excerpt:
      'pH berekenen van sterke en zwakke zuren plus buffers. Van HCl tot azijnzuur: stap-voor-stap uitleg met formules, zuurconstanten en BINAS tabel 49.',
    author: 'Marieke Spijker',
    publishedAt: '2025-11-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/ph-berekeningen.jpg',
    body: [],
  },
  {
    slug: 'molberekeningen',
    title: 'Molberekeningen',
    tags: ['Scheikunde'],
    excerpt:
      "Leer soda produceren uit keukenzout en kalksteen. Stap-voor-stap berekening van molaire massa's en molverhoudingen met praktische voorbeeldopgave.",
    author: 'Marieke Spijker',
    publishedAt: '2025-11-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/molberekeningen.jpg',
    body: [],
  },
  {
    slug: 'snelheid-en-versnelling',
    title: 'Snelheid en versnelling',
    tags: ['Natuurkunde'],
    excerpt:
      'Leer alles over snelheid en gemiddelde snelheid met praktische voorbeelden. Van fietsen naar school tot autorit met file. Inclusief formules en berekeningen.',
    author: 'Max',
    publishedAt: '2025-11-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/snelheid-en-versnelling.jpg',
    body: [],
  },
  {
    slug: 'reactievergelijkingen',
    title: 'Reactievergelijkingen',
    tags: ['Scheikunde'],
    excerpt:
      'Leer reactievergelijkingen opstellen en in balans brengen. Van simpele verbranding tot complexe chemische reacties, uitgelegd met voorbeelden en uitwerkingen.',
    author: 'Thomas Smeman',
    publishedAt: '2025-11-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/reactievergelijkingen.jpg',
    body: [],
  },
  {
    slug: 'elektromagnetisch-spectrum',
    title: 'Elektromagnetisch Spectrum',
    tags: ['Natuurkunde'],
    excerpt:
      'Ontdek het elektromagnetisch spectrum: van zichtbaar licht tot infrarood en ultraviolet. Leer over golflengte, frequentie en roodverschuiving met formules.',
    author: 'Thomas Smeman',
    publishedAt: '2025-11-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/elektromagnetisch-spectrum.jpg',
    body: [],
  },
  {
    slug: 'wetten-van-newton',
    title: 'De drie wetten van Newton stap voor stap',
    tags: ['Natuurkunde'],
    excerpt:
      'Leer de drie wetten van Newton met praktische voorbeelden. Van een slee op ijs tot formules voor kracht en versnelling. Inclusief stap-voor-stap uitwerkingen.',
    author: 'Thomas Smeman',
    publishedAt: '2025-11-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/wetten-van-newton.jpg',
    body: [],
  },
  {
    slug: 'halveringstijd-tsjernobyl',
    title: 'Oefenvraag halveringstijd: Terug naar Tsjernobyl – Hoe lang blijft jodium–131 gevaarlijk?',
    tags: ['Natuurkunde'],
    excerpt:
      'In deze oefenvraag werken we de halveringstijd uit voor een stof die vrijkwam bij de kernreactor ramp van Tsjernobyl.',
    author: 'Max',
    publishedAt: '2025-09-15',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/halveringstijd-tsjernobyl.jpg',
    body: [],
  },
  {
    slug: 'effectief-leren-voor-je-wiskundetoets',
    title: 'Effectief leren voor je wiskundetoets',
    tags: ['Studietips', 'Wiskunde'],
    excerpt:
      'Wiskunde leer je niet door te lezen, maar door te maken. Zo pak je de week voor een toets aan.',
    author: 'Stefan',
    readingMinutes: 4,
    wordCount: 680,
    coverImage: '/img/kennisbank/effectief-leren-voor-je-wiskundetoets.jpg',
    publishedAt: '2026-01-14',
    body: [
      {
        type: 'paragraph',
        text: [
          'De meeste leerlingen die bij ons binnenkomen met een onvoldoende voor wiskunde leren wél, maar op de verkeerde manier. Ze lezen de theorie door, kijken naar uitgewerkte voorbeelden en denken: dit snap ik. Tot ze voor een opgave zitten die net anders is.',
        ],
      },
      { type: 'heading', text: 'Begin bij de opgaven, niet bij de theorie' },
      {
        type: 'paragraph',
        text: [
          'Pak een opgave uit het hoofdstuk en probeer die te maken zonder eerst de theorie te herhalen. Waar je vastloopt, weet je precies wat je nog niet beheerst. Dat is waardevollere informatie dan een hoofdstuk dat je passief hebt doorgelezen.',
        ],
      },
      { type: 'heading', text: 'Werk met een foutenlijst' },
      {
        type: 'paragraph',
        text: [
          'Houd tijdens het oefenen bij welke fouten je maakt. Niet "ik snapte het niet", maar concreet: tekenfout bij het uitwerken van haakjes, verkeerde formule voor de afgeleide, eenheid vergeten. Na een paar dagen zie je een patroon, en dat patroon is je leerdoel.',
        ],
      },
      { type: 'heading', text: 'Een werkbare weekindeling' },
      {
        type: 'list',
        items: [
          ['Dag 1–2: alle opgaven van het hoofdstuk maken, fouten noteren.'],
          ['Dag 3: alleen de onderwerpen uit je foutenlijst opnieuw oefenen.'],
          ['Dag 4: een oude toets of examenopgave maken op tijd.'],
          ['Dag 5: nakijken, laatste hiaten wegwerken, formules doornemen.'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Loop je er alleen niet uit? Tijdens een proefles kijken we samen waar het misgaat en maken we een plan dat bij jouw toetsweek past.',
        ],
      },
    ],
  },
  {
    slug: 'formules-onthouden-bij-natuurkunde',
    title: 'Formules onthouden bij natuurkunde (zonder stampen)',
    tags: ['Studietips', 'Natuurkunde'],
    excerpt:
      'Je hoeft niet elke formule uit je hoofd te kennen. Je moet weten wanneer je welke pakt.',
    author: 'Thomas Smeman',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/formules-onthouden-bij-natuurkunde.jpg',
    publishedAt: '2026-02-03',
    body: [
      {
        type: 'paragraph',
        text: [
          'Natuurkunde voelt voor veel leerlingen als een lijst formules die je uit je hoofd moet leren. Maar bij het examen mag je BINAS gebruiken. Het probleem is dus zelden dat je de formule niet kent, maar dat je niet weet welke situatie om welke formule vraagt.',
        ],
      },
      { type: 'heading', text: 'Denk in grootheden, niet in formules' },
      {
        type: 'paragraph',
        text: [
          'Schrijf bij elke opgave eerst op wat gegeven is en wat gevraagd wordt, mét eenheden. Zoek daarna de formule die die grootheden verbindt. Deze gewoonte lost het grootste deel van de "ik weet niet waar ik moet beginnen"-problemen op.',
        ],
      },
      { type: 'heading', text: 'Controleer met eenheden' },
      {
        type: 'paragraph',
        text: [
          'Als je antwoord in meters per seconde moet zijn, maar je uitkomst heeft de eenheid joule, dan weet je dat er iets misging — nog voordat je het antwoord nakijkt. Eenheden zijn de goedkoopste controle die er is.',
        ],
      },
      { type: 'heading', text: 'Bouw je eigen overzicht' },
      {
        type: 'list',
        items: [
          ['Per onderwerp: welke grootheden komen erin voor?'],
          ['Welke formules verbinden die grootheden?'],
          ['Welk type opgave hoort erbij, en aan welk signaalwoord herken je dat?'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          "Zo'n overzicht maken is zelf al het halve leerwerk, en je houdt er een spiekbriefje aan over dat écht van jou is.",
        ],
      },
    ],
  },
  {
    slug: 'rekenen-aan-reacties-scheikunde',
    title: 'Rekenen aan reacties: de stappen die altijd werken',
    tags: ['Studietips', 'Scheikunde'],
    excerpt:
      'Mol, massa, molmassa. Eén vast stappenplan waarmee je vrijwel elke rekenopgave uit de scheikunde aankunt.',
    author: 'Marieke Spijker',
    readingMinutes: 6,
    wordCount: 1020,
    coverImage: '/img/kennisbank/rekenen-aan-reacties-scheikunde.jpg',
    publishedAt: '2026-03-11',
    body: [
      {
        type: 'paragraph',
        text: [
          'Rekenen aan reacties is het onderdeel waar de meeste punten liggen — en waar de meeste punten verloren gaan. Het goede nieuws: bijna elke opgave volgt hetzelfde stramien.',
        ],
      },
      { type: 'heading', text: 'Het stappenplan' },
      {
        type: 'list',
        items: [
          ['Stap 1: schrijf de reactievergelijking op en maak hem kloppend.'],
          ['Stap 2: reken wat je hebt om naar mol (via massa en molmassa, of via volume en concentratie).'],
          ['Stap 3: gebruik de molverhouding uit de reactievergelijking om naar de gevraagde stof te gaan.'],
          ['Stap 4: reken van mol terug naar wat gevraagd wordt: gram, liter of concentratie.'],
        ],
      },
      { type: 'heading', text: 'Waar het meestal misgaat' },
      {
        type: 'paragraph',
        text: [
          'Verreweg de meeste fouten ontstaan in stap 1 en stap 3. Een reactievergelijking die niet klopt maakt elke berekening daarna zinloos, en een omgekeerde molverhouding levert een antwoord op dat er plausibel uitziet maar fout is.',
        ],
      },
      { type: 'heading', text: 'Overmaat en ondermaat' },
      {
        type: 'paragraph',
        text: [
          'Krijg je hoeveelheden van twéé beginstoffen, dan is dat vrijwel altijd een overmaat-opgave. Reken voor beide stoffen uit hoeveel product ze zouden opleveren; de kleinste uitkomst is het antwoord, want die stof is op het eerst.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Oefen dit stappenplan tot het automatisch gaat. Dan houd je tijdens de toets tijd en aandacht over voor de opgaven die echt om nadenken vragen.',
        ],
      },
    ],
  },
]

/**
 * Author avatars, keyed by the `author` name on an article — the 45px tile in
 * `AuthorBadge`. Drop the files into `public/img/auteurs/`; until they exist
 * the badge falls back to the author's initial, so a missing file is a
 * cosmetic gap rather than a broken image.
 */
export const authorAvatars: Record<string, string> = {
  Stefan: '/img/auteurs/stefan.jpg',
  'Thomas Smeman': '/img/auteurs/thomas-smeman.jpg',
  'Marieke Spijker': '/img/auteurs/marieke-spijker.jpg',
  Max: '/img/auteurs/max.jpg',
}

/** The kennisbank's filter chips, in the order they render — a fixed vocabulary, not every tag in `articles`. */
export const filterTags = [
  'Examenstof',
  'Havo 5',
  'Natuurkunde',
  'Scheikunde',
  'Statistiek',
  'Wiskunde',
  'Wiskunde A',
] as const

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}

/** Other articles sharing at least one tag with `article`, in list order. */
export function relatedArticles(article: Article, count = 3): Article[] {
  return articles
    .filter((item) => item.slug !== article.slug && item.tags.some((tag) => article.tags.includes(tag)))
    .slice(0, count)
}
