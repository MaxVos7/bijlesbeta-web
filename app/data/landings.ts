/**
 * Content for the subject/level/location landing pages served at
 * `/bijles-[slug]`.
 *
 * These are not a clean subject×city matrix — the real site has 11
 * independently-authored pages split across three different axes (subject,
 * school level, and "aan huis" modality/city), several of which have no city
 * segment at all (`bijles-vmbo`, `bijles-aan-huis`). So one flat list drives
 * one catch-all page, rather than a subject/city cross-product.
 *
 * Content pulled from the original WordPress export (ACF fields on each
 * page: inleiding, sub_titel, seo_tekst_titel, seo_tekst).
 */

export type LandingSegment = {
  text: string
  /** Present when this segment is an inline cross-link to another page. */
  to?: string
}

export type LandingParagraph = LandingSegment[]

export type LandingPage = {
  slug: string
  /** Used as both the <title>/H1 and the hero heading — kept as authored. */
  title: string
  /**
   * Overrides the <title> only, for the two landings whose live title differs
   * from their heading. Set, it replaces the whole title including the brand.
   */
  metaTitle?: string
  /** The kicker above the hero heading. */
  kicker: string
  /** The hero paragraph. */
  intro: string
  /** Heading for the SEO text-and-image block. */
  seoTitle: string
  /** The paragraphs of the SEO text-and-image block, with inline cross-links. */
  seoParagraphs: LandingParagraph[]
  /** Meta description. Empty string where the source page never had one. */
  seoDescription: string
  image: string
  imageAlt: string
}

export const landings: LandingPage[] = [
  {
    slug: 'wiskunde-groningen',
    title: 'Bijles Wiskunde in Groningen',
    kicker: 'Wiskunde bijles aan huis',
    intro:
      'Van brugklas tot eindexamen: onze RUG-studenten helpen je wiskunde écht begrijpen. Persoonlijk, aan huis, en zonder lange contracten.',
    seoTitle: 'Het kwartje moet vallen',
    seoDescription:
      'Zoek je bijles wiskunde in Groningen? Onze RUG-studenten komen bij je thuis. Van wiskunde A tot B, alle niveaus. ✓ Gratis proefles',
    image: '/img/uitleg-b.webp',
    imageAlt: 'Bijles wiskunde in Groningen',
    seoParagraphs: [
      [{ text: 'Zoek je bijles wiskunde in Groningen? Bij Bijles Bèta krijg je persoonlijke begeleiding van studenten die zelf wiskunde of een bèta-studie volgen aan de Rijksuniversiteit Groningen. Ze snappen de stof én weten hoe ze het moeten uitleggen.' }],
      [{ text: 'Onze wiskunde bijles is voor alle niveaus: ' }, { text: 'vmbo', to: '/bijles-vmbo' }, { text: ', ' }, { text: 'havo', to: '/bijles-havo' }, { text: ' en ' }, { text: 'vwo', to: '/bijles-vwo' }, { text: '. Van de brugklas tot je eindexamen. Volg je ' }, { text: 'wiskunde A', to: '/bijles-wiskunde-a-groningen' }, { text: ' of ' }, { text: 'wiskunde B', to: '/bijles-wiskunde-b-groningen' }, { text: '? Onze docenten hebben ervaring met beide varianten.' }],
      [{ text: 'Wat bijles wiskunde in Groningen bij ons bijzonder maakt? We komen ' }, { text: 'bij je thuis', to: '/bijles-aan-huis' }, { text: '. Geen reistijd, geen gedoe. Gewoon effectief werken aan jouw wiskunde in je eigen omgeving.' }],
      [{ text: 'Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' of lees ' }, { text: 'hoe het werkt', to: '/zo-werkt-het' }, { text: '. We starten altijd met een gratis proefles – vrijblijvend en zonder opzegtermijn.' }],
    ],
  },
  {
    slug: 'wiskunde-a-groningen',
    title: 'Bijles Wiskunde A in Groningen',
    kicker: 'Statistiek begrijpelijk gemaakt',
    intro:
      'Statistiek, kansrekening en data-analyse: wiskunde A vraagt een andere aanpak. Onze docenten leren je niet alleen de theorie, maar ook hoe je je grafische rekenmachine optimaal gebruikt.',
    seoTitle: 'Data en kansen onder controle',
    seoDescription:
      'Bijles wiskunde A in Groningen. Statistiek, kansrekening en je grafische rekenmachine - onze docenten maken het helder. ✓ Gratis proefles ✓ Aan huis',
    image: '/img/uitleg-b.webp',
    imageAlt: 'Docent legt wiskunde A uit tijdens de bijles',
    seoParagraphs: [
      [{ text: 'Wiskunde A draait om statistiek, kansrekening en data-analyse. Normale verdelingen, hypothesetoetsen, exponentiële groei - het kan behoorlijk abstract zijn. Bij Bijles Bèta krijg je bijles wiskunde A van studenten die de stof helder kunnen uitleggen.' }],
      [{ text: 'Onze docenten maken statistiek concreet met praktische voorbeelden. We oefenen veel met examenopgaven, zodat je niet alleen de theorie kent maar ook weet hoe je die onder tijdsdruk toepast.' }],
      [{ text: 'Bij wiskunde A is je grafische rekenmachine onmisbaar. Onze docenten leren je alle handige functies: van normale verdelingen berekenen tot regressieanalyses uitvoeren.' }],
      [{ text: 'We geven bijles wiskunde A aan ' }, { text: 'havo', to: '/bijles-havo' }, { text: ' en ' }, { text: 'vwo', to: '/bijles-vwo' }, { text: ' leerlingen. Bekijk ' }, { text: 'hoe het werkt', to: '/zo-werkt-het' }, { text: ' en onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: '. De bijles is ' }, { text: 'aan huis', to: '/bijles-aan-huis' }, { text: ' in Groningen - we starten met een gratis proefles.' }],
    ],
  },
  {
    slug: 'wiskunde-b-groningen',
    title: 'Bijles Wiskunde B in Groningen',
    kicker: 'Van abstract naar begrijpelijk',
    intro:
      'Differentiëren, integreren, complexe functies - wiskunde B is pittig. Onze bèta-studenten maken het begrijpelijk en bereiden je voor op je examen én je vervolgstudie.',
    seoTitle: 'Wiskunde B onder de knie',
    seoDescription:
      'Bijles wiskunde B in Groningen van RUG-studenten. Differentiëren, integreren, goniometrie - wij maken het begrijpelijk. ✓ Gratis proefles ✓ Aan huis',
    image: '/img/bord.webp',
    imageAlt: 'Docent werkt een wiskunde B-opgave uit op het bord',
    seoParagraphs: [
      [{ text: 'Wiskunde B is het technische profiel. Differentiëren, integreren, limieten, complexe functies - het is abstract en veeleisend. Bij Bijles Bèta krijg je bijles wiskunde B van studenten die deze stof dagelijks gebruiken in hun eigen studie aan de RUG.' }],
      [{ text: 'Onze docenten beginnen bij het concept. Wat ís een afgeleide eigenlijk? Waarom werkt integreren zo? Als je dat snapt, worden de rekenregels vanzelf logisch. Geen trucjes, maar echt begrip.' }],
      [{ text: 'Naast analyse helpen we je ook met goniometrie, vectoren en analytische meetkunde. Of je nu op de ' }, { text: 'havo', to: '/bijles-havo' }, { text: ' of het ' }, { text: 'vwo', to: '/bijles-vwo' }, { text: ' zit - onze aanpak past zich aan jouw niveau aan.' }],
      [{ text: 'Ga je een technische studie doen? Dan is een goede basis in wiskunde B essentieel. Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' en start met een gratis proefles. We komen ' }, { text: 'bij je thuis', to: '/bijles-aan-huis' }, { text: ' in Groningen.' }],
    ],
  },
  {
    slug: 'natuurkunde-groningen',
    title: 'Bijles Natuurkunde in Groningen',
    kicker: 'Natuurkunde logisch gemaakt',
    intro:
      'Van mechanica tot elektriciteit: natuurkunde wordt logisch als je het concept snapt. Onze docenten leggen eerst uit waarom iets werkt - daarna worden de formules vanzelf helder.',
    seoTitle: 'Eerst snappen, dan rekenen',
    seoDescription:
      'Bijles natuurkunde in Groningen door RUG-studenten. Van mechanica tot elektriciteit - wij maken het logisch. ✓ Gratis proefles ✓ Aan huis ✓ Alle niveaus',
    image: '/img/natuurkunde.webp',
    imageAlt: 'Bijles natuurkunde in Groningen',
    seoParagraphs: [
      [{ text: 'Zoek je bijles natuurkunde in Groningen? Natuurkunde is overal om je heen, maar het vak kan behoorlijk abstract zijn. Formules, eenheden, berekeningen - bij Bijles Bèta maken we het weer logisch.' }],
      [{ text: 'Onze docenten zijn natuurkunde- en techniekstudenten aan de Rijksuniversiteit Groningen. Ze leggen eerst het concept uit: waarom werkt iets zo? Wat gebeurt er eigenlijk? Pas als je dat snapt, gaan we rekenen. Dan worden die formules opeens logisch.' }],
      [{ text: 'Of je nu vastloopt bij mechanica, elektriciteit, golven of kernfysica - wij helpen je verder. We werken met jouw lesboek en methode, of je nu op het ' }, { text: 'vmbo', to: '/bijles-vmbo' }, { text: ', de ' }, { text: 'havo', to: '/bijles-havo' }, { text: ' of het ' }, { text: 'vwo', to: '/bijles-vwo' }, { text: ' zit.' }],
      [{ text: 'Onze bijles natuurkunde is ' }, { text: 'aan huis', to: '/bijles-aan-huis' }, { text: ' in Groningen en omgeving. Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' en start met een gratis proefles.' }],
    ],
  },
  {
    slug: 'scheikunde-groningen',
    title: 'Scheikunde Bijles Groningen',
    kicker: 'Van formules naar begrip',
    intro:
      'Mol rekenen, reactievergelijkingen, organische chemie - scheikunde vraagt om een systematische aanpak. Onze docenten bouwen stap voor stap aan jouw begrip.',
    seoTitle: 'Scheikunde stap voor stap',
    seoDescription:
      'Bijles scheikunde in Groningen door RUG-studenten. Mol rekenen, BINAS, organische chemie - wij helpen je verder. ✓ Gratis proefles ✓ Aan huis',
    image: '/img/lab.webp',
    imageAlt: 'Bijles scheikunde in Groningen',
    seoParagraphs: [
      [{ text: 'Zoek je bijles scheikunde in Groningen? Scheikunde is het vak van moleculen, reacties en berekeningen. Mol rekenen, reactievergelijkingen balanceren, organische structuren - er komt veel bij kijken. Bij Bijles Bèta krijg je begeleiding van studenten die het vak zelf studeren aan de RUG.' }],
      [{ text: 'Het beruchte mol rekenen is voor veel leerlingen een struikelblok. Onze docenten hebben een duidelijke aanpak: we beginnen bij de basis en bouwen stap voor stap op. Met veel oefening en herhaling, want scheikunde leer je door te doen.' }],
      [{ text: 'De BINAS is je beste vriend bij scheikunde - als je weet hoe je hem moet gebruiken. Onze docenten leren je niet alleen de stof, maar ook hoe je efficiënt met je tabellenboek werkt. Of het nu gaat om zuur-base reacties, redox of organische chemie.' }],
      [{ text: 'We geven bijles scheikunde aan ' }, { text: 'vmbo', to: '/bijles-vmbo' }, { text: ', ' }, { text: 'havo', to: '/bijles-havo' }, { text: ' en ' }, { text: 'vwo', to: '/bijles-vwo' }, { text: ' leerlingen. De bijles is ' }, { text: 'aan huis', to: '/bijles-aan-huis' }, { text: ' in Groningen. Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' en start met een gratis proefles.' }],
    ],
  },
  {
    slug: 'vmbo',
    title: 'Bijles voor VMBO in Groningen',
    kicker: 'Aangepast aan jouw niveau',
    intro:
      'Op het vmbo kunnen bèta vakken pittig zijn. Onze docenten kennen de methodes, begrijpen het tempo en leggen de stof toegankelijk uit - aangepast aan jouw niveau.',
    seoTitle: "Bèta bijles voor vmbo'ers",
    seoDescription:
      'Bijles voor vmbo leerlingen in Groningen. Wiskunde, natuurkunde en scheikunde - aangepast aan jouw niveau. ✓ Gratis proefles ✓ Aan huis',
    image: '/img/studenten.webp',
    imageAlt: 'Leerlingen aan tafel tijdens de bijles',
    seoParagraphs: [
      [{ text: 'Zoek je bijles vmbo in Groningen? Op het vmbo kunnen ' }, { text: 'wiskunde', to: '/bijles-wiskunde-groningen' }, { text: ', ' }, { text: 'natuurkunde', to: '/bijles-natuurkunde-groningen' }, { text: ' en ' }, { text: 'scheikunde', to: '/bijles-scheikunde-groningen' }, { text: ' pittige vakken zijn. De stof gaat snel en er wordt veel van je verwacht. Soms is wat extra uitleg precies wat je nodig hebt.' }],
      [{ text: 'Bij Bijles Bèta hebben we docenten die ervaring hebben met vmbo-leerlingen. Ze kennen de methodes, begrijpen het tempo en weten hoe ze de stof op een toegankelijke manier kunnen uitleggen.' }],
      [{ text: 'Vmbo basis, kader, gemengd of theoretisch - het maakt niet uit welke leerweg je volgt. Onze docenten passen de bijles aan op jouw niveau. We werken met jouw boeken en sluiten aan bij wat je op school leert. Geen ingewikkelde universitaire uitleg, maar praktische hulp die werkt.' }],
      [{ text: 'In een klas van 25 leerlingen is er niet altijd tijd voor persoonlijke aandacht. Bij bijles wel. Je docent heeft alle tijd om jouw vragen te beantwoorden en net zo lang uit te leggen tot je het snapt. De bijles is ' }, { text: 'aan huis', to: '/bijles-aan-huis-groningen' }, { text: ' in Groningen, op een moment dat jou uitkomt.' }],
      [{ text: 'Benieuwd of bijles vmbo iets voor jou is? Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' en start met een gratis proefles.' }],
    ],
  },
  {
    slug: 'havo',
    title: 'Bijles voor HAVO in Groningen',
    kicker: 'Van bovenbouw tot examenklas',
    intro:
      'De havo is een stevige opleiding. Van de overstap naar de bovenbouw tot je eindexamen - onze docenten kennen de uitdagingen en helpen je erdoorheen.',
    seoTitle: 'Havo bijles die werkt',
    seoDescription:
      'Bijles voor havo leerlingen in Groningen. Van 4 havo tot examenklas - onze RUG-studenten helpen je met wiskunde, natuurkunde en scheikunde. ✓ Gratis proefles',
    image: '/img/persoonlijk.webp',
    imageAlt: 'Docent legt de stof uit tijdens de bijles havo',
    seoParagraphs: [
      [{ text: 'Zoek je bijles havo in Groningen? De havo is een stevige opleiding. De bèta vakken vragen veel van je: abstracte concepten, complexe berekeningen en een flinke dosis doorzettingsvermogen. Soms heb je daar wat hulp bij nodig.' }],
      [{ text: 'Onze docenten kennen de havo goed. Veel van hen hebben zelf havo of vwo gedaan voordat ze aan de universiteit gingen studeren. Ze weten precies waar de uitdagingen liggen bij ' }, { text: 'wiskunde', to: '/bijles-wiskunde-groningen' }, { text: ', ' }, { text: 'natuurkunde', to: '/bijles-natuurkunde-groningen' }, { text: ' en ' }, { text: 'scheikunde', to: '/bijles-scheikunde-groningen' }, { text: '.' }],
      [{ text: 'De overstap naar de bovenbouw is groot. Opeens wordt er veel meer van je verwacht. ' }, { text: 'Wiskunde A', to: '/bijles-wiskunde-a-groningen' }, { text: ' of ' }, { text: 'wiskunde B', to: '/bijles-wiskunde-b-groningen' }, { text: ', natuurkunde, scheikunde - de stof wordt abstracter en de toetsen zwaarder. Wij helpen je door deze jaren heen. Met gerichte bijles bouwen we aan een stevige basis.' }],
      [{ text: 'Zit je in je examenjaar? Bekijk dan ook onze ' }, { text: 'examentraining', to: '/examentraining-groningen' }, { text: '. De bijles havo is ' }, { text: 'aan huis', to: '/bijles-aan-huis-groningen' }, { text: ' in Groningen. Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' en start met een gratis proefles.' }],
    ],
  },
  {
    slug: 'vwo',
    title: 'Bijles voor VWO in Groningen',
    kicker: 'Uitdagende stof, begrijpelijk uitgelegd',
    intro:
      'Het vwo vraagt veel van je. De stof is abstract, het tempo hoog. Onze docenten studeren zelf bèta aan de RUG en maken de pittigste onderwerpen begrijpelijk.',
    seoTitle: 'VWO bijles van experts',
    seoDescription:
      'Bijles voor vwo leerlingen in Groningen. Wiskunde B, natuurkunde, scheikunde - onze RUG-studenten maken het begrijpelijk. ✓ Gratis proefles ✓ Aan huis',
    image: '/img/uitleg-b.webp',
    imageAlt: 'Docent legt de stof uit tijdens de bijles vwo',
    seoParagraphs: [
      [{ text: 'Zoek je bijles vwo in Groningen? Het vwo vraagt veel van je. De bèta vakken zijn abstract, de stof gaat diep en het tempo ligt hoog. Zelfs als je slim bent, kan het een uitdaging zijn om alles bij te houden.' }],
      [{ text: 'Onze docenten begrijpen dat als geen ander. Ze studeren zelf bèta aan de Rijksuniversiteit Groningen en hebben het vwo succesvol afgerond. Ze weten wat er van je wordt verwacht bij ' }, { text: 'wiskunde', to: '/bijles-wiskunde-groningen' }, { text: ', ' }, { text: 'natuurkunde', to: '/bijles-natuurkunde-groningen' }, { text: ' en ' }, { text: 'scheikunde', to: '/bijles-scheikunde-groningen' }, { text: '.' }],
      [{ text: 'Wiskunde B', to: '/bijles-wiskunde-b-groningen' }, { text: ' met integralen en differentiëren. Natuurkunde met relativiteit en kwantummechanica. Scheikunde met complexe organische reacties. De stof op vwo-niveau is pittig. Onze docenten zijn gewend om deze onderwerpen uit te leggen - ze kunnen het abstract maken concreet.' }],
      [{ text: 'Zit je in vwo 5 of 6? Bekijk dan ook onze ' }, { text: 'examentraining', to: '/examentraining-groningen' }, { text: ' voor gerichte examenvoorbereiding. De bijles vwo is ' }, { text: 'aan huis', to: '/bijles-aan-huis-groningen' }, { text: ' in Groningen. Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' en start met een gratis proefles.' }],
    ],
  },
  {
    slug: 'aan-huis',
    title: 'Bijles aan huis',
    metaTitle: 'Bijles aan Huis in Groningen - Bijles Bèta',
    kicker: 'Wij komen naar jou toe',
    intro:
      'Geen reistijd, geen gedoe. Onze docenten komen bij jou thuis in Groningen en omgeving. In je eigen vertrouwde omgeving leer je het beste.',
    seoTitle: 'Leren in je eigen omgeving',
    // The source page never had a meta description set — write one before shipping.
    seoDescription: '',
    image: '/img/fiets.webp',
    imageAlt: 'Docent op de fiets onderweg naar de bijles aan huis',
    seoParagraphs: [
      [{ text: 'Zoek je bijles aan huis in Groningen? Bij Bijles Bèta komen onze docenten naar jou toe. Geen reistijd naar een bijlesinstituut, geen wachten in een overvolle studiezaal. Gewoon thuis, aan je eigen bureau, met al je boeken binnen handbereik.' }],
      [{ text: 'Onze docenten geven bijles in ' }, { text: 'wiskunde', to: '/bijles-wiskunde-groningen' }, { text: ', ' }, { text: 'natuurkunde', to: '/bijles-natuurkunde-groningen' }, { text: ' en ' }, { text: 'scheikunde', to: '/bijles-scheikunde-groningen' }, { text: '. Ze zijn allemaal studenten aan de Rijksuniversiteit Groningen en komen uit de regio. Of je nu in het centrum woont, in Helpman, Paddepoel of een dorp in de omgeving - wij komen naar je toe.' }],
      [{ text: 'Waarom bijles aan huis werkt? Je bent ontspannen in je eigen omgeving. Geen stress van een onbekende locatie. Je ouders kunnen eventueel meekijken hoe het gaat. En na de les kun je direct verder met je huiswerk - de docent heeft je net uitgelegd hoe het moet.' }],
      [{ text: 'Bijles aan huis is beschikbaar voor ' }, { text: 'vmbo', to: '/bijles-vmbo' }, { text: ', ' }, { text: 'havo', to: '/bijles-havo' }, { text: ' en ' }, { text: 'vwo', to: '/bijles-vwo' }, { text: ' leerlingen. Of je nu ' }, { text: 'wiskunde A', to: '/bijles-wiskunde-a-groningen' }, { text: ', ' }, { text: 'wiskunde B', to: '/bijles-wiskunde-b-groningen' }, { text: ' of een ander bèta vak volgt - wij hebben een passende docent.' }],
      [{ text: 'Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' of lees ' }, { text: 'hoe het werkt', to: '/zo-werkt-het' }, { text: '. We starten met een gratis proefles – vrijblijvend en zonder opzegtermijn.' }],
    ],
  },
  {
    slug: 'aan-huis-groningen',
    title: 'Bijles aan Huis in Groningen',
    kicker: 'Wij komen naar jou toe',
    intro:
      'Geen reistijd, geen gedoe. Onze docenten komen bij jou thuis in Groningen en omgeving. In je eigen vertrouwde omgeving leer je het beste.',
    seoTitle: 'Leren in je eigen omgeving',
    seoDescription:
      'Bijles aan huis in Groningen en omgeving. Onze RUG-studenten komen naar jou toe voor wiskunde, natuurkunde en scheikunde. ✓ Gratis proefles ✓ Geen reistijd',
    image: '/img/map.svg',
    imageAlt: 'Bijles aan huis in heel Groningen',
    seoParagraphs: [
      [{ text: 'Zoek je bijles aan huis in Groningen? Bij Bijles Bèta komen onze docenten naar jou toe. Geen reistijd naar een bijlesinstituut, geen wachten in een overvolle studiezaal. Gewoon thuis, aan je eigen bureau, met al je boeken binnen handbereik.' }],
      [{ text: 'Onze docenten geven bijles in ' }, { text: 'wiskunde', to: '/bijles-wiskunde-groningen' }, { text: ', ' }, { text: 'natuurkunde', to: '/bijles-natuurkunde-groningen' }, { text: ' en ' }, { text: 'scheikunde', to: '/bijles-scheikunde-groningen' }, { text: '. Ze zijn allemaal studenten aan de Rijksuniversiteit Groningen en komen uit de regio. Of je nu in het centrum woont, in Helpman, Paddepoel of een dorp in de omgeving - wij komen naar je toe.' }],
      [{ text: 'Waarom bijles aan huis werkt? Je bent ontspannen in je eigen omgeving. Geen stress van een onbekende locatie. Je ouders kunnen eventueel meekijken hoe het gaat. En na de les kun je direct verder met je huiswerk - de docent heeft je net uitgelegd hoe het moet.' }],
      [{ text: 'Bijles aan huis is beschikbaar voor ' }, { text: 'vmbo', to: '/bijles-vmbo' }, { text: ', ' }, { text: 'havo', to: '/bijles-havo' }, { text: ' en ' }, { text: 'vwo', to: '/bijles-vwo' }, { text: ' leerlingen. Of je nu ' }, { text: 'wiskunde A', to: '/bijles-wiskunde-a-groningen' }, { text: ', ' }, { text: 'wiskunde B', to: '/bijles-wiskunde-b-groningen' }, { text: ' of een ander bèta vak volgt - wij hebben een passende docent.' }],
      [{ text: 'Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' of lees ' }, { text: 'hoe het werkt', to: '/zo-werkt-het' }, { text: '. We starten met een gratis proefles – vrijblijvend en zonder opzegtermijn.' }],
    ],
  },
  {
    slug: 'aan-huis-utrecht',
    title: 'Bijles aan huis Utrecht',
    metaTitle: 'Bijles wiskunde, natuurkunde en scheikunde in Utrecht | Bijles Bèta',
    kicker: 'Geen reistijd, geen gedoe.',
    // The source page's hero intro was left as generic placeholder copy
    // (identical to the abandoned draft stub pages) — write a real one
    // before shipping, ideally naming Utrecht specifically.
    intro:
      'We willen de leerling aanmoedigen om met regelmaat bijles te nemen. Juist met regelmaat krijg je waar voor je geld, dat werkt efficiënt.',
    seoTitle: 'Bijles aan huis in Utrecht',
    seoDescription:
      'Bijles aan huis in Utrecht voor wiskunde, natuurkunde en scheikunde. Ervaren bètastudenten aan huis, wekelijks op een vast moment. Plan nu een proefles!',
    image: '/img/fiets.webp',
    imageAlt: 'Docent op de fiets onderweg naar de bijles aan huis in Utrecht',
    seoParagraphs: [
      [{ text: 'Zoek je bijles aan huis in Utrecht? Bij Bijles Bèta komen onze docenten naar jou toe. Geen reistijd naar een bijlesinstituut, geen wachten in een overvolle studiezaal. Gewoon thuis, aan je eigen bureau, met al je boeken binnen handbereik.' }],
      [{ text: 'Waarom bijles aan huis werkt? Je bent ontspannen in je eigen omgeving. Geen stress van een onbekende locatie. Je ouders kunnen eventueel meekijken hoe het gaat. En na de les kun je direct verder met je huiswerk - de docent heeft je net uitgelegd hoe het moet.' }],
      [{ text: 'Bijles aan huis is beschikbaar voor ' }, { text: 'vmbo', to: '/bijles-vmbo' }, { text: ', ' }, { text: 'havo', to: '/bijles-havo' }, { text: ' en ' }, { text: 'vwo', to: '/bijles-vwo' }, { text: ' leerlingen. Of je nu ' }, { text: 'wiskunde A', to: '/bijles-wiskunde-a-groningen' }, { text: ', ' }, { text: 'wiskunde B', to: '/bijles-wiskunde-b-groningen' }, { text: ' of een ander bèta vak volgt - wij hebben een passende docent.' }],
      [{ text: 'Bekijk onze ' }, { text: 'tarieven', to: '/tarieven' }, { text: ' of lees ' }, { text: 'hoe het werkt', to: '/zo-werkt-het' }, { text: '. We starten met een gratis proefles!' }],
    ],
  },
]

/** Look up a landing page by its route slug; `undefined` when unknown. */
export function findLanding(slug: string) {
  return landings.find((item) => item.slug === slug)
}

/** The promises under the landing hero — shorter than the homepage's three. */
export const landingPromises = [
  '22+ bijles-docenten beschikbaar',
  'Kwalitatieve bijles',
  'Efficiënt en doelgericht',
] as const

export const landingHeroForm = {
  kicker: 'Gratis proefles?',
  title: 'Claim je eerste gratis proefles.',
  body: 'Zet de eerste stap in de investering voor jezelf, of je kind. De eerste proefles is altijd 100% gratis!',
} as const

/** The "Easy as 1,2,3…" band. */
export const landingSteps = {
  kicker: 'Onze werkwijze',
  title: 'Easy as 1,2,3…',
  items: [
    {
      label: 'Stap 1.',
      title: 'Proefles',
      body: 'Leer je docent kennen en maak samen een plan voor de bijles.',
      image: '/img/proefles.webp',
      alt: 'Twee leerlingen werken samen tijdens de proefles',
    },
    {
      label: 'Stap 2.',
      title: 'Kies het juiste pakket',
      body: 'Bepaal samen met je docent hoeveel bijlessen je nodig hebt en kies het juiste pakket.',
      image: '/img/bord.webp',
      alt: 'Docent werkt een natuurkundeopgave uit op het bord',
    },
    {
      label: 'Stap 3.',
      title: 'Wordt een Bèta pro',
      body: 'Ontdek hoe de bijles jou laat zien hoe leuk de bèta vakken eigenlijk zijn.',
      image: '/img/fiets.webp',
      alt: 'Docent op de fiets onderweg naar de bijles',
    },
  ],
} as const

/** The route for a landing page, e.g. `/bijles-wiskunde-groningen`. */
export function landingPath(slug: string) {
  return `/bijles-${slug}`
}
