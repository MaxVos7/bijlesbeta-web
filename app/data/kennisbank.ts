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
 * paragraph or list item can mix bold, italic, subscript, maths and links
 * without `v-html` — see `LegalItem` in `legal.ts` for the same idea in a
 * simpler shape. A bare string is shorthand for a single plain run.
 *
 * The eighteen articles bijlesbeta.nl publishes are transcribed from its
 * WordPress export rather than retyped, so the copy is the authors' own down
 * to the punctuation. Their maths is LaTeX, exactly as it was written for the
 * QuickLaTeX plugin the live site renders it with; `TeX.vue` renders it here.
 */

export type Run =
  | string
  | { text: string; bold?: boolean; em?: boolean; sub?: boolean; sup?: boolean; link?: string }
  /**
   * Inline maths, from a `$…$` in the original post.
   *
   * `/kennisbank/kruistabel` and `/kennisbank/substitutie` are missing the
   * `[latexpage]` shortcode on the live site, so their formulas print there as
   * raw dollar-sign LaTeX. We render every article's maths rather than
   * reproduce that.
   */
  | { tex: string }
  /** A line break inside a paragraph — a single newline, once WordPress' `wpautop` had run. */
  | { br: true }

/** A list item, or one that carries a nested list under its own copy. */
export type ArticleListItem = Run[] | { text: Run[]; children: ArticleList }

export type ArticleList = {
  type: 'list'
  ordered?: boolean
  items: ArticleListItem[]
}

export type ArticleTable = {
  type: 'table'
  /** Header row; the first entry is the blank corner cell above the row headers. */
  columns: string[]
  rows: { header: string; cells: Run[][] }[]
}

export type ArticleBlock =
  | { type: 'heading'; level?: 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: Run[] }
  | ArticleList
  | ArticleTable
  /** Displayed maths, from a `$$…$$` in the original post. */
  | { type: 'formula'; tex: string }
  | { type: 'image'; src: string; alt: string }
  /** An `<hr>`. Only `halveringstijd-tsjernobyl` and `ph-berekeningen` use one. */
  | { type: 'divider' }

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
  /** The photograph's own alt text where WordPress had one; the title stands in when it doesn't. */
  coverAlt?: string
  /** Empty for cards that only exist on the overview grid so far — the detail page then shows just the excerpt. */
  body: ArticleBlock[]
}

/**
 * Kennisbank categories.
 *
 * These are the seven archives bijlesbeta.nl publishes at
 * `/kennisbank/category/<slug>/`, all of them indexed, plus `studietips` for
 * the three articles this site added that the live one never had. An article's
 * `tags` are its categories — they already matched the live archives exactly,
 * article for article, so nothing needed remapping.
 *
 * The slug is the URL and the name is both the pill label and the page title.
 */
export const kennisbankCategories = [
  { slug: 'wiskunde', name: 'Wiskunde' },
  { slug: 'wiskunde-a', name: 'Wiskunde A' },
  { slug: 'natuurkunde', name: 'Natuurkunde' },
  { slug: 'scheikunde', name: 'Scheikunde' },
  { slug: 'havo-5', name: 'Havo 5' },
  { slug: 'examenstof', name: 'Examenstof' },
  { slug: 'statistiek', name: 'Statistiek' },
  { slug: 'studietips', name: 'Studietips' },
] as const

export type KennisbankCategory = (typeof kennisbankCategories)[number]

export function findCategory(slug: string) {
  return kennisbankCategories.find((category) => category.slug === slug)
}

/** The slug for a tag as it appears on an article, for linking the pills. */
export function categorySlug(name: string) {
  return kennisbankCategories.find((category) => category.name === name)?.slug
}

const strong = (text: string): Run => ({ text, bold: true })
const em = (text: string): Run => ({ text, em: true })
const sub = (text: string): Run => ({ text, sub: true })
const sup = (text: string): Run => ({ text, sup: true })
const link = (text: string, href = '#'): Run => ({ text, link: href })
/** Inline maths — a `$…$` in the WordPress source. */
const tex = (source: string): Run => ({ tex: source })
/** A line break inside a paragraph. */
const br: Run = { br: true }
/** Displayed maths — a `$$…$$` in the WordPress source. */
const formula = (source: string): ArticleBlock => ({ type: 'formula', tex: source })

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
    coverImage: '/img/kennisbank/kruistabel.webp',
    coverAlt: 'kruistabel',
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
        text: [
          'De phi-coëfficiënt bereken je met de volgende formule, die ook op je formuleblad staat:',
        ],
      },
      formula('\\phi = \\frac{ad-bc}{\\sqrt{(a+b)(a+c)(b+d)(c+d)}}'),
      {
        type: 'paragraph',
        text: [
          'De uitkomst van φ is een getal dat (in theorie) tussen −1 en 1 ligt. Hoe verder de waarde van nul af ligt, hoe groter het verschil tussen de twee groepen. Het invullen van deze formule is in feite een ',
          link('substitutieopgave', '/kennisbank/substitutie'),
          ': je vervangt de letters door de getallen uit je kruistabel en rekent stap voor stap uit.',
        ],
      },
      { type: 'heading', text: 'Vuistregels: groot, middelmatig of gering verschil' },
      {
        type: 'paragraph',
        text: [
          'Op het formuleblad staan vuistregels waarmee je de uitkomst van φ interpreteert:',
        ],
      },
      {
        type: 'list',
        items: [
          ['Als φ < −0,4 of φ > 0,4, dan zeggen we: ', strong('“het verschil is groot”')],
          ['Als −0,4 ≤ φ < −0,2 of 0,2 < φ ≤ 0,4, dan zeggen we: ', strong('“het verschil is middelmatig”')],
          ['Als −0,2 ≤ φ ≤ 0,2, dan zeggen we: ', strong('“het verschil is gering”')],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Let op:'),
          ' de grenzen −0,4 en 0,4 vallen bij ',
          em('middelmatig'),
          ', niet bij ',
          em('groot'),
          '. En −0,2 en 0,2 vallen bij ',
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
        text: [
          em('Vraag: bereken of er tussen de jongens en de meisjes een groot, middelmatig of gering verschil is.'),
        ],
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
          'De splitsing jongen/meisje is al gegeven. We moeten nu de stemkeuze per groep uitrekenen. Omdat 236 van de 410 jongens voor het Mediapark kozen, wilden 410 − 236 = ',
          strong('174 jongens'),
          ' naar het Rijksmuseum. Voor de meisjes geldt: 445 − 160 = ',
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
      formula('\\phi = \\frac{174 \\times 160 - 285 \\times 236}{\\sqrt{(174+285)(174+236)(285+160)(236+160)}}'),
      formula('= \\frac{27.840 - 67.260}{\\sqrt{459 \\times 410 \\times 445 \\times 396}}'),
      formula('\\phi \\approx -0{,}216'),
      {
        type: 'paragraph',
        text: [
          'We vergelijken deze uitkomst met de vuistregels. Omdat −0,4 ≤ −0,216 < −0,2 geldt: ',
          strong('het verschil is middelmatig'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Het verschil in stemgedrag tussen jongens en meisjes is middelmatig, met φ ≈ −0,22.',
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
          ', ',
          em('c'),
          ' en ',
          em('d'),
          ' in de kruistabel moeten altijd absolute aantallen zijn. Geeft de opgave percentages? ',
          link('Reken deze dan eerst om naar aantallen.', '/kennisbank/rekenen-met-procenten'),
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
          ' Let op: φ = −0,4 valt bij ',
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
      {
        type: 'paragraph',
        text: [
          'Gebruik dit stappenplan als checklist bij iedere kruistabel-opgave op je examen:',
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Bepaal de twee nominale splitsingen in de opgave.'],
          ['Bereken de ontbrekende aantallen (totaal minus het gegeven aantal).'],
          [
            'Vul de vier aantallen in de 2×2 kruistabel in als ',
            em('a'),
            ', ',
            em('b'),
            ', ',
            em('c'),
            ' en ',
            em('d'),
            '.',
          ],
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
          link('Bijles Bèta', '/aanmelden'),
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
    readingMinutes: 3,
    wordCount: 595,
    coverImage: '/img/kennisbank/effectgrootte.webp',
    coverAlt: 'statistiek weergeven door een grafiek',
    body: [
      { type: 'heading', text: 'Statistiek: Werken met de Effectgrootte' },
      {
        type: 'paragraph',
        text: [
          'Op het formuleblad van je examen staan zes methodes die je bij statistiek moet kunnen gebruiken. Ik heb gemerkt dat mijn leerlingen vijf van de zes methodes al snel goed kunnen doen. Maar bij het uitwerken van vragen met de Effectgrootte heb je soms denkstappen nodig die moeilijk zijn om zelf te bedenken. Met behulp van de opdracht hieronder ga ik laten zien hoe je met de Effectgrootte kunt werken.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Voordat ik begin: de formule van de Effectgrootte heeft 5 variabelen. Dat is nogal veel, en er wordt ook echt niet van je verwacht dat je moeiteloos allerlei veranderingen kunt maken aan zo’n moeilijke formule. In de tekst van de vraag zullen allerlei hints staan waardoor je de hoeveelheid variabelen kunt verminderen naar 2, of vaak zelfs maar 1. Let hier goed op!',
        ],
      },
      { type: 'paragraph', text: ['Effectgrootte ', tex('E'), ':'] },
      formula('E = \\frac{\\bar{X_1}-\\bar{X_2}}{\\frac{1}{2}(S_1+S_2)},'),
      {
        type: 'paragraph',
        text: [
          'met steekproefgemiddelden ',
          tex('\\bar{X_1}'),
          ' en ',
          tex('\\bar{X_2}'),
          ' waarvoor geldt ',
          tex('\\bar{X_1} > \\bar{X_2}'),
          ', en steekproefstandaardafwijkingen ',
          tex('S_1'),
          ' en ',
          tex('S_2'),
          '.',
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Als ', tex('E>0.8'), ', dan zeggen we “het verschil is groot”'],
          ['Als ', tex('0.4 < E \\leq 0.8'), ', dan zeggen we “het verschil is gemiddeld”'],
          ['Als ', tex('E\\leq 0.4'), ', dan zeggen we “het verschil is gering”'],
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 1' },
      {
        type: 'paragraph',
        text: [
          'In een schoolklas Havo en een schoolklas VWO wordt een onderzoek gedaan naar hoe lang de leerlingen moeten leren voor de toetsweek. Er wordt aan de leerlingen gevraagd hoeveel uur ze in totaal besteden aan leren voor de toetsweek.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Gemiddeld blijken Havoleerlingen 16.4 uur te leren voor de toetsweek, en VWO-leerlingen 22.8 uur. Er zit natuurlijk wel spreiding in, in de vorm van een standaardafwijking. Ga ervanuit dat de standaardafwijking ',
          tex('S'),
          ' voor Havo en VWO hetzelfde is.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Bereken met behulp van de Effectgrootte voor welke waarden van ',
          tex('S'),
          ' het verschil in leertijd tussen Havo en VWO groot is.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'paragraph',
        text: [
          'Ik ga direct beginnen met een vreemde denkstap. We weten van het formuleblad dat, voor een groot verschil, ',
          tex('E'),
          ' groter moet zijn dan 0.8. Het eerste wat ik je aanraad om te doen, is het “groter-dan” teken ',
          tex('(>)'),
          ' te vervangen door een ',
          tex('='),
          ', dus ',
          tex('E=0.8'),
          '. Dat probleem lossen we later wel op.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Er is gegeven dat de standaardafwijkingen gelijk zijn aan elkaar. Dat betekent ',
          tex('S_1 + S_2 = S + S = 2S'),
          ', oftewel, in de noemer van de formule:',
        ],
      },
      formula('\\frac{1}{2}(S+S)= \\frac{1}{2}\\cdot2\\cdot S= S.'),
      {
        type: 'paragraph',
        text: [
          'Als we de rest van de gegeven informatie invullen (',
          tex('E'),
          ', en de twee gemiddeldes), krijgen we:',
        ],
      },
      formula('0.8 = \\frac{22.8 - 16.4}{S} = \\frac{6.4}{S}.'),
      {
        type: 'paragraph',
        text: [
          'Als we teruglezen in de vraag, kun je zien dat we "waarden van ',
          tex('S'),
          '" moeten vinden. Dus om dit te vinden, maken we ',
          tex('S'),
          ' vrij:',
        ],
      },
      formula('0.8 \\cdot S = 6.4,'),
      formula('S = \\frac{6.4}{0.8} = 8.'),
      {
        type: 'paragraph',
        text: [
          'Vooralsnog hebben we alleen nog maar de formule ingevuld, en de laatste variabele ',
          tex('S'),
          ' vrijgemaakt, maar we zijn nog niet klaar. We moeten "waarden van ',
          tex('S'),
          '“ vinden waarvoor een ”groot verschil" geldt. Met andere woorden: we moeten onze keuze om de ',
          tex('>'),
          ' te vervangen door een ',
          tex('='),
          ' weer ongedaan maken.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Om dit te doen ga ik de tweede moeilijke denkstap zetten: we gaan weer terug naar',
        ],
      },
      formula('0.8 = \\frac{6.4}{S},'),
      {
        type: 'paragraph',
        text: [
          'twee formules geleden, en hier gaan we redeneren. Voor een “groot verschil” moeten we hebben, ',
          tex('E>0.8.'),
          ' Wat kunnen we met ',
          tex('S'),
          ' doen om de linkerkant, ',
          tex('E'),
          ', die nu 0.8 is, groter te maken? En het antwoord is: ',
          tex('S'),
          ' moet kleiner worden. Kleiner dan wat? Dat heb je net berekend: kleiner dan 8.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Om een groot verschil te hebben (',
          tex('E>0.8'),
          ') in de leertijd tussen Havo en VWO, moet gelden: ',
          tex('S<8'),
          '.',
        ],
      },
      { type: 'heading', level: 3, text: 'Samenvatting' },
      {
        type: 'paragraph',
        text: [
          'De formule van de Effectgrootte kan intimiderend zijn, maar in de opgave staan altijd manieren om de meeste variabelen al in te vullen, en het rekenwerk makkelijker te maken. Het is belangrijk dat je begrijpt wat de groter- of kleiner-dan-tekens betekenen op het formuleblad, dat je die (tijdelijk) kunt vervangen door een is-teken om de vraag te beantwoorden.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          '(Als je nog een oefenvraag wil: op Examenblad.nl kun je het examen van Havo 2023, tijdvak 1, vraag 14 gebruiken.)',
        ],
      },
    ],
  },
  {
    slug: 'substitutie',
    title: 'Substitutie: Eerst denken, dan doen',
    tags: ['Examenstof', 'Wiskunde A'],
    excerpt:
      'Substitutie wiskunde uitgelegd: variabelen vrijmaken en vervangen in formules. Van simpele voorbeelden tot vliegtuigberekeningen uit het eindexamen.',
    author: 'Stefan',
    publishedAt: '2026-02-07',
    readingMinutes: 3,
    wordCount: 409,
    coverImage: '/img/kennisbank/substitutie.webp',
    coverAlt: 'De substitutie van getallen',
    body: [
      { type: 'heading', text: 'Statistiek: Werken met de Kruistabel' },
      {
        type: 'paragraph',
        text: [
          'Op het formuleblad van je examen staan zes methodes die je bij statistiek moet kunnen gebruiken. De eerste is een kruistabel, waarbij je ',
          tex('\\phi'),
          ' kunt berekenen, en daarmee een uitspraak kunt doen over het verschil tussen twee groepen. In de opdracht hieronder laat ik zien hoe je deze kunt gebruiken.',
        ],
      },
      { type: 'paragraph', text: [strong('Kruistabel:')] },
      formula('\\left[ \\begin{array}{cc} a & b \\\\ c & d \\end{array} \\right]'),
      { type: 'paragraph', text: ['met'] },
      formula('\\phi = \\frac{ad-bc}{\\sqrt{(a+b)(a+c)(b+d)(c+d)}}'),
      {
        type: 'list',
        items: [
          [
            'Als ',
            tex('\\phi<-0{,}4'),
            ' of ',
            tex('\\phi > 0{,}4'),
            ', dan zeggen we “het verschil is groot”',
          ],
          [
            'Als ',
            tex('-0{,}4 \\leq \\phi < -0{,}2'),
            ' of ',
            tex('0{,}2 < \\phi \\leq 0{,}4'),
            ', dan zeggen we “het verschil is middelmatig”',
          ],
          ['Als ', tex('-0{,}2\\leq \\phi\\leq 0{,}2'), ', dan zeggen we “het verschil is gering”'],
        ],
      },
      { type: 'heading', level: 3, text: 'Opdracht' },
      {
        type: 'paragraph',
        text: [
          'Alle Havoleerlingen van een middelbare school gaan samen op excursie. Er werd gestemd tussen twee opties: het Mediapark in Hilversum, of het Rijksmuseum in Amsterdam. Op de Havo van deze school zitten in totaal 410 jongens en 445 meisjes. 236 jongens stemden voor het Mediapark, en 160 meisjes stemden voor het Mediapark.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Bereken of er tussen de jongens en de meisjes een groot, middelmatig of gering verschil telt.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'paragraph',
        text: [
          'De strategie bij een kruistabel-opdracht is om je totale groep op twee verschillende manieren in tweeën te splitsen. Hierdoor krijg je in totaal vier groepen, en dat zijn de vier getallen die in de kruistabel eindigen. Dit zijn altijd twee nominale splitsingen.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'In dit geval is je totale groep alle Havoleerlingen, en de twee splitsingen die je kunt maken zijn de splitsing jongen-meisje, en de splitsing Mediapark-Rijksmuseum. De splitsing jongen-meisje is al voor ons gemaakt. We moeten zowel de jongens als de meisjes nog in tweeën splitsen, op basis van waar ze heen willen. Omdat er 236 jongens naar het Mediapark wilden, wilden er ',
          tex('410-236=174'),
          ' jongens naar het Rijksmuseum. Voor de meisjes geldt dat er ',
          tex('445-160=285'),
          ' naar het Rijksmuseum wilden.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Nu we de totale groep op twee manieren in tweeën hebben gesplitst, kunnen we de kruistabel gaan invullen. Ik heb mijn leerlingen hiervoor altijd het geheugensteuntje gegeven: “A, B, Ja, Nee”, want daaraan kun je duidelijk zien dat de twee splitsingen echt los staan van elkaar.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'In plaats van A en B ga ik de splitsing jongen-meisje gebruiken, en voor Ja-Nee ga ik Mediapark/Rijksmuseum gebruiken. Het maakt echter niet uit welke splitsing je bij A-B zet, en welke bij Ja-Nee. Je eindantwoord bij ',
          tex('\\phi'),
          ' is hetzelfde.',
        ],
      },
      {
        type: 'table',
        columns: ['', 'A/Jongens', 'B/Meisjes'],
        rows: [
          { header: 'Ja/Rijksmuseum', cells: [['(', tex('a='), ') 174'], ['(', tex('b='), ') 285']] },
          { header: 'Nee/Mediapark', cells: [['(', tex('c='), ') 236'], ['(', tex('d='), ') 160']] },
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Als je deze getallen invult in de formule voor ',
          tex('\\phi'),
          ', krijg je ',
          tex('\\phi = -0{,}216...'),
          '. Op het formuleblad kun je aflezen dat dus geldt: het verschil is middelmatig.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Het verschil in stemgedrag tussen jongens en meisjes is middelmatig, met ',
          tex('\\phi \\approx -0{,}22'),
          '.',
        ],
      },
    ],
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
    wordCount: 1162,
    coverImage: '/img/kennisbank/lineaire-verbanden.jpg',
    body: [
      { type: 'heading', text: 'Lineaire verbanden: Waar het misgaat op de toets' },
      { type: 'paragraph', text: [em('(Wiskunde A Havo Bovenbouw)')] },
      {
        type: 'paragraph',
        text: [
          'Voor de toets- en examenstof van Havo 4 en 5 wordt er van je verwacht dat je kunt rekenen met een lineair verband. Het is het simpelste verband dat er bestaat in een assenstelsel (gewoon een rechte lijn), en ook één van de eerste verbanden die je leert. De formule heeft de vorm',
        ],
      },
      formula('y=ax+b.'),
      {
        type: 'paragraph',
        text: [
          'Er wordt echter al snel van je verwacht dat je lineaire verbanden helemaal beheerst. Omdat dit relatief weinig stof is om gewoon uit je hoofd te leren, voelen docenten, en de makers van eindexamens, zich vrij om juist bij het lineaire verband veel inzichtsvragen te stellen. Met de voorbeelden hieronder wil ik je voorbereiden op zulke inzichtsvragen, en ervoor zorgen dat je geen punten misloopt bij opdrachten over lineaire verbanden.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'De opdrachten hieronder zijn gebaseerd op het Eindexamen Havo Wis A van 2023, Tijdvak 2, vragen 3 en 4. Ik heb ze een klein beetje aangepast, zodat je geen tabellen hoeft af te lezen, en je vraag 1 en 2 niet hoeft te maken.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 1' },
      {
        type: 'paragraph',
        text: [
          'Op 1 juli 1995 rookte 29% van de vrouwen in Nederland. Op 1 juli 2004 was dit percentage gedaald naar 26%. Met deze gegevens kan een formule worden opgesteld:',
        ],
      },
      formula('P_V = at+b'),
      {
        type: 'paragraph',
        text: [
          'Hierin is ',
          tex('P_V'),
          ' het percentage van de vrouwen dat rookt en ',
          tex('t'),
          ' het aantal jaren vanaf 1 juli 1990. Stel met de gegeven percentages de formule van ',
          tex('P_V'),
          ' helemaal op. Rond af op 3 decimalen.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'paragraph',
        text: [
          'Als je de formule van een lineair verband moet opstellen, is het jouw taak om het hellingsgetal ',
          tex('a'),
          ' en het startgetal ',
          tex('b'),
          ' te berekenen. Het startgetal ',
          tex('b'),
          ' is de waarde waarmee de formule “begint”; meestal is dit de waarde op ',
          tex('x=0'),
          ' (omdat formules nu eenmaal beginnen op ',
          tex('x=0'),
          '), oftewel het snijpunt met de ',
          tex('y'),
          '-as.',
        ],
      },
      { type: 'paragraph', text: ['Voor het hellingsgetal ', tex('a'), ' geldt de formule:'] },
      formula('a = \\frac{\\Delta y}{\\Delta x}.'),
      {
        type: 'paragraph',
        text: [
          'In deze opdracht neemt ',
          tex('P_V'),
          ' de rol van ',
          tex('y'),
          ', en neemt ',
          tex('t'),
          ' de rol van ',
          tex('x'),
          ', dus:',
        ],
      },
      formula('a = \\frac{\\Delta P_V}{\\Delta t} = \\frac{26-29}{2004-1995} = \\frac{-3}{9} = -0.333.'),
      {
        type: 'paragraph',
        text: [
          'Het berekenen van ',
          tex('b'),
          ' is iets ingewikkelder: waar “start” deze formule eigenlijk? Normaal is dat ',
          tex('x=0'),
          ' (of dus in dit geval ',
          tex('t=0'),
          '), maar het is niet de bedoeling dat we helemaal terugrekenen naar het jaar nul.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Er wordt gelukkig in de vraag aangegeven waar de formule echt “start”, namelijk 1 juli 1990. Het is belangrijk dat je dit soort hints oppikt tijdens het lezen van de vraag: normaal gebruik je ',
          tex('x=0'),
          ' als “startpunt”, maar nu gebruiken we dus het jaar 1990 als startpunt. En we weten: het startgetal ',
          tex('b'),
          ' is de waarde van y (of in dit geval, ',
          tex('P_V'),
          ') tijdens het startpunt. Dus om deze waarde te vinden, moeten we terugrekenen naar 1990.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Dat brengt ons bij de meest voorkomende manier waarop je ',
          tex('b'),
          ' berekent in een lineair verband: als je ',
          tex('a'),
          ' al hebt berekend, kun je een bekend punt (',
          tex('x'),
          ' en ',
          tex('y'),
          ') invullen in de formule om ',
          tex('b'),
          ' te vinden.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'We hebben twee datapunten gekregen: namelijk ',
          tex('P_V=29'),
          ' in het jaar 1995, en ',
          tex('P_V = 26'),
          ' in het jaar 2004. Als het jaar 1990 ons startpunt is, dan betekent dat: in 1995 geldt, ',
          tex('t=5'),
          ', en in 2004 geldt ',
          tex('t=14'),
          '. Nu gaan we één van deze twee punten invullen:',
        ],
      },
      formula('29 = -0.333\\cdot 5 + b,'),
      formula('29 + 0.333\\cdot 5 = b,'),
      formula('b = 30.667.'),
      {
        type: 'paragraph',
        text: [
          'Een belangrijk detail dat ik hier wil toevoegen, is dat het invullen van ',
          tex('P_V = 26'),
          ' met ',
          tex('t=14'),
          ' op exact hetzelfde antwoord uitkomt.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' We hebben berekend dat ',
          tex('a=-0.333'),
          ', ',
          tex('b=30.667'),
          ', allebei afgerond op 3 decimalen. Er geldt dus voor de formule van ',
          tex('P_V'),
          ':',
        ],
      },
      formula('P_V = -0.333t + 30.667.'),
      { type: 'heading', level: 3, text: 'Vraag 2' },
      {
        type: 'paragraph',
        text: [
          'Voor het percentage mannen dat rookt in Nederland (',
          tex('P_M'),
          ') geldt',
        ],
      },
      formula('P_M = -0.61 t + 25.93,'),
      {
        type: 'paragraph',
        text: [
          'waarin ',
          tex('t'),
          ' het aantal jaren is vanaf 1 juli 2018. Onderzoek in welk jaar het percentage mannen dat rookt en het percentage vrouwen dat rookt gelijk zullen zijn.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'paragraph',
        text: [
          'Om het snijpunt van twee lijnen te vinden, gebruik je je Grafische Rekenmachine. Ik kan helaas geen complete uitleg van dat proces geven, omdat er meerdere soorten GR bestaan, maar kort samengevat: je gaat naar de plek waar je formules met ',
          tex('x'),
          ' kunt invullen, je voert hier de twee formules in, en gebruikt een functie als ',
          em('intersect'),
          ' of ',
          em('snijpunt'),
          ', om de ',
          tex('x'),
          '-waarde te vinden waar de twee lijnen elkaar snijden.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'We hebben twee formules: namelijk ',
          tex('P_V = -0.333t + 30.667'),
          ' en ',
          tex('P_M = -0.61 t + 25.93'),
          '. Deze formules zijn echter verschillend op een erg belangrijke manier: ze beginnen niet op dezelfde plek. De formule voor vrouwen, ',
          tex('P_V'),
          ', begint in het jaar 1990, en ',
          tex('P_M'),
          ' in 2018. Dat verschil moeten we eerst oplossen. Oftewel: we moeten het startgetal van één van de formules aanpassen, zodat de formules tegelijkertijd kunnen “starten”.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Laat ik de formule van ',
          tex('P_V'),
          ' gebruiken, en doorrekenen naar 2018. De huidige formule begint in 1990, dus dat betekent dat we 28 jaar door moeten rekenen (',
          tex('t=28'),
          '). Dus in 2018 geldt:',
        ],
      },
      formula('P_V = -0.333\\cdot28+30.667 = 21.343.'),
      {
        type: 'paragraph',
        text: [
          'Dit is ons nieuwe startgetal ',
          tex('b'),
          '; het hellingsgetal ',
          tex('a'),
          ' blijft gewoon hetzelfde. Dus een formule voor ',
          tex('P_V'),
          ' die vanaf 2018 geldt, is:',
        ],
      },
      formula('P_V = -0.333t + 21.343.'),
      {
        type: 'paragraph',
        text: [
          'Voordat ik verderga, wil ik eventjes kort kijken naar de start- en hellingsgetallen van deze twee formules, en wat ze betekenen. Het startgetal, dus het percentage rokers, is in 2018 hoger bij de mannen dan dat bij de vrouwen: 25.93% tegen 21.343%. We zien echter dat het hellingsgetal voor de mannen, ',
          tex('-0.61,'),
          ' groter (negatiever) is dan dat van de vrouwen, ',
          tex('-0.333'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Dat betekent dat het percentage mannen dat rookt sneller daalt dan het percentage vrouwen. Ergens in de toekomst zal ',
          tex('P_M'),
          ' dus kleiner worden dan ',
          tex('P_V'),
          ', volgens deze formules. Wat dat dus ook betekent, is dat er een kort moment zal zijn dat de twee percentages gelijk zijn: en dat is precies het moment dat wij moeten vinden.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Omdat beide formules in 2018 beginnen, kunnen we de vraag inmiddels beantwoorden, met onze GR. Door op te stellen dat',
        ],
      },
      formula('P_M = P_V'),
      formula('\\rightarrow -0.61t+25.93 = -0.333t+21.343,'),
      {
        type: 'paragraph',
        text: [
          'en gebruik te maken van de ',
          em('intersect'),
          ' of ',
          em('snijpunt'),
          '-functie, vinden we ',
          tex('t=16.07.'),
          ' Dat betekent dat we ietsje meer dan 16 jaar moeten optellen bij ons beginpunt. Ons beginpunt is 1 juli 2018. Dat is precies halverwege het jaar; dus wanneer ',
          tex('P_V'),
          ' en ',
          tex('P_M'),
          ' gelijk zijn aan elkaar (16.07 jaar later), is het nog 2034.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Ik wil hier weer even een belangrijk detail aan toevoegen: we hadden ook de formule van ',
          tex('P_M'),
          ' mogen gebruiken, en deze laten beginnen in 1990, door terug te rekenen vanaf 2018. Daarna kun je deze gelijkstellen aan ',
          tex('P_V'),
          ' die begint in 1990. Net als in Vraag 1 maakt het niet uit welke je kiest; je komt op hetzelfde antwoord uit.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' De formules, die allebei op 1 juli 2018 beginnen, snijden elkaar op ',
          tex('t=16.07'),
          ', dus ',
          tex('P_V'),
          ' en ',
          tex('P_M'),
          ' zijn hetzelfde in 2034.',
        ],
      },
      { type: 'heading', level: 3, text: 'Samenvatting' },
      {
        type: 'paragraph',
        text: [
          'Omdat een lineair verband relatief simpel is, wordt er een hoog niveau van beheersing van je verwacht. Zo wordt er bijvoorbeeld verwacht dat je:',
        ],
      },
      {
        type: 'list',
        items: [
          ['formules van lineaire verbanden kunt opstellen,'],
          [
            'kunt bedenken waar de formule echt “start”, wanneer er geen simpel “snijpunt met de y-as” bestaat,',
          ],
          [
            'het hellingsgetal niet alleen kunt berekenen, maar ook kunt gebruiken om de functiewaarde te vinden op andere punten op de lijn,',
          ],
          ['je begrijpt wanneer je iets met de hand moet doen, en wanneer je gebruik kunt maken van je GR.'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Voor sommige stappen kun je altijd dezelfde routine volgen, zoals het berekenen van het hellingsgetal, maar soms is er meer overzicht nodig om een vraag te kunnen beantwoorden. Sterker nog, dat overzicht maakt het vaak ook duidelijk wát je precies moet doen. Dat scheelt tijd, en ook punten op je toets.',
        ],
      },
    ],
  },
  {
    slug: 'rekenen-met-procenten',
    title: 'Rekenen met procenten',
    tags: ['Examenstof', 'Havo 5', 'Wiskunde A'],
    excerpt:
      'Procenten berekenen zonder formules: leer de 3 gouden regels voor groeifactoren en percentages. Van 60% afname tot populatiegroei met praktijkvoorbeelden.',
    author: 'Stefan',
    publishedAt: '2025-12-18',
    readingMinutes: 5,
    wordCount: 972,
    coverImage: '/img/kennisbank/rekenen-met-procenten.webp',
    body: [
      { type: 'heading', text: 'Rekenen met procenten' },
      { type: 'paragraph', text: [em('(Wiskunde A Havo Bovenbouw)')] },
      {
        type: 'paragraph',
        text: [
          'Als je met procenten hebt gerekend, zal het je zijn opgevallen dat er een heleboel formules bestaan die je kunnen helpen. Die kun je gerust uit je hoofd leren, maar ze lijken allemaal best veel op elkaar, en dat maakt ze verwarrend. Daarnaast blijft het op een toets, of bij het eindexamen, helaas nooit bij het invullen van een formule; je moet altijd nog verder rekenen met je antwoord, en dat is waar je dan vast kunt lopen.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Met behulp van de opdrachten hieronder wil ik laten zien dat procenten eigenlijk best meevallen, als je ze op de goede manier benadert. In plaats van een heleboel formules uit je hoofd te leren, raad ik aan om de volgende regels te onthouden:',
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Benader opdrachten met procenten als een keersom,'],
          ['Onthoud dat 100% = 1.00 (één komma nul nul)'],
          ['Onthoud “keer 1 doet niks”.'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          'De eerste regel is handig omdat procenten veel meer verbonden zijn met keer/gedeeld-door dan met plus/min. De tweede regel helpt je met het omzetten van procenten naar een factor (= een keersom), en de derde regel voorkomt enórm veel slordigheidsfouten. Het herinnert je eraan dat je met keer/gedeeld-door “niks doet” als je het getal 1 gebruikt, in tegenstelling tot plus/min, waar het getal nul juist “niks doet”.',
        ],
      },
      { type: 'paragraph', text: ['Laten we naar de opdrachten gaan.'] },
      { type: 'heading', level: 3, text: 'Vraag 1' },
      {
        type: 'paragraph',
        text: [
          strong('1.1)'),
          ' Bereken voor onderstaande percentages van toe- of afname de bijbehorende groeifactor.',
        ],
      },
      { type: 'paragraph', text: ['a) 60% afname'] },
      { type: 'paragraph', text: ['b) 250% toename'] },
      {
        type: 'paragraph',
        text: [
          strong('1.2)'),
          ' Bereken voor onderstaande groeifactoren de bijbehorende percentages toe- of afname.',
        ],
      },
      { type: 'paragraph', text: ['c) ', tex('g=1.6')] },
      { type: 'paragraph', text: ['d) ', tex('g=0.04')] },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      { type: 'paragraph', text: [strong('1.1)')] },
      {
        type: 'paragraph',
        text: [
          strong('a)'),
          ' Je begint nooit op 0%, maar altijd op 100%. Dat komt door Regel 3. Als je hier 60% vanaf haalt, krijg je 40%. Regel 2: dat is een (groei-)factor van 0.40.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' ',
          tex('g=0.40'),
          ' of natuurlijk ',
          tex('g=0.4'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('b)'),
          ' Als je op 100% begint (Regel 3), en er 250% toename is, heb je in totaal 350%, oftewel: ',
          tex('\\times3.50'),
          ' (Regel 2).',
        ],
      },
      { type: 'paragraph', text: [strong('Conclusie:'), ' ', tex('g=3.5')] },
      { type: 'paragraph', text: [strong('1.2)')] },
      {
        type: 'paragraph',
        text: [
          strong('c)'),
          ' Met Regel 2 krijg je: ',
          tex('g=1.6 \\rightarrow'),
          ' 160%. Regel 3 vertelt ons: we beginnen op 100%; dus kun je zien dat dit 60% toename is.',
        ],
      },
      { type: 'paragraph', text: [strong('Conclusie:'), ' 60% toename.'] },
      {
        type: 'paragraph',
        text: [
          strong('d)'),
          ' We beginnen weer bij Regel 2: ',
          tex('0.04\\rightarrow 4\\%'),
          '. En onthoud dat we altijd beginnen op 100%, vanwege Regel 3. Hoeveel procent is er dan dus verdwenen? Dat is ',
          tex('100-4=96\\%'),
          '.',
        ],
      },
      { type: 'paragraph', text: [strong('Conclusie:'), ' 96% afname.'] },
      { type: 'heading', level: 3, text: 'Vraag 2' },
      {
        type: 'paragraph',
        text: [
          'In een natuurgebied leeft een populatie konijnen. In de warme seizoenen planten de konijnen zich voort; in de koude seizoenen is er weinig te eten, en krimpt de populatie.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'We kijken naar de data 21 December 2024, 21 Maart 2025, 21 Juni 2025, 21 September 2025 en 21 December 2025. Tussen deze data liggen de winter, lente, zomer en herfst.',
        ],
      },
      { type: 'paragraph', text: ['Hieronder lees je hoe ieder seizoen met de konijnenpopulatie veranderde:'] },
      {
        type: 'list',
        items: [
          ['Slechts 28% van de konijnen heeft de winter overleefd.'],
          ['In de lente groeide de populatie met 150%.'],
          ['In de zomer groeide de populatie met 47%.'],
          ['20% van de konijnen heeft de herfst niet overleefd.'],
        ],
      },
      { type: 'paragraph', text: ['Op 21 Maart 2025 leefden er 1400 konijnen in het natuurgebied.'] },
      {
        type: 'paragraph',
        text: [
          'Bereken met hoeveel procent de populatie konijnen is toe- of afgenomen tussen 21 December 2024 en 21 December 2025. Geef je antwoord in 1 decimaal.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'paragraph',
        text: [
          'We krijgen vijf nuttige data waarop we onze populatie konijnen kunnen invullen, namelijk het begin van elk seizoen. Verder wordt ons verteld dat, aan het begin van de lente, er 1400 konijnen zijn. Met 21 Maart als startpunt, verandert de populatie zoals beschreven.',
        ],
      },
      {
        type: 'table',
        columns: ['Datum', '21 Dec \'24', '21 Maa \'25', '21 Jun \'25', '21 Sep \'25', '21 Dec \'25'],
        rows: [
          { header: 'Konijnen', cells: [[], ['1400'], [], [], []] },
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Voor elke datum ga ik het probleem benaderen als een keersom. Zo leren we het namelijk van Regel 1. Dat betekent:',
        ],
      },
      formula('B \\cdot F = E,'),
      {
        type: 'paragraph',
        text: [
          'oftewel, Beginpopulatie keer Factor = Eindpopulatie. De factor beschrijft wat er met de populatie gebeurt.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Laten we beginnen met de lente: de beginpopulatie, ',
          tex('B'),
          ', is 1400, en die groeit met 150%. Onthoud dat \'keer 1\' niks doet; dus om met 150% toe te nemen, moeten we ons begingetal vermenigvuldigen met 2.5 (zie Regel 2: dat is namelijk 250%). Oftewel: ',
          tex('F=2.5.'),
        ],
      },
      formula('1400 \\cdot 2.5 = E = 3500.'),
      {
        type: 'paragraph',
        text: [
          'Dit is hoeveel konijnen er zijn op 21 Juni. Laten we doorrekenen naar September: de beginpopulatie (',
          tex('B'),
          ') van 3500 groeit met 47%, dus dat betekent: ',
          tex('F =1.47'),
          '.',
        ],
      },
      formula('3500 \\cdot 1.47 = E = 5145.'),
      {
        type: 'paragraph',
        text: [
          'In de herfst zien we een afname van 20%. Je begint altijd met 100%. Vanwege de afname verandert dat in 80% (zie Regel 3), en dat wordt een factor ',
          tex('F = 0.8'),
          ' (zie Regel 2):',
        ],
      },
      formula('5145\\cdot 0.8 = E = 4116.'),
      { type: 'paragraph', text: ['Laten we deze getallen gaan invullen.'] },
      {
        type: 'table',
        columns: ['Datum', '21 Dec \'24', '21 Maa \'25', '21 Jun \'25', '21 Sep \'25', '21 Dec \'25'],
        rows: [
          { header: 'Konijnen', cells: [[], ['1400'], ['3500'], ['5145'], ['4116']] },
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Tot slot willen we weten hoeveel konijnen er in het gebied leefden op 21 December 2024. We weten in dit geval niet wat de beginpopulatie ',
          tex('B'),
          ' is. Wat we daarentegen wel weten, is de factor (',
          tex('F=0.28'),
          '), en de eindpopulatie (',
          tex('E=1400'),
          ').',
        ],
      },
      { type: 'paragraph', text: ['Als we dit invullen, krijg je:'] },
      formula('B \\cdot 0.28 = 1400.'),
      { type: 'paragraph', text: ['Als je vervolgens ', tex('B'), ' vrijmaakt, krijg je:'] },
      formula('B = \\frac{1400}{0.28} = 5000.'),
      {
        type: 'table',
        columns: ['Datum', '21 Dec \'24', '21 Maa \'25', '21 Jun \'25', '21 Sep \'25', '21 Dec \'25'],
        rows: [
          { header: 'Konijnen', cells: [['5000'], ['1400'], ['3500'], ['5145'], ['4116']] },
        ],
      },
      { type: 'paragraph', text: ['Nu hebben we genoeg informatie om de opdracht af te maken.'] },
      {
        type: 'paragraph',
        text: [
          'Ten eerste is het duidelijk dat de populatie is afgenomen. We willen weten hoeveel procent afname er is. Dat kunnen we heel simpel berekenen: we kunnen met behulp van Regel 2, en de Factor, zien wat de afname is.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'We stellen weer een keersom op, vanwege Regel 1. We weten de beginpopulatie; dat is 5000, en we weten de eindpopulatie, dat is 4116. De factor weten we nog niet.',
        ],
      },
      formula('5000 \\cdot F = 4116.'),
      { type: 'paragraph', text: ['Als we F vrijmaken, krijgen we:'] },
      formula('F = \\frac{4116}{5000} = 0.8232.'),
      {
        type: 'paragraph',
        text: [
          'Dit is kleiner dan het getal 1, dus dat geeft inderdaad aan dat er afname is. 1 is overigens ook hetzelfde als 100% (zie Regel 2).',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Nogmaals met Regel 2, kunnen we onze factor omzetten naar procenten: ',
          tex('0.8232 = 82.32\\%'),
          '. Dus tot slot zien we: we houden geen 100% over; maar 82.32%. Dat betekent dus een afname van ',
          tex('100-82.32=17.68\\%'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Afgerond op 1 decimaal, is de populatie konijnen met 17.7% afgenomen.',
        ],
      },
    ],
  },
  {
    slug: 'exponentiele-verbanden',
    title: 'Exponentiële verbanden: wat gebeurt er als de tijd verandert?',
    tags: ['Examenstof', 'Havo 5', 'Wiskunde A'],
    excerpt:
      'Exponentiële groei en afname begrijpen: van bankrente tot mobiele data. Leer werken met groeifactor g en tijdseenheden met praktische voorbeelden.',
    author: 'Stefan',
    publishedAt: '2025-12-18',
    readingMinutes: 4,
    wordCount: 761,
    coverImage: '/img/kennisbank/exponentiele-verbanden.webp',
    body: [
      { type: 'heading', text: 'Exponentiële verbanden: wat gebeurt er als de tijd verandert?' },
      { type: 'paragraph', text: [em('(Wiskunde A Havo Bovenbouw)')] },
      {
        type: 'paragraph',
        text: [
          'Een exponentieel verband is een verband waarbij een hoeveelheid toeneemt of afneemt. Deze toe- of afname is dan telkens een gedeelte van deze hoeveelheid. De formule die dit verband beschrijft, heeft de vorm',
        ],
      },
      formula('N = b \\cdot g^t.'),
      {
        type: 'paragraph',
        text: [
          'De groeifactor ',
          tex('g'),
          ' in deze formule heeft een belangrijke eigenschap, die vaak niet heel duidelijk wordt aangegeven: er hoort een bepaalde tijdseenheid bij. Deze tijdseenheid is nauw verbonden met de ',
          tex('t'),
          ' in de formule; de ',
          tex('t'),
          ' staat namelijk ook voor \'tijd\'.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'In de voorbeelden hieronder leer je hoe je met de tijd (zowel ',
          tex('t'),
          ' als de tijdseenheid van ',
          tex('g'),
          ') moet omgaan in een exponentieel verband.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 1' },
      {
        type: 'paragraph',
        text: [
          'Een bank biedt 3% rente per half jaar. Als je een bedrag 3 jaar op een rekening laat staan bij deze bank, hoeveel procent winst maak je dan? Rond af op hele procenten.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'paragraph',
        text: [
          'Een toename van 3% staat gelijk aan een groeifactor ',
          tex('g=1.03'),
          '. Nu moeten we onszelf de vraag stellen: welke tijdseenheid hoort hierbij? Het staat gelukkig erg duidelijk in de vraag: een half jaar.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Onze taak is om te berekenen hoeveel toename er in 3 jaar plaatsvindt. Dat betekent dat de tijd 6 keer zo lang wordt. Dit doen we door gebruik te maken van het gedeelte ',
          tex('g^t'),
          ' uit de formule. We kunnen gebruik maken van ',
          tex('t'),
          ' om de tijd netjes af te stellen, namelijk:',
        ],
      },
      formula('t=6'),
      formula('\\rightarrow g^t = g^6 = 1.03^6 = 1.194...'),
      {
        type: 'paragraph',
        text: [
          'We hebben een nieuwe groeifactor gemaakt (',
          tex('g=1.194'),
          '), en deze groeifactor heeft een nieuwe tijdseenheid, namelijk 3 jaar. Dat hebben we gedaan door op de plek van ',
          tex('t'),
          ' in te vullen hoe vaak we de oude tijdseenheid nodig hadden (6 keer). Een groeifactor van 1.194 betekent 19.4% groei.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' We moeten afronden op hele procenten, dus als eindantwoord geven we: 19% groei.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 2' },
      {
        type: 'paragraph',
        text: [
          'In 2005 had de gemiddelde gebruiker van een mobiele telefoon 250 MB mobiel internet per maand. In 2025 was dit gemiddeld 14 GB per maand. Ga er vanuit dat de hoeveelheid mobiel internet voor gebruikers exponentieel groeide in deze tijd, en stel een formule op van de hoeveelheid GB mobiele data die gebruikers hadden in de vorm',
        ],
      },
      formula('N=b\\cdot g^t,'),
      {
        type: 'paragraph',
        text: [
          'met ',
          tex('t'),
          ' in jaren, en ',
          tex('t=0'),
          ' in 2005. Rond af op 2 decimalen.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'paragraph',
        text: [
          'Bij het opstellen van een exponentiële formule is het jouw taak om ',
          tex('b'),
          ' en ',
          tex('g'),
          ' te vinden. In dit geval weet je ',
          tex('b'),
          ' al: in de opdracht lezen we dat ',
          tex('t=0'),
          ' in 2005, dus ons begingetal is de hoeveelheid data in 2005. Dat is 250 MB, oftewel 0.25 GB.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Wat weten we al over ',
          tex('g'),
          '? We weten dat de mobiele data is gestegen van 0.25 naar 14 GB. Dat betekent dat de mobiele data 56 keer zo groot is geworden, en dat duurde 20 jaar. Met andere woorden: ',
          tex('g=56'),
          ', en de tijdseenheid die bij deze ',
          tex('g'),
          ' hoort, is 20 jaar.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'De opdracht vertelt ons dat we een formule moeten opstellen met ',
          tex('t'),
          ' in jaren. Zoals gezegd zijn ',
          tex('t'),
          ' en de tijdseenheid van ',
          tex('g'),
          ' nauw verbonden met elkaar: we moeten de tijdseenheid van ',
          tex('g'),
          ' veranderen, van 20 naar 1 jaar. Dit betekent dat de tijd 20 keer zo klein wordt:',
        ],
      },
      formula('t=\\frac{1}{20}'),
      formula('\\rightarrow g^t = g^{1/20} = 56^{1/20} = 1.222...'),
      {
        type: 'paragraph',
        text: [
          'De (oude) ',
          tex('g'),
          ' heeft hier een tijdseenheid van 20 jaar. De ',
          tex('t'),
          ' geeft, net als in Vraag 1, aan hoe vaak we deze tijdseenheid willen gebruiken. We willen weten wat er in 1 jaar gebeurt, en dat is uiteraard 1/20 van 20 jaar. De uitkomst hiervan is onze nieuwe ',
          tex('g'),
          ', en deze heeft dan de correcte tijdseenheid.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Uit de vraag lezen we ',
          tex('b=0.25'),
          '. Er wordt gevraagd voor een formule met ',
          tex('t'),
          ' in jaren, en we hebben berekend dat, in dat geval, ',
          tex('g=1.22'),
          '. Dus',
        ],
      },
      formula('N = 0.25\\cdot1.22^t.'),
      { type: 'heading', level: 3, text: 'Vraag 3' },
      {
        type: 'paragraph',
        text: [
          'Een hoeveelheid wordt elke 7 minuten 7% kleiner. Bereken hoeveel procent van de hoeveelheid er is verdwenen na een uur. Rond af op hele procenten.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'paragraph',
        text: [
          'In Vraag 1 hebben we gezien hoe je de tijdseenheid van ',
          tex('g'),
          ' groter kunt maken, in Vraag 2 hebben we hem juist kleiner gemaakt. In deze vraag is het echter niet zo simpel om in één stap de tijdseenheid netjes te maken. In deze vraag wil ik laten zien hoe je kunt doorrekenen met je eigen antwoord, om zo meerdere stappen te zetten.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Deze hoeveelheid wordt 7% kleiner, dus ',
          tex('g=0.93'),
          ', met een tijdseenheid van 7 minuten. Laten we daar eerst eventjes 1 minuut van maken. Dat betekent dus ',
          tex('t=\\frac{1}{7}'),
          ':',
        ],
      },
      formula('g^{1/7} = 0.93^{1/7} = 0.989...'),
      {
        type: 'paragraph',
        text: [
          'Het is nu erg belangrijk dat we dit getal ',
          em('niet afronden!!'),
          ' We moeten er namelijk nog mee doorrekenen. De tijdseenheid van onze nieuwe ',
          tex('g'),
          ' moeten we van 1 minuut veranderen in 1 uur, dus we moeten hem 60 keer zo lang laten duren. Dat geeft ons ',
          tex('t=60'),
          ':',
        ],
      },
      formula('0.989...^{60} = 0.536...'),
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' We zien dat er na een uur nog, afgerond, 54% van de hoeveelheid over is. Dit betekent dat er 46% is verdwenen.',
        ],
      },
    ],
  },
  {
    slug: 'afgeleide-functies',
    title: 'Afgeleide functies — wat betekent dat eigenlijk?',
    tags: ['Wiskunde'],
    excerpt:
      'Wat is een afgeleide functie? Begrijp instantane snelheid met praktische voorbeelden: van auto\'s tot fietsers. Leer wanneer de afgeleide wel en niet bestaat.',
    author: 'Thomas Smeman',
    publishedAt: '2025-12-04',
    readingMinutes: 2,
    wordCount: 321,
    coverImage: '/img/kennisbank/afgeleide-functies.webp',
    body: [
      { type: 'heading', text: 'Afgeleide functies — wat betekent dat eigenlijk?' },
      {
        type: 'paragraph',
        text: [
          'Stel je voor: je bekijkt een auto die rijdt. Je weet de afstand die hij in de tijd aflegt, bijvoorbeeld via een formule. Maar hoe kom je erachter hoe snel de auto op een ',
          em('precies'),
          ' tijdstip rijdt?',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Het gemiddelde over een paar seconden kun je berekenen, maar dat zegt niets over het exacte moment. Om dat idee te begrijpen gebruiken we de afgeleide functie.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 1' },
      { type: 'paragraph', text: [strong('Een auto legt een afstand af volgens de formule')] },
      formula('s(t)=5t^2,'),
      {
        type: 'paragraph',
        text: [
          strong('waarbij '),
          tex('s'),
          strong(' in meters en '),
          tex('t'),
          strong(' in seconden is. Hoe snel rijdt de auto op precies '),
          tex('t=3'),
          strong(' seconden?'),
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'list',
        ordered: true,
        items: [
          [
            'We berekenen eerst de gemiddelde snelheid op een klein interval. De gemiddelde snelheid tussen ',
            tex('t=3'),
            ' en ',
            tex('t=3+h'),
            ' is gegeven door:',
            br,
            ' ',
            tex('v_{\\text{gem}}(h) = \\frac{s(3+h)-s(3)}{h}.'),
          ],
          [
            'Als we dan de formule invullen krijgen we:',
            br,
            ' ',
            tex('s(3+h)=5(3+h)^2=45+30h+5h^2.'),
            br,
            ' ',
            tex('v_{\\text{gem}}(h)=\\frac{(45+30h+5h^2)-45}{h}=30+5h.'),
          ],
          [
            'Voor steeds kleinere ',
            tex('h'),
            ' nadert de snelheid ',
            tex('30'),
            '. Dus',
            br,
            ' ',
            tex('v(3)=\\lim_{h\\to 0}(30+5h)=30.'),
          ],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Op ',
          tex('t=3'),
          ' seconden rijdt de auto 30 m/s. Dit is precies wat we bedoelen met de ',
          em('afgeleide'),
          ': de snelheid op één moment.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 2' },
      {
        type: 'paragraph',
        text: [
          strong('Een fietser legt afstand af volgens '),
          tex('f(t)=4t'),
          strong('. Hoe verschilt de snelheid van deze fietser van de auto uit vraag 1?'),
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'list',
        ordered: true,
        items: [
          [
            'Gemiddelde snelheid tussen ',
            tex('t'),
            ' en ',
            tex('t+h'),
            ':',
            br,
            ' ',
            tex('\\frac{f(t+h)-f(t)}{h}=\\frac{4(t+h)-4t}{h}=\\frac{4h}{h}=4.'),
          ],
          ['Er valt niets meer te benaderen: de snelheid is altijd precies 4.'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Bij een rechte lijn is de snelheid overal hetzelfde: de afgeleide is constant. Bij een kromme (zoals ',
          tex('s(t)=5t^2'),
          ') verandert de snelheid en is de afgeleide afhankelijk van ',
          tex('t'),
          '.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 3' },
      {
        type: 'paragraph',
        text: [
          strong('Een wandelaar loopt langs een rechte weg en keert plotseling om. De positie wordt beschreven door'),
        ],
      },
      formula('g(t)=|t|.'),
      { type: 'paragraph', text: [strong('Wat is de snelheid precies op '), tex('t=0'), strong('?')] },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Voor ', tex('t>0'), ': gemiddelde verandering ', tex('\\frac{|h|}{h}=\\frac{h}{h}=1'), '.'],
          ['Voor ', tex('t<0'), ': gemiddelde verandering ', tex('\\frac{|h|}{h}=\\frac{-h}{h}=-1'), '.'],
          ['De linker- en rechterkant geven dus verschillende uitkomsten.'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Er bestaat geen duidelijke snelheid op ',
          tex('t=0'),
          '. Bij een knik of plotselinge richtingsverandering bestaat de afgeleide niet.',
        ],
      },
      { type: 'heading', text: 'Samenvatting' },
      {
        type: 'list',
        items: [
          ['De afgeleide is de ', em('instantane snelheid van verandering'), '.'],
          ['Bij een kromme functie (zoals een parabool) verandert de afgeleide met ', tex('t'), '.'],
          ['Bij een rechte lijn is de afgeleide constant.'],
          ['Bij een knik bestaat de afgeleide niet.'],
        ],
      },
    ],
  },
  {
    slug: 'technieken-voor-differentieren',
    title: 'Technieken voor differentiëren',
    tags: ['Wiskunde'],
    excerpt:
      'Leer differentiëren met productregel, quotiëntregel en kettingregel. Stap-voor-stap uitleg met voorbeelden van sin(x), cos(x) en samengestelde functies.',
    author: 'Thomas Smeman',
    publishedAt: '2025-12-04',
    readingMinutes: 3,
    wordCount: 468,
    coverImage: '/img/kennisbank/technieken-voor-differentieren.webp',
    body: [
      { type: 'heading', text: 'Technieken voor differentiëren' },
      {
        type: 'paragraph',
        text: [
          'Nu je weet wat een afgeleide betekent, gaan we kijken naar de ',
          em('regels'),
          ' die je helpen om functies stap voor stap af te leiden. Elke regel vertelt je wat er gebeurt als je een bepaald type bewerking ziet in een functie: een som, een product, een breuk of een samenstelling van functies.',
        ],
      },
      { type: 'heading', level: 3, text: 'Belangrijkste regels' },
      {
        type: 'list',
        items: [
          [
            strong('Somregel:'),
            ' Als je twee functies optelt, dan is de afgeleide gewoon de som van de afzonderlijke afgeleiden:',
            br,
            ' ',
            tex('(f(x)+g(x))\' = f\'(x)+g\'(x).'),
          ],
          [
            strong('Productregel:'),
            ' Bij een vermenigvuldiging geldt',
            br,
            ' ',
            tex('(f(x)\\cdot g(x))\' = f\'(x)\\cdot g(x)+f(x)\\cdot g\'(x).'),
          ],
          [
            strong('Quotiëntregel:'),
            ' Bij een deling geldt',
            br,
            ' ',
            tex('\\left(\\frac{f(x)}{g(x)}\\right)\' = \\frac{f\'(x)\\cdot g(x) - f(x)\\cdot g\'(x)}{(g(x))^2}.'),
          ],
          [
            strong('Kettingregel:'),
            ' Als ',
            tex('F(x)=f(g(x))'),
            ', dus een functie in een functie, dan geldt',
            br,
            ' ',
            tex('F\'(x)=f\'(g(x))\\cdot g\'(x).'),
          ],
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 1 — Productregel' },
      { type: 'paragraph', text: [strong('Bepaal de afgeleide van')] },
      formula('h(x)=x^2\\cdot \\sin(x).'),
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'paragraph',
        text: [
          'Deze functie bestaat uit een product: het ene stuk is ',
          tex('x^2'),
          ', het andere stuk is ',
          tex('\\sin(x)'),
          '.',
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Afgeleiden van de losse stukken:', br, ' ', tex('(x^2)\'=2x, \\quad (\\sin(x))\'=\\cos(x).')],
          [
            'Pas de productregel toe: “Eerst het eerste afgeleiden en het tweede laten staan, plus het eerste laten staan en het tweede afgeleiden.”',
            br,
            ' ',
            tex('h\'(x)=2x\\cdot \\sin(x) + x^2\\cdot \\cos(x).'),
          ],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Bij een product komt er altijd twee termen uit: één keer met de afgeleide van de eerste factor, en één keer met de afgeleide van de tweede.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 2 — Quotiëntregel' },
      { type: 'paragraph', text: [strong('Bepaal de afgeleide van')] },
      formula('k(x)=\\frac{\\cos(x)}{x}.'),
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      { type: 'paragraph', text: ['Dit is een breuk, dus we gebruiken de quotiëntregel.'] },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Hier is de teller ', tex('f(x)=\\cos(x)'), ' en de noemer ', tex('g(x)=x'), '.'],
          ['Afgeleiden van de losse stukken:', br, ' ', tex('f\'(x)=-\\sin(x), \\quad g\'(x)=1.')],
          [
            'Quotiëntregel zegt: “Teller is de afgeleide van de bovenkant keer de onderkant, min de bovenkant keer de afgeleide van de onderkant, gedeeld door de onderkant in het kwadraat.”',
            br,
            ' ',
            tex('k\'(x)=\\frac{(-\\sin(x))\\cdot x - \\cos(x)\\cdot 1}{x^2}.'),
          ],
          ['Dus:', br, ' ', tex('k\'(x)=\\frac{-x\\sin(x)-\\cos(x)}{x^2}.')],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Bij een breuk moet je goed de volgorde onthouden: eerst ',
          em('afgeleide boven × onder'),
          ', daarna ',
          em('min boven × afgeleide onder'),
          ', en dat alles over de noemer in het kwadraat.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 3 — Kettingregel' },
      { type: 'paragraph', text: [strong('Bepaal de afgeleide van')] },
      formula('m(x)=\\sin(3x^2).'),
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'paragraph',
        text: [
          'Hier zit een functie in een functie: buiten zit een ',
          tex('\\sin(\\,\\cdot\\,)'),
          ', binnen zit ',
          tex('3x^2'),
          '.',
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Buitenkant: ', tex('f(u)=\\sin(u)'), ' met afgeleide ', tex('f\'(u)=\\cos(u)'), '.'],
          ['Binnenkant: ', tex('g(x)=3x^2'), ' met afgeleide ', tex('g\'(x)=6x'), '.'],
          [
            'Kettingregel: vermenigvuldig de afgeleide van de buitenkant met de afgeleide van de binnenkant:',
            br,
            ' ',
            tex('m\'(x)=\\cos(3x^2)\\cdot 6x.'),
          ],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Bij een samenstelling van functies doe je altijd eerst de buitenste afgeleide, en vermenigvuldig je die met de afgeleide van wat er binnen staat.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 4 — Alles samen' },
      { type: 'paragraph', text: [strong('Bepaal de afgeleide van')] },
      formula('p(x)=\\frac{x^2\\cdot \\sin(5x)+x}{\\cos(x)}.'),
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      { type: 'paragraph', text: ['Hier komen alle regels bij elkaar:'] },
      {
        type: 'list',
        items: [
          ['In de teller zie je een som (', tex('x^2\\sin(5x)+x'), '),'],
          ['daarin ook een product (', tex('x^2\\cdot \\sin(5x)'), '),'],
          ['en in die sinus ook nog een ketting (', tex('\\sin(5x)'), ').'],
          ['Tot slot staat het geheel in een breuk, dus de quotiëntregel moet worden gebruikt.'],
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Noemer: ', tex('g(x)=\\cos(x)'), ', met afgeleide ', tex('g\'(x)=-\\sin(x)'), '.'],
          {
            text: ['Teller: ', tex('f(x)=x^2\\sin(5x)+x'), '.', br],
            children: {
            type: 'list',
            items: [
              ['Dit is een som, dus leid de twee termen apart af.'],
              [
                'Eerste term: ',
                tex('x^2\\sin(5x)'),
                '. Dit is een product:',
                br,
                ' ',
                tex('(x^2)\'=2x'),
                ', ',
                tex('(\\sin(5x))\'=5\\cos(5x)'),
                '.',
                br,
                ' Dus:',
                br,
                ' ',
                tex('(x^2\\sin(5x))\' = 2x\\sin(5x)+5x^2\\cos(5x).'),
              ],
              ['Tweede term: ', tex('x'), '. Afgeleide is gewoon 1.'],
              ['Samen:', br, ' ', tex('f\'(x)=2x\\sin(5x)+5x^2\\cos(5x)+1.')],
            ],
          },
          },
          ['Quotiëntregel:', br, ' ', tex('p\'(x)=\\frac{f\'(x)\\cdot g(x)-f(x)\\cdot g\'(x)}{(g(x))^2}.')],
          [
            'Invullen:',
            br,
            ' ',
            tex('p\'(x)=\\frac{[2x\\sin(5x)+5x^2\\cos(5x)+1]\\cos(x)-[x^2\\sin(5x)+x]\\cdot(-\\sin(x))}{\\cos^2(x)}.'),
          ],
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Soms moet je meerdere regels achter elkaar toepassen. Het helpt om de functie in stukjes te analyseren: zie je een som, een product, een ketting, of een quotiënt? Vaak zijn ze gecombineerd, en dan pas je de regels in de juiste volgorde toe.',
        ],
      },
    ],
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
    wordCount: 893,
    coverImage: '/img/kennisbank/periodiek-systeem.webp',
    body: [
      { type: 'heading', text: 'Het periodiek systeem' },
      {
        type: 'paragraph',
        text: [
          'Het periodiek systeem is de belangrijkste tabel binnen de scheikunde. Het bevat alle bekende elementen, gerangschikt op volgorde van atoomnummer (het aantal protonen in de kern). Elementen met vergelijkbare eigenschappen staan onder elkaar in zogeheten ',
          strong('groepen'),
          '. Daarnaast geeft elk vakje in het periodiek systeem informatie over het element, zoals het symbool, de naam, het atoomnummer en vaak ook de molaire massa.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'In de volgende vragen onderzoeken we stap voor stap hoe het periodiek systeem is opgebouwd en hoe je verbanden kunt leggen tussen de eigenschappen van verschillende elementen.',
        ],
      },
      { type: 'image', src: '/img/kennisbank/periodiek-systeem-tabel.webp', alt: 'Periodiek systeem' },
      { type: 'heading', level: 3, text: 'Vraag 1: Beschrijf de verschillende bekende groepen in het periodiek systeem.' },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'paragraph',
        text: [
          'Het periodiek systeem is opgedeeld in rijen (perioden) en kolommen (groepen). Elementen binnen dezelfde groep vertonen vergelijkbare chemische eigenschappen, omdat ze hetzelfde aantal elektronen in hun buitenste schil hebben.',
        ],
      },
      {
        type: 'list',
        items: [
          [
            strong('Groep 1 – De alkalimetalen:'),
            br,
            ' ',
            br,
            'Dit zijn zeer reactieve metalen, zoals lithium (Li), natrium (Na) en kalium (K). Ze hebben één elektron in hun buitenste schil, waardoor ze gemakkelijk reageren met andere elementen, vooral met water en halogenen.',
          ],
          [
            strong('Groep 2 – De aardalkalimetalen:'),
            br,
            ' ',
            br,
            'Deze groep bevat metalen zoals magnesium (Mg) en calcium (Ca). Ze zijn iets minder reactief dan de alkalimetalen en hebben twee elektronen in hun buitenste schil.',
          ],
          [
            strong('Groepen 3 t/m 12 – De overgangsmetalen:'),
            br,
            ' ',
            br,
            'Dit zijn metalen zoals ijzer (Fe), koper (Cu) en goud (Au). Ze hebben vaak meerdere mogelijke ladingen en worden veel gebruikt als geleiders en in legeringen.',
          ],
          [
            strong('Groep 17 – De halogenen:'),
            br,
            ' ',
            br,
            'Deze niet-metalen, zoals fluor (F), chloor (Cl) en jodium (I), zijn erg reactief. Ze komen in de natuur meestal niet in pure vorm voor, maar als verbindingen (zoals keukenzout: NaCl).',
          ],
          [
            strong('Groep 18 – De edelgassen:'),
            br,
            ' ',
            br,
            'Dit zijn helium (He), neon (Ne), argon (Ar) en andere gassen die bijna niet reageren met andere elementen. Hun buitenste elektronenmantel is volledig gevuld, waardoor ze chemisch stabiel zijn.',
          ],
          [
            strong('Andere belangrijke groepen:'),
            br,
            ' ',
            br,
            '- De ',
            strong('metalloïden'),
            ' (zoals silicium) hebben zowel eigenschappen van metalen als niet-metalen.',
            br,
            ' ',
            br,
            '- De ',
            strong('niet-metalen'),
            ' bevinden zich rechts in de tabel en vormen meestal gassen of broze vaste stoffen.',
            br,
            ' ',
            br,
            '- De ',
            strong('lanthaniden'),
            ' en ',
            strong('actiniden'),
            ' (onderaan de tabel) bevatten zeldzame aardmetalen en radioactieve elementen.',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Het periodiek systeem is dus meer dan een lijst van elementen – het is een geordende weergave van de bouwstenen van de materie, waarbij de structuur direct samenhangt met de eigenschappen van elk element.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 2: Stel dat ik twee willekeurige elementen kan combineren, waarbij ik de protonen bij elkaar op kan tellen. Één van mijn atomen is stikstof. Wat is het lichtste atoom dat ik kan gebruiken om tot een edelgas te komen?' },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'paragraph',
        text: [
          'Stikstof (N) heeft een atoomnummer van 7, wat betekent dat het 7 protonen in de kern heeft. Edelgassen hebben de volgende atoomnummers:',
        ],
      },
      formula('\\text{He (2)},\\ \\text{Ne (10)},\\ \\text{Ar (18)},\\ \\text{Kr (36)},\\ \\text{Xe (54)},\\ \\text{Rn (86)}.'),
      {
        type: 'paragraph',
        text: [
          'We zoeken nu het lichtste element dat, wanneer we het combineren met stikstof, leidt tot een totaal aantal protonen dat gelijk is aan een edelgas.',
        ],
      },
      { type: 'paragraph', text: ['We rekenen:'] },
      formula('7 + x = 10 \\Rightarrow x = 3'),
      { type: 'paragraph', text: ['Het element met atoomnummer 3 is ', strong('lithium (Li)'), '.'] },
      { type: 'paragraph', text: ['Controle:'] },
      formula('7 \\ (\\text{N}) + 3 \\ (\\text{Li}) = 10 \\ (\\text{Neon})'),
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Het lichtste atoom dat je met stikstof kunt combineren om tot een edelgas (neon) te komen, is ',
          strong('lithium (Li)'),
          '.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 3: We weten dat waterstof (H) altijd één covalente binding vormt met een ander atoom in een neutraal molecuul. Wat zijn de drie lichtste atomen naast waterstof die ook meestal één covalente binding vormen?' },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'paragraph',
        text: [
          'Bij covalente bindingen delen atomen elektronen om een volle buitenste schil te krijgen. Waterstof heeft één elektron en wil er één bij — het vormt dus één gedeelde (covalente) binding.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'De elementen die meestal ook één covalente binding vormen, zijn die met zeven elektronen in hun buitenste schil. Deze atomen hebben nog één elektron nodig om een stabiele octetstructuur te bereiken. Dit zijn de ',
          strong('halogenen'),
          '.',
        ],
      },
      { type: 'paragraph', text: ['De drie lichtste halogenen zijn:'] },
      formula('\\text{Fluor (F)},\\ \\text{Chloor (Cl)},\\ \\text{Broom (Br)}.'),
      {
        type: 'paragraph',
        text: [
          'Elk van deze atomen deelt één elektron met een ander atoom, bijvoorbeeld in de moleculen HF, HCl en HBr.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Let op:'),
          ' stoffen als lithium (Li) en natrium (Na) hebben ook 1 elektron in hun buitenste schil. Dat kan je zien aan het feit dat ze in dezelfde kolom als waterstof staan. Het is voor deze stoffen vaak makkelijker om 1 elektron af te staan dan om de hele schil te vullen. Dit resulteert echter in een ionische binding, dus anders dan de covalente binding die wordt gevraagd.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' De drie lichtste atomen naast waterstof die meestal één covalente binding vormen, zijn ',
          strong('fluor (F)'),
          ', ',
          strong('chloor (Cl)'),
          ' en ',
          strong('broom (Br)'),
          '.',
        ],
      },
      { type: 'heading', text: 'Samenvatting' },
      {
        type: 'paragraph',
        text: [
          'Het periodiek systeem is niet zomaar een tabel, maar een overzicht van de fundamentele bouwstenen van alle materie. Door de ordening op basis van atoomnummer en elektronenstructuur kunnen we in één oogopslag veel afleiden over de eigenschappen en het gedrag van elk element.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'We hebben gezien dat elementen binnen dezelfde groep zich vaak op vergelijkbare manieren gedragen, omdat ze hetzelfde aantal elektronen in hun buitenste schil hebben. Zo reageren de alkalimetalen heftig doordat ze gemakkelijk één elektron afstaan, terwijl de halogenen juist graag één elektron opnemen. De edelgassen zijn de uitzondering: hun buitenste schil is al volledig gevuld, waardoor ze vrijwel niet reageren.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Ook leerden we hoe de atoomnummers verband houden met de stabiliteit van elementen, en hoe het type binding – ionisch of covalent – bepaald wordt door de manier waarop atomen elektronen delen of afstaan.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Kortom, het periodiek systeem vormt het hart van de scheikunde: het verklaart niet alleen ',
          em('wat'),
          ' de elementen zijn, maar ook ',
          em('waarom'),
          ' ze zich gedragen zoals ze doen. Wie deze tabel begrijpt, begrijpt de logische samenhang van de chemische wereld.',
        ],
      },
    ],
  },
  {
    slug: 'zouten',
    title: 'Zouten: molecuulformules en oplosreacties',
    tags: ['Scheikunde'],
    excerpt:
      'Zouten uitgelegd: molecuulformules opstellen, oplosreacties en neerslagreacties. Van natriumfosfaat tot zilverchloride met BINAS tabel 32 en uitwerkingen.',
    author: 'Marieke Spijker',
    publishedAt: '2025-11-03',
    readingMinutes: 2,
    wordCount: 327,
    coverImage: '/img/kennisbank/zouten.webp',
    coverAlt: 'Het zout van een chemische vergelijking',
    body: [
      { type: 'heading', text: 'Ionen en zouten' },
      {
        type: 'paragraph',
        text: [
          'Veel stoffen om ons heen zijn ',
          strong('zouten'),
          ' - verbindingen die zijn opgebouwd uit positief en negatief geladen deeltjes, ook wel ',
          strong('ionen'),
          ' genoemd. Keukenzout, krijt en gips zijn daar allemaal voorbeelden van.',
        ],
      },
      { type: 'paragraph', text: ['In deze oefenopgaven ga je leren hoe je:'] },
      {
        type: 'list',
        items: [
          [
            'de ',
            strong('molecuulformule'),
            ' van een zout kunt bepalen door de ladingen van de ionen te combineren',
          ],
          [strong('oplosreacties'), ' en ', strong('neerslagreacties'), ' van zouten kunt opschrijven'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Hierbij gebruik je ',
          strong('BINAS tabel 32'),
          ', waarin de belangrijkste ionen en hun oplosbaarheid staan vermeld. Een belangrijke regel om te onthouden: een zoutmolecuul is altijd ',
          strong('elektrisch neutraal'),
          ' - de positieve en negatieve ladingen heffen elkaar precies op.',
        ],
      },
      { type: 'heading', level: 3, text: 'Opgave 1' },
      { type: 'heading', level: 4, text: 'Geef de molecuulformules van Natriumfosfaat, Calciumchloride, Magnesiumoxide' },
      {
        type: 'paragraph',
        text: [
          'Gebruik hiervoor BINAS tabel 32. Hierin staan de belangrijke ionen waaruit de zouten bestaan.',
          br,
          'Zouten bestaan altijd uit positieve en negatieve ionen. Samen heffen ze elkaars lading op. Het eindresultaat heeft altijd een totale neutrale lading, omdat een molecuul niet positief of negatief geladen kan zijn.',
          br,
          'Wanneer dat wel zo zou zijn, zou het reageren met andere ionen totdat het neutraal is.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'list',
        items: [
          [
            strong('Natriumfosfaat:'),
            ' bestaat uit Na',
            tex('^+'),
            ' en PO',
            tex('_4^{3-}'),
            '.',
            br,
            'Om een neutraal zout te krijgen heb je drie Na',
            tex('^+'),
            '-ionen nodig per fosfaation.',
            br,
            'Molecuulformule: ',
            tex('\\text{Na}_3\\text{PO}_4'),
          ],
          [
            strong('Calciumchloride:'),
            ' calcium heeft lading ',
            tex('2+'),
            ' en chloride ',
            tex('1-'),
            '.',
            br,
            'Om een neutraal zout te krijgen zijn twee chloride-ionen nodig per calciumion.',
            br,
            'Molecuulformule: ',
            tex('\\text{CaCl}_2'),
          ],
          [
            strong('Magnesiumoxide:'),
            ' magnesium heeft lading ',
            tex('2+'),
            ' en oxide ',
            tex('2-'),
            '.',
            br,
            'Eén ion van elk is voldoende om neutraal te worden.',
            br,
            'Molecuulformule: ',
            tex('\\text{MgO}'),
          ],
        ],
      },
      { type: 'heading', level: 3, text: 'Opgave 2' },
      { type: 'heading', level: 4, text: 'Geef de oplosreactie van keukenzout in water' },
      { type: 'paragraph', text: ['Keukenzout (NaCl) valt uiteen in natrium- en chloride-ionen.'] },
      formula('\\text{NaCl (s)} \\;\\longrightarrow\\; \\text{Na}^+ (aq) + \\text{Cl}^- (aq)'),
      {
        type: 'list',
        items: [
          ['(s) = solid, dus vaste stof.'],
          ['(aq) = aqueous, opgelost in water.'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Niet alle zouten lossen goed op. Wanneer je twee oplossingen mengt, kan er een slecht oplosbaar zout (neerslag) ontstaan. Dit check je in tabel BINAS 32.',
        ],
      },
      { type: 'heading', level: 3, text: 'Opgave 3' },
      { type: 'heading', level: 4, text: 'Geef de neerslagreactie met zilvernitraat en keukenzout' },
      {
        type: 'paragraph',
        text: [
          strong('Vraag:'),
          ' Welke neerslag ontstaat als je oplossingen van AgNO',
          tex('_3'),
          ' en NaCl mengt? Schrijf de reactievergelijking op.',
          br,
          'Volgens de oplosbaarheidstabel (BINAS 32) is AgCl slecht oplosbaar. Zilverionen en chloride-ionen vormen dus een neerslag:',
        ],
      },
      formula('\\text{Ag}^+ (aq) + \\text{Cl}^- (aq) \\;\\longrightarrow\\; \\text{AgCl (s)}'),
    ],
  },
  {
    slug: 'radioactief-verval',
    title: 'Radioactief verval',
    tags: ['Natuurkunde'],
    excerpt:
      'Radioactief verval berekenen: bepaal de benodigde massa I-125 voor medische behandeling. Stap-voor-stap uitleg met halveringstijd, activiteit en vervalconstante.',
    author: 'Marieke Spijker',
    publishedAt: '2025-11-03',
    readingMinutes: 2,
    wordCount: 201,
    coverImage: '/img/kennisbank/radioactief-verval.jpg',
    coverAlt: 'Radioactief verval in een kernreactor',
    body: [
      { type: 'heading', text: 'Radioactief verval' },
      {
        type: 'paragraph',
        text: [
          'Bij het verval van I-125 worden ',
          tex('\\gamma'),
          '-fotonen uitgezonden met een gemiddelde energie van 28 keV, die geabsorbeerd worden door de tumor. De naaldjes worden tijdens een operatie in de tumor geplaatst. Ze worden 10 dagen vóór de operatie geproduceerd. Op het moment van de operatie moet de activiteit van het I-125 in één naaldje 17 MBq zijn.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Opgave:'),
          ' Bereken de massa I-125 in kg die daartoe tijdens de productie in één naaldje moet worden aangebracht.',
        ],
      },
      { type: 'heading', level: 3, text: 'Stap 1: Bepaal de benodigde activiteit bij productie' },
      { type: 'paragraph', text: ['Radioactief verval volgt de formule:'] },
      formula('A(t) = A_0 \\times \\left(\\frac{1}{2}\\right)^{\\frac{t}{t_{1/2}}}'),
      { type: 'paragraph', text: ['waarbij:'] },
      {
        type: 'list',
        items: [
          [
            tex('A(t)'),
            ' = activiteit op tijdstip ',
            tex('t'),
            ' (hier bij operatie: ',
            tex('17\\,\\text{MBq}'),
            ')',
          ],
          [tex('A_0'), ' = activiteit bij productie'],
          [tex('t_{1/2}'), ' = halveringstijd van I-125 (', tex('59,4'), ' dagen)'],
          [tex('t'), ' = tijd tussen productie en operatie (', tex('10'), ' dagen)'],
        ],
      },
      { type: 'paragraph', text: ['Herschikking van de formule geeft:'] },
      formula('A_0 = A(t) \\times \\left(\\frac{1}{2}\\right)^{-\\frac{t}{t_{1/2}}} = A(t) \\times 2^{\\frac{t}{t_{1/2}}}'),
      { type: 'paragraph', text: ['Invullen van de waarden:'] },
      formula('A_0 = 17 \\cdot 10^6\\,\\text{Bq} \\times 2^{\\frac{10}{59,4}}'),
      formula('2^{\\frac{10}{59,4}} \\approx 1,124'),
      formula('A_0 \\approx 17 \\cdot 10^6 \\times 1,124 \\approx 19,1 \\cdot 10^6\\,\\text{Bq}'),
      {
        type: 'paragraph',
        text: [
          'Dus bij productie moet de activiteit ongeveer ',
          tex('19,1\\,\\text{MBq}'),
          ' zijn.',
        ],
      },
      { type: 'heading', level: 3, text: 'Stap 2: Bereken het aantal kernen' },
      {
        type: 'paragraph',
        text: [
          'De activiteit is ook gerelateerd aan het aantal kernen ',
          tex('N'),
          ' via:',
        ],
      },
      formula('A_0 = \\lambda N'),
      { type: 'paragraph', text: ['waarbij ', tex('\\lambda'), ' de vervalconstante is:'] },
      formula('\\lambda = \\frac{\\ln 2}{t_{1/2}}'),
      {
        type: 'paragraph',
        text: [
          'Om in SI-eenheden te rekenen zetten we ',
          tex('t_{1/2}'),
          ' om naar seconden:',
        ],
      },
      formula('t_{1/2} = 59,4\\,\\text{dagen} \\times 24\\,\\text{h/dag} \\times 3600\\,\\text{s/h} \\approx 5,13 \\cdot 10^6\\,\\text{s}'),
      formula('\\lambda = \\frac{0,693}{5,13 \\cdot 10^6} \\approx 1,35 \\cdot 10^{-7}\\,\\text{s}^{-1}'),
      { type: 'paragraph', text: ['Nu het aantal kernen:'] },
      formula('N = \\frac{A_0}{\\lambda} = \\frac{19,1 \\cdot 10^6}{1,35 \\cdot 10^{-7}} \\approx 1,41 \\cdot 10^{14}\\,\\text{kernen}'),
      { type: 'heading', level: 3, text: 'Stap 3: Bereken de massa van I-125' },
      { type: 'paragraph', text: ['De massa van één I-125 kern:'] },
      formula('m_{\\text{kern}} = \\frac{125\\,\\text{g/mol}}{6,022 \\cdot 10^{23}\\,\\text{mol}^{-1}} \\approx 2,07 \\cdot 10^{-22}\\,\\text{g}'),
      { type: 'paragraph', text: ['De totale massa in één naaldje:'] },
      formula('m = N \\cdot m_{\\text{kern}} = 1,41 \\cdot 10^{14} \\times 2,07 \\cdot 10^{-22}\\,\\text{g} \\approx 2,92 \\cdot 10^{-8}\\,\\text{g}'),
      formula('m \\approx 2,9 \\cdot 10^{-11}\\,\\text{kg}'),
      { type: 'heading', level: 3, text: 'Conclusie' },
      {
        type: 'paragraph',
        text: [
          'De massa I-125 die bij productie in één naaldje moet worden aangebracht is:',
        ],
      },
      formula('m \\approx 2,9 \\cdot 10^{-11}\\,\\text{kg}'),
    ],
  },
  {
    slug: 'ph-berekeningen',
    title: 'pH–berekeningen',
    tags: ['Scheikunde'],
    excerpt:
      'pH berekenen van sterke en zwakke zuren plus buffers. Van HCl tot azijnzuur: stap-voor-stap uitleg met formules, zuurconstanten en BINAS tabel 49.',
    author: 'Marieke Spijker',
    publishedAt: '2025-11-03',
    readingMinutes: 2,
    wordCount: 229,
    coverImage: '/img/kennisbank/ph-berekeningen.webp',
    coverAlt: 'Een limoen om het zuur van een ph berekening uit te beelden',
    body: [
      { type: 'heading', text: 'pH-berekeningen' },
      { type: 'paragraph', text: ['In deze blog behandelen we drie verschillende soorten pH-berekeningen:'] },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Bereken de pH van 0,020 M HCl.'],
          [
            'Bereken de pH van 0,020 M CH',
            tex('_3'),
            'COOH (azijnzuur). Voor azijnzuur (CH',
            tex('_3'),
            'COOH) geldt: ',
            tex('K_z = 1,8 \\times 10^{-5}'),
            '.',
          ],
          [
            'Je maakt een buffer door 50,0 mL 0,200 M azijnzuur (CH',
            tex('_3'),
            'COOH) te mengen met 50,0 mL 0,200 M natriumacetaat (CH',
            tex('_3'),
            'COONa). Bereken de pH van de buffer.',
          ],
        ],
      },
      { type: 'heading', level: 3, text: 'a) pH van 0,020 M sterk zuur (HCl)' },
      {
        type: 'paragraph',
        text: [
          'HCl is een sterk zuur, dat betekent dat het volledig uiteenvalt in water.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Hoe kun je dit weten? In BINAS tabel 49 staat HCl boven H',
          tex('_3'),
          'O',
          tex('^+'),
          '. Alles daarboven zijn sterke zuren, alles tussen H',
          tex('_3'),
          'O',
          tex('^+'),
          ' en H',
          tex('_2'),
          'O in zijn zwakke zuren.',
        ],
      },
      { type: 'paragraph', text: ['Voor een sterk zuur geldt dus:'] },
      formula('[H_3O^+] = c = 0,020\\, \\text{M}'),
      formula('\\text{pH} = -\\log [H_3O^+] = -\\log (0,020) = 1,70'),
      { type: 'paragraph', text: [strong('Antwoord:'), ' pH = 1,70'] },
      { type: 'divider' },
      { type: 'heading', level: 3, text: 'b) pH van zwak zuur (azijnzuur)' },
      { type: 'paragraph', text: ['Azijnzuur is een zwak zuur, het valt dus maar gedeeltelijk uiteen.'] },
      { type: 'paragraph', text: ['Dan geldt bij benadering:'] },
      formula('[H_3O^+] \\approx \\sqrt{K_z \\cdot c}'),
      { type: 'paragraph', text: ['Met ', tex('K_z = 1,8 \\times 10^{-5}'), ' en ', tex('c = 0,020'), ' M:'] },
      formula('[H_3O^+] \\approx \\sqrt{1,8 \\times 10^{-5} \\cdot 0,020} \\approx 5,9 \\times 10^{-4}\\, \\text{M}'),
      { type: 'paragraph', text: ['Daaruit volgt:'] },
      formula('\\text{pH} = -\\log (5,9 \\times 10^{-4}) \\approx 3,2'),
      { type: 'paragraph', text: [strong('Antwoord:'), ' pH ', tex('\\approx'), ' 3,2'] },
      { type: 'divider' },
      { type: 'heading', level: 3, text: 'c) Buffer van azijnzuur en natriumacetaat' },
      {
        type: 'paragraph',
        text: [
          'Een buffer bestaat uit een zwak zuur (HA) samen met zijn geconjugeerde base (A',
          tex('^-'),
          ').',
        ],
      },
      { type: 'heading', level: 4, text: 'Stap 1: Beginconcentraties' },
      {
        type: 'paragraph',
        text: [
          'Eerst is het belangrijk om de concentraties van HA en A',
          tex('^-'),
          ' te bepalen. Dat doen we door het beginvolume en de concentratie met elkaar te vermenigvuldigen.',
        ],
      },
      { type: 'paragraph', text: ['We mengen:'] },
      formula('V(\\text{HA}) = 50,0\\, \\text{mL} \\quad \\text{van } 0,200\\, \\text{M CH}_3\\text{COOH}'),
      formula('V(\\text{A}^-) = 50,0\\, \\text{mL} \\quad \\text{van } 0,200\\, \\text{M CH}_3\\text{COONa}'),
      { type: 'paragraph', text: ['Totale volume:'] },
      formula('V_\\text{totaal} = 50,0 + 50,0 = 100,0\\, \\text{mL} = 0,1000\\, \\text{L}'),
      { type: 'paragraph', text: ['Mollen:'] },
      formula('n(\\text{HA}) = 0,0500\\, \\text{L} \\times 0,200\\, \\text{mol/L} = 0,0100\\, \\text{mol}'),
      formula('n(\\text{A}^-) = 0,0500\\, \\text{L} \\times 0,200\\, \\text{mol/L} = 0,0100\\, \\text{mol}'),
      { type: 'paragraph', text: ['Concentraties na mengen:'] },
      formula('[\\text{HA}] = \\frac{0,0100}{0,1000} = 0,100\\, \\text{M}'),
      formula('[\\text{A}^-] = \\frac{0,0100}{0,1000} = 0,100\\, \\text{M}'),
      { type: 'heading', level: 4, text: 'Stap 2: Gebruik de zuurconstante' },
      { type: 'paragraph', text: ['Voor azijnzuur geldt:'] },
      formula('K_z = 1,8 \\times 10^{-5}'),
      { type: 'paragraph', text: ['De algemene formule is:'] },
      formula('K_z = \\frac{[H_3O^+] \\cdot [A^-]}{[HA]}'),
      { type: 'paragraph', text: ['Omdat ', tex('[A^-] = [HA]'), ', is de breuk gelijk aan 1:'] },
      formula('K_z = [H_3O^+]'),
      { type: 'paragraph', text: ['Dus:'] },
      formula('[H_3O^+] = 1,8 \\times 10^{-5}\\, \\text{M}'),
      { type: 'heading', level: 4, text: 'Stap 3: Bereken de pH' },
      formula('\\text{pH} = -\\log [H_3O^+] = -\\log(1,8 \\times 10^{-5}) \\approx 4,74'),
      { type: 'paragraph', text: [strong('Antwoord:'), ' pH ', tex('\\approx'), ' 4,74'] },
    ],
  },
  {
    slug: 'molberekeningen',
    title: 'Molberekeningen',
    tags: ['Scheikunde'],
    excerpt:
      'Leer soda produceren uit keukenzout en kalksteen. Stap-voor-stap berekening van molaire massa\'s en molverhoudingen met praktische voorbeeldopgave.',
    author: 'Marieke Spijker',
    publishedAt: '2025-11-03',
    readingMinutes: 2,
    wordCount: 203,
    coverImage: '/img/kennisbank/molberekeningen.jpg',
    coverAlt: 'Een chemicus visualiseert de mol berekeningen',
    body: [
      { type: 'heading', text: 'Voorbeeldopgave: Soda uit keukenzout en kalksteen' },
      {
        type: 'paragraph',
        text: [
          'Soda, oftewel natriumcarbonaat, wordt geproduceerd door opgelost keukenzout (NaCl) en kalksteen (CaCO',
          tex('_3'),
          ') bij elkaar te voegen. Als bijproduct wordt calciumchloride gevormd.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Vraag:'),
          ' Hoeveel kg keukenzout is er nodig om 10 kilogram soda te produceren?',
        ],
      },
      { type: 'heading', level: 3, text: '1. Reactievergelijking' },
      {
        type: 'paragraph',
        text: [
          'Het is altijd belangrijk om eerst de kloppende reactievergelijking te hebben. Pas daarna kun je met massa’s en molverhoudingen gaan rekenen.',
        ],
      },
      { type: 'paragraph', text: ['De vergelijking voor deze reactie is:'] },
      formula('\\text{CaCO}_3 + 2\\,\\text{NaCl} \\;\\longrightarrow\\; \\text{Na}_2\\text{CO}_3 + \\text{CaCl}_2'),
      { type: 'paragraph', text: [strong('Controle:')] },
      {
        type: 'list',
        items: [
          ['Links: Ca (1), C (1), O (3), Na (2), Cl (2)'],
          ['Rechts: Ca (1), C (1), O (3), Na (2), Cl (2)'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Links en rechts hebben we dus evenveel van de benodigde atomen, dus deze reactievergelijking klopt.',
        ],
      },
      { type: 'heading', level: 3, text: '2. Massa naar mol omrekening natriumcarbonaat' },
      { type: 'paragraph', text: ['We willen 10,0 kilogram Na', tex('_2'), 'CO', tex('_3'), ' (soda) maken.'] },
      { type: 'paragraph', text: ['De molaire massa van natriumcarbonaat is:'] },
      formula('M(\\text{Na}_2\\text{CO}_3) = 2 \\times 23,0 + 12,0 + 3 \\times 16,0 = 106,0\\,\\text{g/mol}'),
      { type: 'paragraph', text: ['Het aantal mol in 10,0 kilogram natriumcarbonaat is:'] },
      formula('n(\\text{Na}_2\\text{CO}_3) = \\frac{10\\,000\\, \\text{g}}{106,0\\, \\text{g/mol}} \\approx 94,3\\, \\text{mol}'),
      { type: 'heading', level: 3, text: '3. Hoeveel NaCl heb je nodig?' },
      {
        type: 'paragraph',
        text: [
          'Uit de reactievergelijking blijkt dat er 2 mol NaCl nodig is voor 1 mol Na',
          tex('_2'),
          'CO',
          tex('_3'),
          '.',
        ],
      },
      { type: 'paragraph', text: ['Dus:'] },
      formula('n(\\text{NaCl}) = 2 \\times 94,3 = 188,6\\, \\text{mol}'),
      { type: 'paragraph', text: ['De molaire massa van NaCl is:'] },
      formula('M(\\text{NaCl}) = 23,0 + 35,5 = 58,5\\,\\text{g/mol}'),
      { type: 'paragraph', text: ['De benodigde massa NaCl is:'] },
      formula('m(\\text{NaCl}) = 188,6 \\times 58,5 \\approx 11\\,000\\, \\text{g} = 11,0\\,\\text{kg}'),
      { type: 'heading', level: 3, text: 'Vragen om zelf te proberen' },
      {
        type: 'list',
        ordered: true,
        items: [
          ['Hoeveel kg kalksteen is er nodig voor 10 kilogram soda?'],
          ['Hoeveel calciumchloride wordt gevormd als bijproduct wanneer je 10 kilogram soda wilt maken?'],
        ],
      },
      { type: 'heading', level: 3, text: 'Antwoorden' },
      {
        type: 'list',
        items: [
          ['9,43 kilogram CaCO', tex('_3'), ' (kalksteen)'],
          ['10,5 kilogram CaCl', tex('_2')],
        ],
      },
    ],
  },
  {
    slug: 'snelheid-en-versnelling',
    title: 'Snelheid en versnelling',
    tags: ['Natuurkunde'],
    excerpt:
      'Leer alles over snelheid en gemiddelde snelheid met praktische voorbeelden. Van fietsen naar school tot autorit met file. Inclusief formules en berekeningen.',
    author: 'Max',
    publishedAt: '2025-11-03',
    readingMinutes: 3,
    wordCount: 523,
    coverImage: '/img/kennisbank/snelheid-en-versnelling.jpg',
    coverAlt: 'Op de fiets hebt je te maken met snelheid en versnelling',
    body: [
      { type: 'heading', text: 'Snelheid en versnelling' },
      { type: 'heading', level: 3, text: 'Inleiding' },
      {
        type: 'paragraph',
        text: [
          'Stel je voor: het is een zonnige middag en je springt op je fiets om naar de stad te gaan. Je vrienden wachten op je op een terras, tien kilometer verderop. Terwijl je fietst, merk je dat je snelheid steeds verandert: soms trap je hard, soms moet je stoppen voor een rood licht.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Dit dagelijkse verhaal is een perfecte manier om iets te leren over ',
          em('snelheid'),
          ' en ',
          em('gemiddelde snelheid'),
          '. Twee begrippen die je overal tegenkomt, niet alleen in het verkeer maar ook in sport, natuur en technologie.',
        ],
      },
      { type: 'heading', level: 3, text: 'Wat is snelheid?' },
      {
        type: 'paragraph',
        text: [
          'Snelheid geeft aan hoeveel afstand je in een bepaalde tijd aflegt. De algemene formule is:',
        ],
      },
      formula('v = \\frac{s}{t}'),
      { type: 'paragraph', text: ['waarbij:'] },
      {
        type: 'list',
        items: [
          [tex('v'), ' = snelheid,'],
          [tex('s'), ' = afstand,'],
          [tex('t'), ' = tijd.'],
        ],
      },
      { type: 'heading', level: 4, text: 'Voorbeeld: de fietstocht' },
      { type: 'paragraph', text: ['Je fietst 10 km in 30 minuten. Dat is 0,5 uur.'] },
      formula('v = \\frac{10}{0{,}5} = 20 \\,\\text{km/h}.'),
      { type: 'paragraph', text: ['Je snelheid is dus 20 km/h.'] },
      { type: 'heading', level: 3, text: 'Van km/h naar m/s' },
      { type: 'paragraph', text: ['In de natuurkunde werken we vaak in meters per seconde.'] },
      formula('20 \\,\\text{km/h} = \\frac{20000 \\,\\text{m}}{3600 \\,\\text{s}} \\approx 5{,}6 \\,\\text{m/s}.'),
      {
        type: 'paragraph',
        text: [
          'Dat betekent dat je in één seconde bijna 6 meter aflegt – ongeveer de lengte van een kleine auto.',
        ],
      },
      { type: 'heading', level: 3, text: 'Snelheid verandert vaak' },
      {
        type: 'paragraph',
        text: [
          'In werkelijkheid houd je niet steeds exact dezelfde snelheid aan. Je stopt, versnelt, vertraagt. Daarom gebruiken we vaak de ',
          em('gemiddelde snelheid'),
          ':',
        ],
      },
      formula('v_\\text{gem} = \\frac{s_\\text{totaal}}{t_\\text{totaal}}.'),
      { type: 'heading', level: 4, text: 'Voorbeeld met een stop' },
      {
        type: 'paragraph',
        text: [
          'Stel dat je onderweg 5 minuten moet wachten bij een open brug. De totale tijd is dan 35 minuten.',
        ],
      },
      formula('v_\\text{gem} = \\frac{10}{35/60} \\approx 17{,}1 \\,\\text{km/h}.'),
      {
        type: 'paragraph',
        text: [
          'Hoewel je vaak rond de 20 km/h fietste, wordt de gemiddelde snelheid lager door de stop.',
        ],
      },
      { type: 'heading', level: 3, text: 'Waarom is dit belangrijk?' },
      { type: 'paragraph', text: ['Snelheid speelt in veel situaties een rol:'] },
      {
        type: 'list',
        items: [
          ['Verkeer: reistijden en maximumsnelheden.'],
          ['Sport: hoe snel loopt of fietst iemand?'],
          ['Natuurkunde: de snelheid van een vallend voorwerp of zelfs van het licht.'],
        ],
      },
      { type: 'paragraph', text: ['Het is dus niet alleen theorie, maar iets dat dagelijks relevant is.'] },
      { type: 'heading', level: 3, text: 'Gemiddelde snelheid in het dagelijks leven' },
      { type: 'paragraph', text: ['Stel: je loopt 3 km naar huis in 40 minuten.'] },
      formula('v = \\frac{3}{40/60} \\approx 4{,}5 \\,\\text{km/h}.'),
      { type: 'paragraph', text: ['Dat klopt met de normale loopsnelheid van mensen.'] },
      {
        type: 'paragraph',
        text: [
          'Nog een voorbeeld: een autorit van Groningen naar Utrecht (180 km). Zonder file: 2 uur, dus 90 km/h. Met een uur file:',
        ],
      },
      formula('v_\\text{gem} = \\frac{180}{3} = 60 \\,\\text{km/h}.'),
      { type: 'paragraph', text: ['Gemiddeld zak je flink terug, ook al reed je stukken lang 120 km/h.'] },
      { type: 'heading', level: 3, text: 'Momentane snelheid' },
      {
        type: 'paragraph',
        text: [
          'Naast de gemiddelde snelheid is er de ',
          em('momentane snelheid'),
          ': de snelheid op één specifiek moment. Dat is wat de snelheidsmeter van je auto of fietscomputer laat zien.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'De gemiddelde snelheid geeft een overzicht, de momentane snelheid vertelt wat er precies nú gebeurt.',
        ],
      },
      { type: 'heading', level: 3, text: 'Oefenvraag' },
      { type: 'paragraph', text: ['Joris fietst naar school.'] },
      {
        type: 'list',
        items: [
          ['Eerste 4 km in 12 minuten.'],
          ['Daarna 2 km in 10 minuten.'],
          ['Tenslotte 4 km in 8 minuten.'],
        ],
      },
      { type: 'paragraph', text: ['Bereken de gemiddelde snelheid.'] },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      { type: 'paragraph', text: ['Totale afstand:'] },
      formula('s_\\text{totaal} = 4 + 2 + 4 = 10 \\,\\text{km}.'),
      { type: 'paragraph', text: ['Totale tijd:'] },
      formula('t_\\text{totaal} = 12 + 10 + 8 = 30 \\,\\text{min} = 0{,}5 \\,\\text{uur}.'),
      { type: 'paragraph', text: ['Gemiddelde snelheid:'] },
      formula('v_\\text{gem} = \\frac{10}{0{,}5} = 20 \\,\\text{km/h}.'),
      {
        type: 'paragraph',
        text: [
          'Dus Joris reed gemiddeld 20 km/h, ondanks dat hij tussendoor langzamer ging.',
        ],
      },
      { type: 'heading', level: 3, text: 'Afsluiting' },
      {
        type: 'paragraph',
        text: [
          'Snelheid is een van de meest fundamentele begrippen in de natuurkunde. Met de simpele formule ',
          tex('v = s/t'),
          ' kun je tal van alledaagse situaties begrijpen, van fietsen en lopen tot files en sport.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Belangrijk is te onthouden dat snelheid meestal niet constant is, en dat we daarom vaak de ',
          em('gemiddelde snelheid'),
          ' gebruiken om een rit te beschrijven.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Dus, de volgende keer dat je op je fiets stapt, kun je niet alleen nadenken over hoe snel je gaat, maar ook over wat je gemiddelde snelheid zou zijn. Daarmee kijk je opeens met een natuurkundige blik naar je eigen reis.',
        ],
      },
    ],
  },
  {
    slug: 'reactievergelijkingen',
    title: 'Reactievergelijkingen',
    tags: ['Scheikunde'],
    excerpt:
      'Leer reactievergelijkingen opstellen en in balans brengen. Van simpele verbranding tot complexe chemische reacties, uitgelegd met voorbeelden en uitwerkingen.',
    author: 'Thomas Smeman',
    publishedAt: '2025-11-03',
    readingMinutes: 4,
    wordCount: 669,
    coverImage: '/img/kennisbank/reactievergelijkingen.jpg',
    coverAlt: 'Een complex molecuul',
    body: [
      { type: 'heading', text: 'Reactievergelijkingen stap voor stap' },
      {
        type: 'paragraph',
        text: [
          'Reactievergelijkingen zijn de manier waarop scheikundigen een reactie in symbolen en formules vastleggen. Ze laten zien welke stoffen met elkaar reageren (de beginstoffen) en welke stoffen er gevormd worden (de reactieproducten). Toch kan het soms lastig zijn om precies te begrijpen hoe je een reactievergelijking opstelt en in balans brengt. Aan de hand van drie voorbeeldvragen gaan we dit stap voor stap duidelijk maken.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 1' },
      {
        type: 'paragraph',
        text: [
          strong('Hoe ziet een simpele reactievergelijking eruit, en hoe stel je die op?'),
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'paragraph',
        text: [
          'Stel je voor dat je een kaars aansteekt. In een kaars zit was, en dat is opgebouwd uit koolstof (C) en waterstof (H). Wanneer de kaars brandt, reageert de was met zuurstof (O',
          tex('_2'),
          ') uit de lucht. Daarbij ontstaan koolstofdioxide (CO',
          tex('_2'),
          ') en water (H',
          tex('_2'),
          'O).',
        ],
      },
      { type: 'paragraph', text: ['De reactievergelijking is dan:'] },
      formula('C + O_2 \\rightarrow CO_2'),
      {
        type: 'paragraph',
        text: [
          'Dit is een heel simpel voorbeeld, want er is één koolstofatoom en dat reageert met één zuurstofmolecuul om één koolstofdioxidemolecuul te vormen. Alles klopt meteen: het aantal C- en O-atomen is hetzelfde links en rechts. Dit heet een ',
          strong('gebalanceerde vergelijking'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Een eenvoudige reactie stel je op door eerst goed te kijken: welke stoffen reageren, en welke stoffen ontstaan er? Daarna controleer je of de aantallen atomen aan beide kanten gelijk zijn.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 2' },
      { type: 'paragraph', text: [strong('Hoe breng je een moeilijkere reactie in balans?')] },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'paragraph',
        text: [
          'Soms zijn reacties niet vanzelf in balans. Neem bijvoorbeeld de verbranding van methaan (CH',
          tex('_4'),
          '), een gas dat ook in aardgas zit. Methaan reageert met zuurstof en er ontstaan koolstofdioxide en water. De ongebalanceerde vergelijking ziet er zo uit:',
        ],
      },
      formula('CH_4 + O_2 \\rightarrow CO_2 + H_2O'),
      { type: 'paragraph', text: ['Nu moeten we stap voor stap kijken of de atomen kloppen:'] },
      {
        type: 'list',
        items: [
          ['Links hebben we 1 C-atoom en rechts ook 1 C-atoom. Dit klopt dus.'],
          [
            'Links hebben we 4 H-atomen (in CH',
            tex('_4'),
            '), rechts hebben we er 2 in H',
            tex('_2'),
            'O. Dat is niet in balans. Als we rechts een 2 voor H',
            tex('_2'),
            'O zetten, hebben we 4 H-atomen aan beide kanten.',
          ],
          [
            'Nu bekijken we de zuurstof: links hebben we O',
            tex('_2'),
            ', dus 2 atomen. Rechts hebben we 2 in CO',
            tex('_2'),
            ' en 2 in 2H',
            tex('_2'),
            'O, samen dus 4 atomen. Dat klopt nog niet. Zet daarom links een 2 voor O',
            tex('_2'),
            ', dan hebben we 4 zuurstofatomen links en 4 rechts.',
          ],
        ],
      },
      { type: 'paragraph', text: ['De juiste vergelijking is dus:'] },
      formula('CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O'),
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Een reactievergelijking breng je in balans door stap voor stap te tellen hoeveel atomen er aan elke kant voorkomen. Met wat uitproberen (trial-and-error) zorg je ervoor dat de aantallen gelijk worden.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 3' },
      {
        type: 'paragraph',
        text: [
          strong('Hoe stel je zelf een reactievergelijking op aan de hand van een verhaal?'),
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking:' },
      {
        type: 'paragraph',
        text: [
          'Stel dat je een stukje ijzer buiten laat liggen in de regen. Na een tijdje begint het ijzer te roesten. Wat gebeurt er dan eigenlijk?',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Het ijzer reageert met zuurstof uit de lucht en water. Hierbij ontstaat ijzer(III)oxide (Fe',
          tex('_2'),
          'O',
          tex('_3'),
          '), het bekende roest. De eerste stap is om de stoffen op te schrijven:',
        ],
      },
      formula('Fe + O_2 \\rightarrow Fe_2O_3'),
      { type: 'paragraph', text: ['Maar dit is nog niet in balans. We tellen:'] },
      {
        type: 'list',
        items: [
          ['Links 1 Fe, rechts 2 Fe. Zet daarom links een 2 voor Fe.'],
          ['Nu hebben we links 2 Fe en rechts ook 2 Fe. Dat klopt.'],
          ['Links hebben we O', tex('_2'), ', dus 2 O-atomen. Rechts hebben we 3 O-atomen. Dit klopt niet.'],
          [
            'Om dit goed te krijgen, moeten we links en rechts de juiste verhoudingen kiezen. Zet links 3 O',
            tex('_2'),
            ' en rechts 2 Fe',
            tex('_2'),
            'O',
            tex('_3'),
            '. Dan hebben we 6 O-atomen aan beide kanten en 4 Fe-atomen aan beide kanten.',
          ],
        ],
      },
      { type: 'paragraph', text: ['De gebalanceerde vergelijking wordt dus:'] },
      formula('4Fe + 3O_2 \\rightarrow 2Fe_2O_3'),
      {
        type: 'paragraph',
        text: [
          strong('Conclusie:'),
          ' Uit een verhaal kun je zelf een vergelijking opstellen door de begin- en eindstoffen te bedenken. Daarna breng je de vergelijking netjes in balans door te tellen en de juiste verhoudingen te kiezen.',
        ],
      },
      { type: 'heading', text: 'Samenvatting' },
      {
        type: 'paragraph',
        text: [
          'Reactievergelijkingen beschrijven wat er met stoffen gebeurt tijdens een reactie. Het maakt niet uit of de reactie simpel of complex is, de regels zijn altijd hetzelfde:',
        ],
      },
      {
        type: 'list',
        items: [
          ['Noteer eerst de begin- en eindstoffen.'],
          [
            'Zorg dat de vergelijking ',
            strong('in balans'),
            ' is: links en rechts evenveel atomen van elke soort.',
          ],
          ['Noteer alleen de stoffen die echt meedoen aan de reactie.'],
          ['Gebruik eventueel je BiNaS of naamgeving om de juiste formules te vinden.'],
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Zo wordt een reactievergelijking een handig hulpmiddel om chemische processen overzichtelijk weer te geven.',
        ],
      },
    ],
  },
  {
    slug: 'elektromagnetisch-spectrum',
    title: 'Elektromagnetisch Spectrum',
    tags: ['Natuurkunde'],
    excerpt:
      'Ontdek het elektromagnetisch spectrum: van zichtbaar licht tot infrarood en ultraviolet. Leer over golflengte, frequentie en roodverschuiving met formules.',
    author: 'Thomas Smeman',
    publishedAt: '2025-11-03',
    readingMinutes: 3,
    wordCount: 428,
    coverImage: '/img/kennisbank/elektromagnetisch-spectrum.webp',
    coverAlt: 'Electromagnetisch spectrum gevisualieerd door een regenboog',
    body: [
      { type: 'heading', text: 'Het elektromagnetisch spectrum' },
      {
        type: 'paragraph',
        text: [
          'Zonder licht zouden wij de wereld om ons heen helemaal niet kunnen zien. Het feit dat wij kleuren waarnemen – rood, groen, blauw, en alles daartussen – is geen toeval. Achter dit verschijnsel zit een heel systeem: het ',
          strong('elektromagnetisch spectrum'),
          '. Dit spectrum gaat veel verder dan het licht dat wij met onze ogen kunnen zien. Er bestaan ook golven zoals ',
          em('infrarood'),
          ', ',
          em('ultraviolet'),
          ' en zelfs ',
          em('radiogolven'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Om te begrijpen hoe dit werkt, bekijken we een aantal vragen die steeds een nieuw aspect van licht en het spectrum belichten.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 1: Golflengte en frequentie' },
      {
        type: 'paragraph',
        text: [
          'Licht kan beschreven worden door twee grootheden: de golflengte ',
          tex('\\lambda'),
          ' (in meter) en de frequentie ',
          tex('f'),
          ' (in Hertz). Deze twee grootheden zijn met elkaar verbonden via de formule:',
        ],
      },
      formula('c = \\lambda \\cdot f,'),
      {
        type: 'paragraph',
        text: [
          'waarbij ',
          tex('c'),
          ' de lichtsnelheid is, ongeveer ',
          tex('3,0 \\times 10^{8} \\,\\text{m/s}'),
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Het zichtbare licht voor mensen ligt ongeveer tussen de ',
          tex('400\\,\\text{nm}'),
          ' (violet/blauw) en ',
          tex('700\\,\\text{nm}'),
          ' (rood). Golflengtes langer dan ',
          tex('700\\,\\text{nm}'),
          ' vallen in het ',
          em('infrarood'),
          ' gebied, en korter dan ',
          tex('400\\,\\text{nm}'),
          ' vallen ze in het ',
          em('ultraviolet'),
          ' gebied.',
        ],
      },
      { type: 'heading', level: 4, text: 'Opdracht' },
      {
        type: 'paragraph',
        text: [
          'Bereken voor de volgende golflengtes de frequentie. Geef daarna aan in welk gedeelte van het spectrum ze vallen (zichtbaar, infrarood of ultraviolet):',
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          [tex('\\lambda = 500\\,\\text{nm}')],
          [tex('\\lambda = 900\\,\\text{nm}')],
          [tex('\\lambda = 250\\,\\text{nm}')],
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      {
        type: 'list',
        items: [
          [
            'Voor ',
            tex('\\lambda = 500\\,\\text{nm} = 500 \\times 10^{-9}\\,\\text{m}'),
            ':',
            br,
            ' ',
            tex('f = \\frac{c}{\\lambda} = \\frac{3,0 \\times 10^{8}}{500 \\times 10^{-9}} = 6,0 \\times 10^{14}\\,\\text{Hz}.'),
            br,
            ' Dit valt binnen het zichtbare licht (groen).',
          ],
          [
            'Voor ',
            tex('\\lambda = 900\\,\\text{nm} = 900 \\times 10^{-9}\\,\\text{m}'),
            ':',
            br,
            ' ',
            tex('f = \\frac{3,0 \\times 10^{8}}{900 \\times 10^{-9}} \\approx 3,3 \\times 10^{14}\\,\\text{Hz}.'),
            br,
            ' Dit valt buiten het zichtbare gebied, in het ',
            em('infrarood'),
            '.',
          ],
          [
            'Voor ',
            tex('\\lambda = 250\\,\\text{nm} = 250 \\times 10^{-9}\\,\\text{m}'),
            ':',
            br,
            ' ',
            tex('f = \\frac{3,0 \\times 10^{8}}{250 \\times 10^{-9}} = 1,2 \\times 10^{15}\\,\\text{Hz}.'),
            br,
            ' Dit valt buiten het zichtbare gebied, in het ',
            em('ultraviolet'),
            '.',
          ],
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 2: Roodverschuiving' },
      {
        type: 'paragraph',
        text: [
          'Wanneer een object zich van ons af beweegt, lijkt de golflengte van het licht dat wij waarnemen langer te worden. Dit noemen we ',
          strong('roodverschuiving'),
          '. Beweegt het object juist naar ons toe, dan wordt de golflengte korter, en dit heet ',
          strong('blauwverschuiving'),
          '. Dit effect lijkt op het geluid van een ambulance: als hij naar je toe rijdt hoor je een hogere toon, en als hij weg rijdt een lagere toon.',
        ],
      },
      { type: 'paragraph', text: ['De formule voor rood- of blauwverschuiving is:'] },
      formula('\\frac{\\Delta \\lambda}{\\lambda_0} = \\frac{v}{c},'),
      {
        type: 'paragraph',
        text: [
          'waarbij ',
          tex('\\lambda_0'),
          ' de oorspronkelijke golflengte is, ',
          tex('\\Delta \\lambda'),
          ' het verschil in golflengte, en ',
          tex('v'),
          ' de snelheid van het object.',
        ],
      },
      { type: 'heading', level: 4, text: 'Opdracht' },
      {
        type: 'paragraph',
        text: [
          'Stel: een ster straalt licht uit met een golflengte van ',
          tex('\\lambda_0 = 500\\,\\text{nm}'),
          '. Op aarde meten we een golflengte van ',
          tex('\\lambda = 505\\,\\text{nm}'),
          '. Bereken met welke snelheid de ster van ons af beweegt.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking' },
      formula('\\Delta \\lambda = \\lambda - \\lambda_0 = 505\\,\\text{nm} - 500\\,\\text{nm} = 5\\,\\text{nm},'),
      formula('\\frac{\\Delta \\lambda}{\\lambda_0} = \\frac{5}{500} = 0,01,'),
      formula('\\frac{v}{c} = 0,01, v = 0,01 \\times c = 0,01 \\times 3,0 \\times 10^{8}\\,\\text{m/s},'),
      formula('v = 3,0 \\times 10^{6}\\,\\text{m/s}.'),
      {
        type: 'paragraph',
        text: [
          'De ster beweegt dus met ',
          tex('3,0 \\times 10^{6}\\,\\text{m/s}'),
          ' van ons af.',
        ],
      },
      { type: 'heading', text: 'Samenvatting' },
      {
        type: 'paragraph',
        text: [
          'Door middel van ',
          strong('golflengtes en frequenties'),
          ' kunnen we precies uitdrukken welk soort licht we waarnemen. Golflengtes die buiten ons bereik liggen, vallen onder infrarood of ultraviolet licht.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Daarnaast kunnen golflengtes veranderen wanneer een object naar ons toe of van ons af beweegt. Dit verschijnsel, ',
          em('roodverschuiving'),
          ' en ',
          em('blauwverschuiving'),
          ', geeft wetenschappers de mogelijkheid om snelheden van sterren en sterrenstelsels te berekenen.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Zo leren we dat het elektromagnetisch spectrum niet alleen bepaalt welke kleuren we zien, maar ook informatie geeft over beweging en afstand in het heelal.',
        ],
      },
    ],
  },
  {
    slug: 'wetten-van-newton',
    title: 'De drie wetten van Newton stap voor stap',
    tags: ['Natuurkunde'],
    excerpt:
      'Leer de drie wetten van Newton met praktische voorbeelden. Van een slee op ijs tot formules voor kracht en versnelling. Inclusief stap-voor-stap uitwerkingen.',
    author: 'Thomas Smeman',
    publishedAt: '2025-11-03',
    readingMinutes: 2,
    wordCount: 337,
    coverImage: '/img/kennisbank/wetten-van-newton.webp',
    coverAlt: 'De 2de wet van newton gevisualiseerd met een newton pendel.',
    body: [
      { type: 'heading', text: 'De drie wetten van Newton stap voor stap' },
      {
        type: 'paragraph',
        text: [
          'De wetten van Newton leggen de basis voor hoe vrijwel alles om ons heen beweegt. In totaal zijn er drie van deze wetten, die we samen stap voor stap gaan doornemen aan de hand van een verhaal met voorbeeldvragen en uitwerkingen.',
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 1' },
      {
        type: 'paragraph',
        text: [
          'Een slee glijdt over een gladde ijsbaan. Er wordt niet meer aan de slee getrokken en de slee is al op snelheid gekomen. Wat zegt de eerste wet van Newton over de beweging van de slee?',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking 1' },
      {
        type: 'paragraph',
        text: [
          'De ',
          strong('eerste wet van Newton'),
          ' zegt: ',
          em('Een voorwerp blijft in rust of beweegt met constante snelheid in een rechte lijn, tenzij er een nettokracht op werkt.'),
        ],
      },
      {
        type: 'paragraph',
        text: [
          'In dit voorbeeld is de slee al in beweging en glijdt deze over een gladde ijsvloer. Omdat we ervan uitgaan dat er bijna geen wrijving is, werken er geen krachten meer in de bewegingsrichting. De nettokracht is dus nul:',
        ],
      },
      formula('F_\\text{netto} = 0'),
      {
        type: 'paragraph',
        text: [
          'Volgens de eerste wet blijft de slee dan in dezelfde richting en met dezelfde snelheid door glijden. Dit kan gek lijken, omdat we in het dagelijks leven gewend zijn dat bewegende dingen vanzelf stoppen. Dat komt dan door wrijving of luchtweerstand, maar in dit verhaal verwaarlozen we die krachten. De conclusie: ',
          em('de slee gaat in constante snelheid rechtdoor zolang er geen krachten op werken.'),
        ],
      },
      { type: 'heading', level: 3, text: 'Vraag 2' },
      {
        type: 'paragraph',
        text: [
          'Stel dat er toch een kracht gaat werken op de slee, bijvoorbeeld doordat iemand hem zachtjes vooruit duwt. De kracht van de duw is ',
          tex('F = 10~\\text{N}'),
          ' en de slee heeft een massa van ',
          tex('m = 5~\\text{kg}'),
          '. De nettokracht is dus niet langer nul. Bereken de versnelling van de slee en bepaal hoe groot de snelheidsverandering is na ',
          tex('t = 2~\\text{s}'),
          '.',
        ],
      },
      { type: 'heading', level: 4, text: 'Uitwerking 2' },
      { type: 'paragraph', text: ['De ', strong('tweede wet van Newton'), ' zegt:'] },
      formula('F = m \\cdot a'),
      {
        type: 'paragraph',
        text: [
          'waarbij ',
          tex('F'),
          ' de nettokracht is, ',
          tex('m'),
          ' de massa en ',
          tex('a'),
          ' de versnelling.',
        ],
      },
      { type: 'paragraph', text: ['We vullen de waarden in:'] },
      formula('a = \\frac{F}{m} = \\frac{10}{5} = 2~\\text{m/s}^2'),
      {
        type: 'paragraph',
        text: [
          'De slee versnelt dus met ',
          tex('2~\\text{m/s}^2'),
          '. Dat betekent dat de snelheid elke seconde met ',
          tex('2~\\text{m/s}'),
          ' toeneemt. Na ',
          tex('t = 2~\\text{s}'),
          ' is de snelheidsverandering:',
        ],
      },
      formula('\\Delta v = a \\cdot t = 2 \\cdot 2 = 4~\\text{m/s}'),
      {
        type: 'paragraph',
        text: [
          'De conclusie: ',
          em('door de kracht van 10 N versnelt de slee en neemt zijn snelheid in 2 seconden met 4 m/s toe.'),
        ],
      },
    ],
  },
  {
    slug: 'halveringstijd-tsjernobyl',
    title: 'Oefenvraag halveringstijd: Terug naar Tsjernobyl – Hoe lang blijft jodium–131 gevaarlijk?',
    tags: ['Natuurkunde'],
    excerpt:
      'In deze oefenvraag werken we de halveringstijd uit voor een stof die vrijkwam bij de kernreactor ramp van Tsjernobyl.',
    author: 'Max',
    publishedAt: '2025-09-15',
    readingMinutes: 2,
    wordCount: 317,
    coverImage: '/img/kennisbank/halveringstijd-tsjernobyl.webp',
    body: [
      { type: 'heading', text: 'Oefenvraag: Terug naar Tsjernobyl – Hoe lang blijft jodium-131 gevaarlijk?' },
      {
        type: 'paragraph',
        text: [
          'In april 1986 gebeurde er iets vreselijks: kernreactor 4 van de kerncentrale in Tsjernobyl ontplofte. Grote delen van Europa kregen te maken met radioactieve wolken, en de omgeving rond de centrale moest halsoverkop worden geëvacueerd.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Eén van de gevaarlijkste stoffen die vrijkwam was ',
          strong('jodium-131'),
          '. Dit is een radioactieve stof die zich in het menselijk lichaam vooral in de schildklier ophoopt. Kort na de explosie werd op sommige plekken vlak bij de reactor een stralingsdosis gemeten van wel ',
          strong('3 Sv per uur'),
          ' door dit jodium.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Nu vraag je je misschien af: hoe lang zou het duren voordat het gebied, als er alleen maar jodium-131 was vrijgekomen, weer veilig zou zijn om te wonen?',
        ],
      },
      { type: 'paragraph', text: ['Uit het verhaal kun je de volgende gegevens halen:'] },
      {
        type: 'list',
        items: [
          ['Stralingsdosis direct na de explosie: 3 Sv/uur'],
          ['Veiligheidsgrens: 1 mSv/jaar'],
          ['Halveringstijd van jodium-131: 8 dagen'],
        ],
      },
      { type: 'divider' },
      { type: 'heading', level: 3, text: 'Stap 1: De veilige dosis omrekenen' },
      {
        type: 'paragraph',
        text: [
          'We moeten de veilige dosis eerst omrekenen naar dezelfde eenheid (Sv/uur).',
        ],
      },
      { type: 'paragraph', text: ['1 mSv/jaar = 0,001 Sv/jaar.'] },
      { type: 'paragraph', text: ['Een jaar heeft ongeveer 8760 uur.'] },
      { type: 'paragraph', text: ['Dus:'] },
      { type: 'paragraph', text: ['0,001 / 8760 ≈ ', strong('1,14 × 10⁻⁷ Sv/uur')] },
      { type: 'paragraph', text: ['Dat is de maximale veilige straling per uur.'] },
      { type: 'divider' },
      { type: 'heading', level: 3, text: 'Stap 2: De halveringsformule' },
      { type: 'paragraph', text: ['De straling neemt af volgens de halveringstijd. De formule is:'] },
      { type: 'paragraph', text: ['Straling op tijd t = Beginstraling × (½)^(t / halveringstijd)'] },
      { type: 'paragraph', text: ['In ons geval:'] },
      { type: 'paragraph', text: ['3 × (½)^(t / 8) = 1,14 × 10⁻⁷'] },
      { type: 'divider' },
      { type: 'heading', level: 3, text: 'Stap 3: Uitrekenen' },
      { type: 'paragraph', text: ['Als je dit oplost, krijg je:'] },
      { type: 'paragraph', text: ['t ≈ 198 dagen'] },
      { type: 'divider' },
      { type: 'heading', level: 3, text: 'Conclusie' },
      {
        type: 'paragraph',
        text: [
          'Na ongeveer ',
          strong('200 dagen'),
          ' (ongeveer een half jaar) is de straling van het jodium-131 gedaald tot een niveau dat veilig zou zijn voor mensen.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          strong('Belangrijk:'),
          ' dit is slechts een rekenvoorbeeld! In werkelijkheid kwamen er in Tsjernobyl ook andere stoffen vrij, zoals cesium-137 en strontium-90 (met halveringstijden van tientallen jaren) en zelfs plutonium (met halveringstijden van duizenden jaren). Daarom is Tsjernobyl vandaag de dag, bijna 40 jaar later, nog steeds geen plek waar je veilig kunt wonen.',
        ],
      },
    ],
  },
  {
    slug: 'effectief-leren-voor-je-wiskundetoets',
    title: 'Effectief leren voor je wiskundetoets',
    tags: ['Studietips', 'Wiskunde'],
    excerpt: 'Wiskunde leer je niet door te lezen, maar door te maken. Zo pak je de week voor een toets aan.',
    author: 'Stefan',
    publishedAt: '2026-01-14',
    readingMinutes: 4,
    wordCount: 680,
    coverImage: '/img/kennisbank/effectief-leren-voor-je-wiskundetoets.jpg',
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
    excerpt: 'Je hoeft niet elke formule uit je hoofd te kennen. Je moet weten wanneer je welke pakt.',
    author: 'Thomas Smeman',
    publishedAt: '2026-02-03',
    readingMinutes: 5,
    wordCount: 850,
    coverImage: '/img/kennisbank/formules-onthouden-bij-natuurkunde.jpg',
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
          'Zo\'n overzicht maken is zelf al het halve leerwerk, en je houdt er een spiekbriefje aan over dat écht van jou is.',
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
    publishedAt: '2026-03-11',
    readingMinutes: 6,
    wordCount: 1020,
    coverImage: '/img/kennisbank/rekenen-aan-reacties-scheikunde.jpg',
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

/** Every article filed under a category, newest first, for its archive page. */
export function articlesInCategory(slug: string): Article[] {
  const category = findCategory(slug)
  if (!category) return []

  return articles
    .filter((article) => article.tags.includes(category.name))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/** Other articles sharing at least one tag with `article`, in list order. */
export function relatedArticles(article: Article, count = 3): Article[] {
  return articles
    .filter((item) => item.slug !== article.slug && item.tags.some((tag) => article.tags.includes(tag)))
    .slice(0, count)
}
