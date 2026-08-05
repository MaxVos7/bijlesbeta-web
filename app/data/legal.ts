/**
 * Legal documents: algemene voorwaarden and privacyverklaring.
 *
 * Copy lives here rather than in the templates, like the rest of the site's
 * content (see `site.ts`). The text is the current bijlesbeta.nl wording,
 * unchanged — it is a legal document, so it is stored verbatim.
 *
 * A clause is a small structured object rather than a string with markup, so a
 * page can render bold lead-ins and inline links without `v-html`:
 *
 *   { lead: 'Bijles Bèta:', text: 'Bijles Bèta V.O.F., …' }
 *   { text: 'Het volledige privacybeleid is te raadplegen op ',
 *     link: { label: 'bijlesbeta.nl/privacy', href: '/privacy' }, after: '.' }
 */

export type LegalItem = {
  /** Set in bold in front of `text`, e.g. a defined term. */
  lead?: string
  text?: string
  /** Rendered directly after `text`. */
  link?: { label: string; href: string }
  /** Rendered directly after `link` — usually the closing punctuation. */
  after?: string
}

export type LegalBlock =
  /** A paragraph. Uses the first item only. */
  | { kind: 'p'; items: LegalItem[] }
  /** A subheading inside a section. Uses the first item only. */
  | { kind: 'h3'; items: LegalItem[] }
  /** The numbered clauses of an article. */
  | { kind: 'ol'; items: LegalItem[] }
  /** An unnumbered list. */
  | { kind: 'ul'; items: LegalItem[] }

export type LegalSection = { title: string; blocks: LegalBlock[] }

export type LegalDocument = {
  title: string
  /** Sits under the title, in the hero. */
  meta: string
  /** Search-engine description. */
  description: string
  intro?: LegalBlock[]
  sections: LegalSection[]
  /** The closing contact panel. Address and details come from `site.ts`. */
  contact: { title: string; body?: string }
}

const ol = (items: LegalItem[]): LegalBlock => ({ kind: 'ol', items })
const ul = (items: LegalItem[]): LegalBlock => ({ kind: 'ul', items })
const p = (text: string): LegalBlock => ({ kind: 'p', items: [{ text }] })
const h3 = (text: string): LegalBlock => ({ kind: 'h3', items: [{ text }] })

export const terms: LegalDocument = {
  title: 'Algemene voorwaarden',
  meta: 'Per 1 september 2018 — Laatste update: december 2025',
  description:
    'De algemene voorwaarden van Bijles Bèta: pakketten, losse lessen, annulering, betaling, tarieven en aansprakelijkheid.',
  sections: [
    {
      title: 'Definities',
      blocks: [
        ol([
          {
            lead: 'Bijles Bèta:',
            text: 'Bijles Bèta V.O.F., ingeschreven bij de Kamer van Koophandel onder nummer 70706158, gevestigd aan De Brink 34, 9723AM te Groningen.',
          },
          {
            lead: 'Dienst:',
            text: 'Bemiddeling voor de bijles, de bijles zelf en bijbehorende administratieve handelingen.',
          },
          {
            lead: 'Leerling:',
            text: 'Iedere natuurlijke persoon die op grond van een overeenkomst gebruikmaakt van de diensten van Bijles Bèta.',
          },
          {
            lead: 'Opdrachtgever:',
            text: 'De persoon die de opdracht geeft aan Bijles Bèta voor het verstrekken van een dienst (vaak ouder/verzorger).',
          },
          {
            lead: 'Bijlesgever:',
            text: 'De persoon die de dienst namens of in opdracht van Bijles Bèta verricht.',
          },
        ]),
      ],
    },
    {
      title: 'Algemeen',
      blocks: [
        ol([
          {
            text: 'Deze algemene voorwaarden zijn van toepassing op iedere aanbieding, offerte of overeenkomst tussen Bijles Bèta en een opdrachtgever waarop Bijles Bèta deze algemene voorwaarden van toepassing heeft verklaard.',
          },
          {
            text: 'Onder "schriftelijk" wordt mede verstaan elektronische communicatie via e-mail.',
          },
          {
            text: 'Afwijkingen van deze voorwaarden zijn alleen geldig indien deze schriftelijk zijn overeengekomen.',
          },
        ]),
      ],
    },
    {
      title: 'Overeenkomst',
      blocks: [
        ol([
          { text: 'Alle overeenkomsten zijn voor onbepaalde tijd, tenzij anders vermeld.' },
          {
            text: 'Opzegging van de overeenkomst is op ieder moment mogelijk met inachtneming van reeds geplande en bevestigde bijlessen.',
          },
          {
            text: 'Bijles Bèta heeft het recht bepaalde werkzaamheden door derden te laten uitvoeren.',
          },
          {
            text: 'Indien werkzaamheden plaatsvinden op locatie van de opdrachtgever, zorgt deze kosteloos voor de in redelijkheid gewenste faciliteiten.',
          },
          {
            text: 'De opdrachtgever is verantwoordelijk voor het tijdig verstrekken van juiste informatie die nodig is voor een goede uitvoering van de opdracht.',
          },
          { text: 'De bijlesgever voert zijn werkzaamheden naar beste inzicht en vermogen uit.' },
          {
            text: 'Bijles Bèta is op geen enkele wijze verantwoordelijk voor de behaalde resultaten op examens of toetsen.',
          },
        ]),
      ],
    },
    {
      title: 'Herroepingsrecht',
      blocks: [
        ol([
          {
            text: 'De opdrachtgever heeft het recht om binnen 14 dagen na het sluiten van de overeenkomst, zonder opgave van redenen, de overeenkomst te herroepen.',
          },
          {
            text: 'Om het herroepingsrecht uit te oefenen, stuurt de opdrachtgever een ondubbelzinnige verklaring naar info@bijlesbeta.nl of via WhatsApp naar 06 38 26 06 23.',
          },
          {
            text: 'Indien de opdrachtgever het herroepingsrecht uitoefent nadat de dienstverlening reeds is aangevangen, is de opdrachtgever een bedrag verschuldigd dat evenredig is aan het deel van de overeenkomst dat op het moment van herroeping reeds is uitgevoerd.',
          },
          {
            text: 'Indien de opdrachtgever verzoekt om directe aanvang van de dienstverlening binnen de herroepingstermijn en expliciet afstand doet van het herroepingsrecht na volledige nakoming, vervalt het herroepingsrecht zodra de dienst volledig is uitgevoerd.',
          },
        ]),
      ],
    },
    {
      title: 'Pakketten, Losse Lessen en Proefles',
      blocks: [
        ol([
          {
            text: 'De opdrachtgever kan kiezen tussen pakketten (een vast aantal bijlesuren per maand) of losse lessen (bijlesuren zonder maandelijkse afname).',
          },
          {
            text: 'Pakketten kunnen maandelijks worden aangepast of opgezegd, met inachtneming van een opzegtermijn van 14 dagen vóór de nieuwe maand.',
          },
          {
            text: 'Opzegging of aanpassing van een pakket kan via het administratiesysteem op mijn.bijlesbeta.nl, telefonisch of via WhatsApp.',
          },
          {
            text: 'Indien de opzegging of aanpassing telefonisch of via WhatsApp wordt gedaan, bevestigt Bijles Bèta deze binnen 3 werkdagen. Bij opzegging via mijn.bijlesbeta.nl is een bevestiging niet nodig.',
          },
          {
            text: 'Niet-gebruikte uren binnen een pakket worden eenmalig en kosteloos doorgeschoven naar de eerstvolgende maand, mits de uren van het nieuwe pakket van die maand zijn verbruikt. Uren die na deze extra maand niet zijn gebruikt, komen te vervallen zonder recht op restitutie.',
          },
          {
            text: 'Losse lessen worden per les of per reeks lessen afgerekend en vallen niet onder de pakketvoorwaarden.',
          },
          {
            text: 'Een proefles is gratis en vrijblijvend voor leerlingen met de intentie om daarna regelmatig bijlessen af te nemen.',
          },
          { text: 'Bijles Bèta brengt geen inschrijf- of bemiddelingskosten in rekening.' },
        ]),
      ],
    },
    {
      title: 'Locatie van Bijles',
      blocks: [
        ol([
          {
            text: 'De locatie van de bijles wordt in overleg met de bijlesgever bepaald. Mogelijke locaties zijn: bij de leerling thuis, online, op een centrale locatie of op de middelbare school van de leerling.',
          },
        ]),
      ],
    },
    {
      title: 'Annulering van Bijlessen',
      blocks: [
        ol([
          {
            text: 'Een bijles dient minimaal 24 uur van tevoren geannuleerd te worden. Bij annulering binnen 24 uur worden de kosten volledig in rekening gebracht. Dit geldt zowel voor pakketuren als losse lessen.',
          },
          {
            text: 'Bij de eerste annulering binnen 24 uur kan Bijles Bèta, naar eigen inzicht en afhankelijk van de omstandigheden, besluiten om coulance te verlenen.',
          },
          {
            text: 'Uitzonderingen worden gemaakt in geval van overmacht, zoals aantoonbare ziekte of onvoorziene familieomstandigheden. De opdrachtgever dient dit zo spoedig mogelijk te melden.',
          },
        ]),
      ],
    },
    {
      title: 'Betaling',
      blocks: [
        ol([
          {
            text: 'Pakketten worden maandelijks achteraf gefactureerd, aan het einde van de maand waarin het pakket is afgenomen. Losse lessen worden gefactureerd na afname.',
          },
          {
            text: 'Indien de opdrachtgever halverwege de maand start met een pakket, worden de kosten pro rata berekend.',
          },
          { text: 'Facturen dienen binnen 14 dagen na factuurdatum te worden voldaan.' },
          { text: 'Betaling kan uitsluitend geschieden via iDEAL of bankoverschrijving.' },
          {
            text: 'Indien de opdrachtgever niet binnen de gestelde termijn betaalt, ontvangt deze een kosteloze betalingsherinnering met een betalingstermijn van 14 dagen na ontvangst van deze herinnering.',
          },
          {
            text: 'Indien betaling na de betalingsherinnering uitblijft, is de opdrachtgever van rechtswege in verzuim en zijn de wettelijke incassokosten verschuldigd conform het Besluit vergoeding voor buitengerechtelijke incassokosten (WIK), alsmede de wettelijke rente ex artikel 6:119 BW.',
          },
        ]),
      ],
    },
    {
      title: 'Tarieven',
      blocks: [
        ol([
          { text: 'De actuele tarieven staan vermeld op de website van Bijles Bèta.' },
          {
            text: 'Tariefwijzigingen worden minimaal 30 dagen van tevoren aangekondigd aan de opdrachtgever. Bij tariefwijzigingen heeft de opdrachtgever het recht de overeenkomst binnen 14 dagen na aankondiging kosteloos te ontbinden.',
          },
        ]),
      ],
    },
    {
      title: 'Privacy en Gegevensbescherming',
      blocks: [
        ol([
          {
            text: 'Bijles Bèta verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).',
          },
          {
            text: 'Het volledige privacybeleid is te raadplegen op ',
            link: { label: 'bijlesbeta.nl/privacy', href: '/privacy' },
            after: '.',
          },
        ]),
      ],
    },
    {
      title: 'Gedragsregels en Verwachtingen',
      blocks: [
        ol([
          { text: 'Leerlingen worden verwacht op tijd aanwezig te zijn.' },
          {
            text: 'Bij online bijlessen dient de leerling te zorgen voor een stabiele internetverbinding en een rustige leeromgeving.',
          },
          { text: 'Bijlesgevers dienen professioneel te handelen en op tijd aanwezig te zijn.' },
        ]),
      ],
    },
    {
      title: 'Overmacht',
      blocks: [
        ol([
          {
            text: 'In geval van onvoorziene omstandigheden (zoals technische storingen, extreme weersomstandigheden, ziekte of familieomstandigheden) behoudt Bijles Bèta zich het recht voor om bijlessen te verplaatsen zonder extra kosten.',
          },
        ]),
      ],
    },
    {
      title: 'Aansprakelijkheid',
      blocks: [
        ol([
          {
            text: 'De aansprakelijkheid van Bijles Bèta is beperkt tot directe schade en bedraagt nimmer meer dan het bedrag dat in het desbetreffende geval onder de aansprakelijkheidsverzekering van Bijles Bèta wordt uitgekeerd.',
          },
          {
            text: 'Bij gebreke van uitkering door de verzekeraar is de aansprakelijkheid beperkt tot maximaal het factuurbedrag van de betreffende dienst over de laatste drie maanden.',
          },
          {
            text: 'De in dit artikel opgenomen beperkingen gelden niet voor schade veroorzaakt door opzet of grove schuld van Bijles Bèta.',
          },
          {
            text: 'Bijles Bèta is niet aansprakelijk voor schade ontstaan doordat Bijles Bèta is uitgegaan van door of namens de opdrachtgever verstrekte onjuiste of onvolledige gegevens.',
          },
        ]),
      ],
    },
    {
      title: 'Wijziging van Voorwaarden',
      blocks: [
        ol([
          { text: 'Bijles Bèta behoudt zich het recht voor deze algemene voorwaarden te wijzigen.' },
          {
            text: 'Wijzigingen worden minimaal 30 dagen voor inwerkingtreding per e-mail aangekondigd.',
          },
          {
            text: 'Bij wijzigingen die de kern van de prestatie of de prijs betreffen, heeft de opdrachtgever het recht de overeenkomst binnen 14 dagen na aankondiging kosteloos te ontbinden.',
          },
        ]),
      ],
    },
    {
      title: 'Klachtenprocedure',
      blocks: [
        ol([
          {
            text: 'Klachten over de uitvoering van de overeenkomst dienen binnen 14 dagen na constatering schriftelijk aan Bijles Bèta te worden gemeld via info@bijlesbeta.nl of 06 38 26 06 23.',
          },
          {
            text: 'Bijles Bèta zal de klacht binnen 5 werkdagen inhoudelijk behandelen en zo spoedig mogelijk afhandelen.',
          },
        ]),
      ],
    },
    {
      title: 'Toepasselijk Recht en Geschillen',
      blocks: [
        ol([
          {
            text: 'Op alle overeenkomsten tussen Bijles Bèta en de opdrachtgever is Nederlands recht van toepassing.',
          },
          { text: 'Geschillen worden in eerste instantie in overleg geprobeerd op te lossen.' },
          {
            text: 'Indien dit niet lukt, wordt het geschil voorgelegd aan de bevoegde rechter. De opdrachtgever heeft het recht te kiezen voor de rechtbank in zijn woonplaats, tenzij de wet dwingend anders voorschrijft.',
          },
        ]),
      ],
    },
    {
      title: 'Intellectuele Eigendom',
      blocks: [
        ol([
          {
            text: 'Alle materialen, opdrachten en documentatie die door de bijlesgever zijn ontwikkeld, blijven eigendom van de bijlesgever of Bijles Bèta.',
          },
          {
            text: 'Deze materialen mogen niet zonder schriftelijke toestemming worden gekopieerd, gedeeld of commercieel gebruikt.',
          },
        ]),
      ],
    },
    {
      title: 'Gebruik van Beeld- en Geluidsmateriaal',
      blocks: [
        ol([
          {
            text: 'Het opnemen van (online) bijlessen is alleen toegestaan met voorafgaande schriftelijke toestemming van Bijles Bèta en de betrokken bijlesgever.',
          },
          {
            text: 'Opnames zijn uitsluitend bedoeld voor persoonlijk gebruik en mogen niet zonder toestemming worden gedeeld of gepubliceerd.',
          },
        ]),
      ],
    },
    {
      title: 'Vertrouwelijkheid',
      blocks: [
        ol([
          {
            text: 'Bijles Bèta, bijlesgevers, en opdrachtgevers zijn verplicht tot geheimhouding van vertrouwelijke informatie die in het kader van de samenwerking wordt verkregen.',
          },
          {
            text: 'Deze verplichting blijft ook van kracht na beëindiging van de overeenkomst.',
          },
        ]),
      ],
    },
    {
      title: 'Verlies of Schade aan Eigendommen',
      blocks: [
        ol([
          {
            text: 'Bijles Bèta is niet aansprakelijk voor verlies, diefstal of schade aan eigendommen van de leerling of opdrachtgever tijdens de bijles, tenzij er sprake is van opzet of grove nalatigheid.',
          },
          {
            text: 'De opdrachtgever is verantwoordelijk voor het beschermen van persoonlijke eigendommen tijdens bijlessen op locatie.',
          },
        ]),
      ],
    },
  ],
  contact: { title: 'Contact' },
}

export const privacy: LegalDocument = {
  title: 'Privacyverklaring',
  meta: 'Laatste update: december 2025',
  description:
    'Hoe Bijles Bèta persoonsgegevens van opdrachtgevers, leerlingen en bijlesgevers verwerkt, bewaart en beschermt, conform de AVG.',
  intro: [
    p(
      'Bijles Bèta V.O.F. (hierna: "Bijles Bèta", "wij" of "ons") hecht veel waarde aan de bescherming van uw persoonsgegevens. In deze privacyverklaring informeren wij u over hoe wij omgaan met persoonsgegevens. Wij houden ons aan de Algemene Verordening Gegevensbescherming (AVG) en overige toepasselijke privacywetgeving.',
    ),
  ],
  sections: [
    {
      title: 'Verwerkingsverantwoordelijke',
      blocks: [p('De verwerkingsverantwoordelijke voor de verwerking van uw persoonsgegevens is:')],
    },
    {
      title: 'Welke persoonsgegevens verzamelen wij',
      blocks: [
        p('Wij verzamelen de volgende categorieën persoonsgegevens:'),
        h3('Gegevens van opdrachtgevers (ouders/verzorgers):'),
        ul([
          { text: 'Voor- en achternaam' },
          { text: 'Adresgegevens' },
          { text: 'Telefoonnummer' },
          { text: 'E-mailadres' },
          { text: 'Bankrekeningnummer (IBAN)' },
          { text: 'Betalingsgegevens en factuurhistorie' },
        ]),
        h3('Gegevens van leerlingen:'),
        ul([
          { text: 'Voor- en achternaam' },
          { text: 'Schoolniveau en klas' },
          { text: 'Vakken waarvoor bijles wordt gevolgd' },
          { text: 'Voortgang en aantekeningen over de bijlessen' },
        ]),
        h3('Gegevens van bijlesgevers:'),
        ul([
          { text: 'Voor- en achternaam' },
          { text: 'Adresgegevens' },
          { text: 'Telefoonnummer en e-mailadres' },
          { text: 'Bankrekeningnummer (IBAN)' },
          { text: 'Studie en studiejaar' },
          { text: 'Kopie identiteitsbewijs' },
          { text: 'Verklaring Omtrent het Gedrag (VOG), indien van toepassing' },
        ]),
      ],
    },
    {
      title: 'Doeleinden en rechtsgronden van verwerking',
      blocks: [
        p('Wij verwerken uw persoonsgegevens voor de volgende doeleinden:'),
        h3('Uitvoering van de overeenkomst (art. 6 lid 1 sub b AVG):'),
        ul([
          { text: 'Het koppelen van leerlingen aan geschikte bijlesgevers' },
          { text: 'Het plannen en administreren van bijlessen' },
          { text: 'Het versturen van facturen en verwerken van betalingen' },
          { text: 'Communicatie over de dienstverlening' },
        ]),
        h3('Wettelijke verplichting (art. 6 lid 1 sub c AVG):'),
        ul([
          { text: 'Het voeren van een financiële administratie' },
          { text: 'Het voldoen aan fiscale verplichtingen' },
        ]),
        h3('Gerechtvaardigd belang (art. 6 lid 1 sub f AVG):'),
        ul([
          { text: 'Het verbeteren van onze dienstverlening' },
          { text: 'Het beveiligen van onze systemen en website' },
        ]),
      ],
    },
    {
      title: 'Ontvangers van persoonsgegevens',
      blocks: [
        p('Wij delen uw persoonsgegevens met de volgende partijen:'),
        ul([
          {
            lead: 'Bijlesgevers:',
            text: 'ontvangen contactgegevens van leerlingen en opdrachtgevers voor het uitvoeren van de bijlessen',
          },
          {
            lead: 'Boekhoudsoftware en facturatieprovider:',
            text: 'voor het verwerken van facturen en betalingen',
          },
          {
            lead: 'Betalingsprovider (iDEAL/bank):',
            text: 'voor het verwerken van betalingen',
          },
          {
            lead: 'Hostingprovider:',
            text: 'voor het hosten van onze website en administratiesysteem',
          },
        ]),
        p(
          'Wij verkopen uw gegevens niet aan derden en delen deze alleen wanneer dit noodzakelijk is voor de uitvoering van de overeenkomst of wanneer wij hiertoe wettelijk verplicht zijn.',
        ),
      ],
    },
    {
      title: 'Doorgifte buiten de Europese Economische Ruimte',
      blocks: [
        p(
          'Wij geven uw persoonsgegevens in beginsel niet door aan landen buiten de Europese Economische Ruimte (EER). Mocht dit in de toekomst noodzakelijk zijn, dan zorgen wij voor passende waarborgen conform de AVG, zoals Standard Contractual Clauses of een adequaatheidsbesluit.',
        ),
      ],
    },
    {
      title: 'Bewaartermijnen',
      blocks: [
        p('Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk:'),
        ul([
          {
            lead: 'Gegevens voor de uitvoering van de overeenkomst:',
            text: 'tot 2 jaar na beëindiging van de dienstverlening',
          },
          {
            lead: 'Financiële administratie en facturen:',
            text: '7 jaar (wettelijke fiscale bewaarplicht)',
          },
          {
            lead: 'Gegevens van bijlesgevers:',
            text: 'tot 2 jaar na beëindiging van de samenwerking',
          },
        ]),
      ],
    },
    {
      title: 'Uw rechten',
      blocks: [
        p('Op grond van de AVG heeft u de volgende rechten:'),
        ul([
          { lead: 'Recht op inzage:', text: 'u kunt opvragen welke gegevens wij van u verwerken' },
          { lead: 'Recht op rectificatie:', text: 'u kunt onjuiste gegevens laten corrigeren' },
          {
            lead: 'Recht op verwijdering:',
            text: 'u kunt verzoeken om verwijdering van uw gegevens',
          },
          {
            lead: 'Recht op beperking:',
            text: 'u kunt verzoeken om beperking van de verwerking',
          },
          {
            lead: 'Recht op dataportabiliteit:',
            text: 'u kunt uw gegevens in een gangbaar format ontvangen',
          },
          {
            lead: 'Recht van bezwaar:',
            text: 'u kunt bezwaar maken tegen verwerking op basis van gerechtvaardigd belang',
          },
        ]),
        {
          kind: 'p',
          items: [
            {
              text: 'U kunt uw verzoek indienen via ',
              link: { label: 'info@bijlesbeta.nl', href: 'mailto:info@bijlesbeta.nl' },
              after: '. Wij reageren binnen 30 dagen op uw verzoek.',
            },
          ],
        },
      ],
    },
    {
      title: 'Minderjarigen',
      blocks: [
        p(
          'Onze dienstverlening is gericht op bijles aan leerlingen, waaronder minderjarigen. De overeenkomst wordt gesloten met de ouder of wettelijk vertegenwoordiger van de leerling. De verwerking van persoonsgegevens van minderjarigen vindt plaats op basis van de overeenkomst met de ouder/verzorger. Voor leerlingen jonger dan 16 jaar verwerken wij alleen gegevens die noodzakelijk zijn voor de uitvoering van de bijlesdiensten.',
        ),
      ],
    },
    {
      title: 'Beveiliging',
      blocks: [
        p(
          'Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, ongeautoriseerde toegang of onrechtmatige verwerking. Onze website en administratiesystemen zijn beveiligd met SSL-encryptie. Toegang tot persoonsgegevens is beperkt tot medewerkers die deze nodig hebben voor hun werkzaamheden.',
        ),
      ],
    },
    {
      title: 'Cookies',
      blocks: [
        p(
          'Onze website maakt gebruik van cookies. Voor meer informatie verwijzen wij naar ons cookiestatement op de website.',
        ),
      ],
    },
    {
      title: 'Klachten',
      blocks: [
        {
          kind: 'p',
          items: [
            {
              text: 'Indien u een klacht heeft over de verwerking van uw persoonsgegevens, kunt u contact met ons opnemen via ',
              link: { label: 'info@bijlesbeta.nl', href: 'mailto:info@bijlesbeta.nl' },
              after: '. Wij zullen uw klacht zo spoedig mogelijk behandelen.',
            },
          ],
        },
        {
          kind: 'p',
          items: [
            {
              text: 'Daarnaast heeft u het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens, de toezichthoudende autoriteit in Nederland. U kunt hiervoor terecht op ',
              link: {
                label: 'autoriteitpersoonsgegevens.nl',
                href: 'https://autoriteitpersoonsgegevens.nl',
              },
              after: '.',
            },
          ],
        },
      ],
    },
    {
      title: 'Wijzigingen in deze privacyverklaring',
      blocks: [
        p(
          'Wij kunnen deze privacyverklaring van tijd tot tijd aanpassen. De meest actuele versie is altijd te vinden op onze website. Bij belangrijke wijzigingen informeren wij u hierover via e-mail of via onze website.',
        ),
      ],
    },
  ],
  contact: {
    title: 'Contact',
    body: 'Heeft u vragen over deze privacyverklaring of over de verwerking van uw persoonsgegevens? Neem dan contact met ons op:',
  },
}

/**
 * Registration details shown in the legal pages' contact panel. The address,
 * phone and e-mail come from `site.ts`; only the statutory name and the KvK
 * number are specific to these documents.
 */
export const company = {
  legalName: 'Bijles Bèta V.O.F.',
  kvk: '70706158',
  /** The mailbox the documents themselves name, not the general contact one. */
  email: 'info@bijlesbeta.nl',
  emailHref: 'mailto:info@bijlesbeta.nl',
  phone: '06 38 26 06 23',
  phoneHref: 'tel:+31638260623',
} as const

/** The PDF offered at the top of the algemene voorwaarden. */
export const termsPdf = {
  label: 'Download de volledige algemene voorwaarden als PDF',
  button: 'Download PDF',
  href: '/downloads/algemene-voorwaarden-bijles-beta.pdf',
} as const
