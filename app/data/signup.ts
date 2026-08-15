/**
 * The aanmeld wizard: sections, fields, options and conditional logic.
 *
 * Ported from the Gravity Form "Aanmeldformulier" that currently runs on
 * bijlesbeta.nl. Field keys are English; the trailing comment on each one is
 * the Gravity Forms field id, so the payload can still be mapped back when
 * Laravel starts receiving these submissions.
 *
 * Which fields are visible is a pure function of the current answers — the
 * same rules Gravity Forms evaluates in its conditional logic.
 */

export type SignupValues = {
  lessonKind: string // 57
  lessonKindNote: string // 96
  weeklyHours: string // 83
  totalHours: string // 95
  availability: string // 93
  location: string // 58
  locationNote: string // 97
  school: string // 98
  schoolYear: string // 37
  level: string // 17
  levelOther: string // 85
  subjects: string[] // 81 / 86 / 47
  subjectOther: string // 50
  studentFirstName: string // 9
  studentPhone: string // 4
  contactMethod: string // 91
  contactFirstName: string // 1.3
  contactLastName: string // 1.6
  email: string // 3
  postalCode: string // 67
  houseNumber: string // 68
  street: string // 69
  city: string // 66
  cityCode: string // 72 — hidden in GF, filled by the PDOK address lookup
  municipalityCode: string // 80 — hidden in GF, filled by the PDOK lookup
  addressNote: string // 22
  contactPhone: string // 23
  heardAbout: string // 24
  consent: boolean // 6
  website: string // honeypot, not a Gravity Forms field
}

export function emptySignupValues(): SignupValues {
  return {
    lessonKind: '',
    lessonKindNote: '',
    weeklyHours: '',
    totalHours: '',
    availability: '',
    location: '',
    locationNote: '',
    school: '',
    schoolYear: '',
    level: '',
    levelOther: '',
    subjects: [],
    subjectOther: '',
    studentFirstName: '',
    studentPhone: '',
    contactMethod: '',
    contactFirstName: '',
    contactLastName: '',
    email: '',
    postalCode: '',
    houseNumber: '',
    street: '',
    city: '',
    cityCode: '',
    municipalityCode: '',
    addressNote: '',
    contactPhone: '',
    heardAbout: '',
    consent: false,
    website: '',
  }
}

/** Text keys — every field except the checkbox group and the consent box. */
export type SignupTextKey = Exclude<keyof SignupValues, 'subjects' | 'consent'>

type Option = { label: string; value: string }

export type SignupField =
  | {
      kind: 'radio'
      name: SignupTextKey
      label: string
      hint?: string
      required: boolean
      options: Option[]
    }
  | {
      kind: 'select'
      name: SignupTextKey
      label: string
      hint?: string
      required: boolean
      options: Option[]
    }
  | {
      kind: 'text'
      name: SignupTextKey
      label: string
      hint?: string
      required: boolean
      placeholder?: string
      inputType?: 'text' | 'tel' | 'email' | 'number'
      autocomplete?: string
      min?: number
      max?: number
    }
  /**
   * Gravity Forms' Name field: one label over two inputs sharing a row, with
   * the part name repeated as the placeholder. Modelled as its own kind
   * rather than two `text` fields so the label stays single, as on the live
   * form.
   */
  | {
      kind: 'name'
      name: SignupTextKey
      label: string
      hint?: string
      required: boolean
      parts: { name: SignupTextKey; placeholder: string; autocomplete: string }[]
    }
  | {
      kind: 'checkbox'
      name: 'subjects'
      label: string
      hint?: string
      required: boolean
      options: string[]
    }

export type SignupStep = {
  title: string
  intro: string
  fields: (v: SignupValues) => SignupField[]
}

/** Gemeente Groningen. Addresses outside it may be out of reach for tutors. */
export const GRONINGEN_MUNICIPALITY_CODE = '0014'
/** The city of Groningen itself, within that gemeente. */
export const GRONINGEN_CITY_CODE = '1070'

const SUBJECTS_LOWER = ['Wiskunde', 'Natuurkunde', 'Scheikunde', 'NaSk']
/** The live field lists these interleaved rather than pairing the two
    wiskundes — kept in its order so the form reads the same. */
const SUBJECTS_UPPER = ['Wiskunde A', 'Natuurkunde', 'Wiskunde B', 'Scheikunde']

/** Which set of Bijlesvakken applies, or none if level/year don't say yet. */
function subjectOptions(v: SignupValues): string[] | null {
  const year = Number.parseInt(v.schoolYear, 10)
  const havoVwo = v.level === '2' || v.level === '3'
  const lower = Boolean(v.level) && !havoVwo
  const middle = havoVwo && v.schoolYear !== '' && year <= 3
  const upper = havoVwo && v.schoolYear !== '' && year >= 4

  if (lower || middle) return SUBJECTS_LOWER
  if (upper) return SUBJECTS_UPPER
  return null
}

export const signupSteps: SignupStep[] = [
  {
    title: 'Bijles',
    intro:
      'We krijgen graag een beeld van wat je zoekt, zodat we zo snel mogelijk de juiste docent kunnen vinden.',
    fields: (v) => {
      const fields: SignupField[] = [
        {
          kind: 'radio',
          name: 'lessonKind',
          label: 'Wat voor soort bijles zoek je?',
          required: true,
          options: [
            { label: 'Wekelijks bijles', value: 'weekly' },
            {
              label: 'Af en toe bijles (bijvoorbeeld voor toetsen of examens)',
              value: 'incidental',
            },
            { label: 'Anders', value: 'different' },
          ],
        },
      ]

      if (v.lessonKind === 'different') {
        fields.push({
          kind: 'text',
          name: 'lessonKindNote',
          label: 'Geef een toelichting over wat je verwacht van de bijles',
          required: false,
          placeholder:
            'Ik heb over twee weken een toets. Ik heb nog snel wat ondersteuning nodig.',
        })
      }

      if (v.lessonKind === 'weekly') {
        fields.push({
          kind: 'radio',
          name: 'weeklyHours',
          label: 'Hoeveel uur bijles wil je ongeveer?',
          required: true,
          options: [
            { label: '1 uur per week', value: 'basis' },
            { label: '2 uur per week', value: 'standard' },
            { label: 'Meer dan 2 uur per week', value: 'premium' },
          ],
        })
      }

      if (v.lessonKind === 'incidental' || v.lessonKind === 'different') {
        fields.push({
          kind: 'radio',
          name: 'totalHours',
          label: 'Hoeveel bijles denk je nodig te hebben?',
          required: true,
          options: [
            { label: '1 uur', value: '1' },
            { label: 'tussen de 2 en 5 uur', value: '2' },
            { label: 'meer dan 5 uur', value: '3' },
          ],
        })
      }

      if (v.weeklyHours || v.totalHours) {
        fields.push({
          kind: 'text',
          name: 'availability',
          label: 'Op welk moment van de week ben je vaak beschikbaar voor bijles?',
          required: true,
          placeholder: 'dinsdag- en donderdagavond',
        })
      }

      if (v.availability) {
        fields.push({
          kind: 'radio',
          name: 'location',
          label: 'Waar wil je het liefst bijles krijgen?',
          hint: 'Op welke locatie zou je bijles het liefste laten plaatsvinden.',
          required: true,
          options: [
            { label: 'Thuis', value: 'at_home' },
            { label: 'Openbare locaties (zoals een bieb)', value: 'library' },
            { label: 'Op school', value: 'at_school' },
            { label: 'Online', value: 'online' },
            { label: 'Anders', value: 'anders' },
          ],
        })
      }

      if (v.location === 'anders') {
        fields.push({
          kind: 'text',
          name: 'locationNote',
          label: 'Geef toelichting over waar je de bijles wil laten plaatsvinden.',
          required: false,
          placeholder: 'Ik wil bijles op de hogeschool',
        })
      }

      if (v.location === 'at_school') {
        fields.push({
          kind: 'text',
          name: 'school',
          label: 'Op welke school zit je?',
          required: false,
          placeholder: 'Het Werkman College',
        })
      }

      return fields
    },
  },

  {
    title: 'Vak en niveau',
    intro: 'Vertel ons met welk vak we je kunnen helpen.',
    fields: (v) => {
      const fields: SignupField[] = [
        {
          kind: 'text',
          name: 'schoolYear',
          label: 'Schooljaar',
          hint: 'Voer een getal kleiner dan of gelijk aan 8 in.',
          required: true,
          placeholder: 'Schooljaar',
          inputType: 'number',
          min: 0,
          max: 8,
        },
        {
          kind: 'select',
          name: 'level',
          label: 'Niveau',
          required: true,
          options: [
            { label: 'Selecteer niveau', value: '' },
            { label: 'vmbo', value: '1' },
            { label: 'havo', value: '2' },
            { label: 'vwo', value: '3' },
            { label: 'basisschool', value: '4' },
            { label: 'hbo', value: '5' },
            { label: 'Anders', value: 'different' },
          ],
        },
      ]

      if (v.level === 'different') {
        fields.push({
          kind: 'text',
          name: 'levelOther',
          label: 'Ander niveau',
          required: false,
        })
      }

      const subjects = subjectOptions(v)
      if (subjects) {
        fields.push({
          kind: 'checkbox',
          name: 'subjects',
          label: 'Bijlesvakken',
          required: true,
          options: subjects,
        })
      }

      if (v.level) {
        fields.push({
          kind: 'text',
          name: 'subjectOther',
          label: 'Staat het vak er niet tussen?',
          required: false,
        })
      }

      return fields
    },
  },

  {
    title: 'Kennismaking en proefles',
    intro:
      'Na je aanmelding neemt een van onze docenten contact met je op om een proefles in te plannen.',
    fields: () => [
      {
        kind: 'text',
        name: 'studentFirstName',
        label: 'Voornaam leerling',
        required: true,
        placeholder: 'Voornaam leerling',
      },
      {
        kind: 'text',
        name: 'studentPhone',
        label: 'Telefoonnummer leerling',
        hint: 'Op dit nummer neemt de bijlesdocent contact met je op om een proefles in te plannen.',
        required: true,
        placeholder: 'Telefoonnummer',
        inputType: 'tel',
        autocomplete: 'tel',
      },
      {
        kind: 'radio',
        name: 'contactMethod',
        label: 'Hoe kan de bijlesdocent contact opnemen?',
        required: true,
        options: [
          { label: 'Whatsapp (aanbevolen)', value: 'Whatsapp (aanbevolen)' },
          { label: 'Sms', value: 'Sms' },
          { label: 'Bellen', value: 'Bellen' },
        ],
      },
    ],
  },

  {
    title: 'Factuurgegevens',
    intro:
      'Bijna klaar, we hebben alleen nog een paar gegevens nodig voor de administratie.',
    fields: (v) => {
      const fields: SignupField[] = [
        {
          kind: 'name',
          name: 'contactFirstName',
          label: 'Naam contactpersoon',
          required: true,
          parts: [
            {
              name: 'contactFirstName',
              placeholder: 'Voornaam',
              autocomplete: 'given-name',
            },
            {
              name: 'contactLastName',
              placeholder: 'Achternaam',
              autocomplete: 'family-name',
            },
          ],
        },
        {
          kind: 'text',
          name: 'email',
          label: 'E-mailadres',
          required: true,
          placeholder: 'E-mailadres',
          inputType: 'email',
          autocomplete: 'email',
        },
        {
          kind: 'text',
          name: 'postalCode',
          label: 'Postcode',
          required: true,
          placeholder: 'Postcode',
          autocomplete: 'postal-code',
        },
        {
          kind: 'text',
          name: 'houseNumber',
          label: 'Huisnummer',
          required: true,
          placeholder: 'Huisnummer',
        },
      ]

      // Gravity Forms reveals street and city once postcode and house number
      // are both filled; the address lookup normally fills them in by then.
      if (v.postalCode && v.houseNumber) {
        fields.push(
          {
            kind: 'text',
            name: 'street',
            label: 'Straat',
            required: true,
            placeholder: 'Straat',
            autocomplete: 'address-line1',
          },
          {
            kind: 'text',
            name: 'city',
            label: 'Plaats',
            required: true,
            placeholder: 'Plaats',
            autocomplete: 'address-level2',
          },
        )
      }

      fields.push(
        {
          kind: 'text',
          name: 'addressNote',
          label: 'Adres opmerking',
          required: false,
          placeholder: 'Adres opmerking (optioneel)',
        },
        {
          kind: 'text',
          name: 'contactPhone',
          label: 'Telefoonnummer contactpersoon',
          required: false,
          placeholder: 'Telefoonnummer contactpersoon (optioneel)',
          inputType: 'tel',
        },
        {
          kind: 'text',
          name: 'heardAbout',
          label: 'Ik ken jullie van',
          required: true,
          placeholder: 'Ik ken jullie van',
        },
      )

      return fields
    },
  },
]

export const signupCopy = {
  kicker: 'Start altijd met een gratis proefles',
  title: 'Aanmelden',
  stepLabel: (step: number, total: number) => `Stap ${step} van ${total}`,
  next: 'Volgende',
  back: 'Vorige',
  submit: 'Aanmelden',
  submitting: 'Versturen…',
  invalid: 'Vul de verplichte velden in om verder te gaan.',
  /** Shown under the individual field, as Gravity Forms does. */
  fieldRequired: 'Dit veld is verplicht.',
  numberRange: (max: number) => `Voer een getal kleiner dan of gelijk aan ${max} in.`,
  requiredMark: '(Vereist)',
  consentPrefix: 'Ik ga akkoord met de',
  consentTerms: 'algemene voorwaarden',
  consentAnd: 'en het',
  consentPrivacy: 'privacy beleid',
  lookingUpAddress: 'We zoeken je adres op…',
  travelWarning:
    'Let op: voor bijles aan huis buiten Groningen rekenen we een extra reisvergoeding.',
  regionWarning:
    'Let op: bijles aan huis buiten de gemeente Groningen is niet altijd mogelijk omdat onze docenten in Groningen wonen. Meld je je toch aan, dan nemen we contact met je op.',
  successTitle: 'Bedankt voor je bericht!',
  successBody:
    'We zullen binnenkort contact met je opnemen om je gratis proefles in te plannen.',
  successAgain: 'Nieuwe aanmelding',
} as const
