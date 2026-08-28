/**
 * Tutor profiles, mirrored from https://mijn.bijlesbeta.nl/api/tutors.
 *
 * Snapshotted rather than fetched at runtime so the pages render without a
 * round-trip to the portal. Regenerate when the roster changes.
 *
 * Photos are still served by the portal — there is no local copy.
 */

export type Tutor = {
  slug: string
  name: string
  study: string
  expertise: string[]
  /** The square headshot — `profile_picture` on the portal. */
  photo: string
  /**
   * The full-length portrait — `extra_picture` on the portal. Every one of
   * the 28 is a 3:4 portrait, which is what the profile page's 434px crop is
   * shaped for; `photo` stays the roster's square crop.
   */
  extraPhoto: string
  bio: string[]
}

export const tutors: Tutor[] = [
  {
    "slug": "sander-jungblut",
    "name": "Sander Jungblut",
    "study": "Natuurkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/UqkLegFRuaVm1oWF17SRXJ6tzzu9rh491DW3aMiH.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/9L2w6WTRWsJyUf3ekuNPIwQoEpT4v7vcQ7PJ8GHs.jpg",
    "bio": [
      "Ik ben Sander Jungblut, Master student Natuurkunde aan de Rijksuniversiteit Groningen.",
      "Mijn liefde voor bètavakken is begonnen rond een jaar of vijftien. In die periode had ik net het vmbo afgerond en begon ik serieuzer na te denken over de toekomst en wat ik graag zou willen doen. Ik leerde altijd graag over hoe het universum in elkaar stak, en met dat als uitgangspunt besloot ik natuurkunde te gaan studeren.",
      "Met nieuwe motivatie ben ik zelfstandig aan de slag gegaan met het studeren voor de staatsexamens natuurkunde, wiskunde B, scheikunde en Engels. Met het behalen van deze vakken werd ik toegelaten tot de RUG. Een aantal jaar flink studeren verder, heb ik mijn bachelor natuurkunde behaald, en ben meteen begonnen aan de master Natuurkunde. Tijdens mijn studie ben ik ook actief als TA voor verschillende vakken binnen de natuurkunde en wiskunde.",
      "Over een paar jaar hoop ik binnen een universiteit aan het werk te kunnen als theoretisch natuurkundige en/of professor, maar tot die tijd doe ik mijn best om andere studenten verder op weg te helpen binnen de vakken waar ik passie voor heb."
    ]
  },
  {
    "slug": "ylou-mesu",
    "name": "Ylou Mesu",
    "study": "Natuurkunde",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/VSUkZ14FOtqbBifvqv6RJWWuTVK6RcPWno5mjPTG.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/kjlubbp1csayYswh1Y6gYzzA6PqizDs2BQL9Kxj9.jpg",
    "bio": [
      "Hoii!! Mijn naam is Ylou, ik ben 19 jaar oud en ik zit in mijn eerste jaar sterrenkunde aan de RUG. Mijn vrije tijd spendeer ik graag aan schilderen, lezen en afspreken met vrienden.",
      "Ik heb eerst het VWO afgerond met een E&M profiel, maar toen ik eenmaal naar vervolgstudies ging kijken kwam ik er al snel achter dat het me allemaal niet zoveel interesseerde. Ik had voorgenomen om een N&T profiel te halen in mijn tussenjaar zodat ik daarna in elk geval de keuze had uit alle studies.",
      "Al snel kwam ik erachter hoe interessant ik natuurkunde vond en dat het me goed lag. Samen met de fascinatie die ik altijd al had voor het heelal was mijn studiekeuze ineens heel snel gemaakt. Ik vind het erg leuk om andere te helpen, en al helemaal als het gaat over onderwerpen waar ik zelf ook passie voor heb!"
    ]
  },
  {
    "slug": "thijmen-baars",
    "name": "Thijmen Baars",
    "study": "Natuurkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/Y5nfvpeTH5rGyAy0pENE3DNE93LE7epTCYpd2HWx.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/BmYlq92zUawMK8PNdXwsDLXmezFqBU0plDZAD2T1.jpg",
    "bio": [
      "Hey! Ik ben Thijmen Baars en ik studeer natuurkunde aan de Rijksuniversiteit Groningen. In mijn vrije tijd hou ik me vooral bezig met sporten door te roeien bij Gyas en te volleyballen bij Veracles.",
      "Al van jongs af aan heb ik mij geïnteresseerd in de Bètavakken. Dit begon al op de basisschool met ‘proefjes’ doen met mijn opa. Op de middelbare was mijn profielkeuze dan ook snel gemaakt en heb een VWO N&T profiel afgerond op het Bonifatiuscollege in Utrecht, maar ook naast de bètavakken was ik nog breder geïnteresseerd in geschiedenis en filosofie.",
      "De natuurkunde greep mij uiteindelijk het meest en daarom ben ik naar het hoge noorden afgereisd om de wetten van de natuur te ontdekken. Omdat de middelbare voor mij niet heel lang geleden is, ligt de stof nog vers in mijn geheugen. Dus kan ik goed meedenken met de leerlingen en de stof op een interessante manier overbrengen."
    ]
  },
  {
    "slug": "nick-niemeijer",
    "name": "Nick Niemeijer",
    "study": "Natuurkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/w9s810Ljgucf2Zvn80K3zFg7C7nXKKdfFhvpbpN4.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/oy9U0DJc7vc3ICsd0kzxaPEepl39PW5ZgugBmqNe.jpg",
    "bio": [
      "Hallo, ik ben Nick Niemeijer. Ik vind het leuk om te gamen, anime te kijken, te koken of bakken en muziek te luisteren of maken met mijn piano. Maar wat ik het allerleukste vind is Natuurkunde, wat ik nu aan het studeren ben.",
      "Ik geloof niet in dat vakken moeilijk zijn, ik geloof erin dat vakken alleen slecht of goed uitgelegd kunnen worden, en een slechte uitleg leidt dan tot een zogenaamd moeilijk vak.",
      "Gedurende mijn middelbare school was mijn interesse voornamelijk scheikunde, en hoe stoffen met elkaar reageerden. Mijn interesse in Natuurkunde kwam pas op de voorgrond in het laatste jaar, omdat ik toen een docent kreeg die Natuurkunde echt heel enthousiast en leuk kon uitleggen.",
      "Ik heb gekozen om bijles te gaan geven, omdat ik graag mijn interesse in bèta vakken wil delen met andere mensen. Daarnaast wil ik ook graag laten zien dat met de juiste vorm van uitleggen de bèta vakken veel makkelijker worden om te begrijpen."
    ]
  },
  {
    "slug": "sanne-gerarts",
    "name": "Sanne Gerarts",
    "study": "Natuurkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/iqz9LnXrVMEBVtSoGPVG9jeiS2H2agW1b8KBS7pk.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/sf07DEdr73cBmDVS8FzPJStcx5dSDWDlQ2NaWBa7.jpg",
    "bio": [
      "Hoi! Ik ben Sanne en ik studeer Natuurkunde aan de RUG. Naast mijn studie hou ik van lezen en doe ik veel met vrienden/familie.",
      "Ik ben altijd al nieuwsgierig geweest naar de wereld om me heen; ik stelde als kind vragen waar mijn ouders geen antwoord op hadden en hield van proefjes. Daarom heb ik op de middelbare het profiel NT/NG gekozen en ik vond alle bètavakken interessant.",
      "In de bovenbouw van het vwo gaf ik al bijles aan jongere leerlingen, en ik werkte op de universiteit als mentor van eerstejaars. Mijn doel is om de bètavakken toegankelijk en begrijpbaar te maken, en hopelijk ook voor een beetje plezier te zorgen!"
    ]
  },
  {
    "slug": "friso-dorian-roest",
    "name": "Friso Dorian Roest",
    "study": "Natuurkunde",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/JJtK3R8ERmuYFOM5iA7SQQxliEEHqdnGxerfqwih.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/W5Ouvk8GdXk6MY7xEpiyIvRMqOaHMdW9A5grSvE8.jpg",
    "bio": [
      "Hallo, ik ben Friso en ik studeer natuurkunde in Groningen. Ik geef al jaren bijles, en nu ook via Bijles Bèta.",
      "Ik heb altijd erg genoten van de bètavakken en daarom ook gekozen voor een NG/NT-profiel op het Praedinius. In de bovenbouw van het vwo werd het steeds duidelijker dat ik natuurkunde wilde gaan studeren.",
      "Vooral de bètavakken vind ik leuk om te geven, omdat ze niet alleen uit rijtjes leren bestaan, maar juist veel inzicht geven in hoe dingen werken. Die ‘aha’ momentjes geven me altijd erg veel voldoening. Ik probeer leerlingen daarom vooral te helpen om de stof echt te begrijpen."
    ]
  },
  {
    "slug": "robin-janssen",
    "name": "Robin Janssen",
    "study": "Wiskunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/cA4sOVDYcLUwY5OMbjSdFiDDbT6D9QllSmSkFQ1v.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/l4Hkmxujn0vMxK3NrNpKqprnwhdADEtgVY0IR9Ft.jpg",
    "bio": [
      "Hi hoi! Mijn naam is Robin en ik ben vorig jaar afgestudeerd met een bachelorsdiploma wiskunde aan de Rijksuniversiteit Groningen. Ik ben nu bezig met mijn eerste jaar Masters wiskunde.",
      "Tijdens mijn middelbareschooltijd in Leiden koos ik voor een NT/NG-profiel en in september 2023 ben ik gestart met de wiskundestudie. Mijn keuze voor deze studie was niet zozeer gebaseerd op een liefde voor cijfers, maar eerder op de fascinatie voor achterliggende structuren en abstractie.",
      "Tijdens mijn tweede en derde studiejaar heb ik de gelegenheid gekregen om docent-assistent te worden. Dit houdt in dat ik werkcolleges gegeven heb en medeleerlingen hielp met het begrijpen van de leerstof."
    ]
  },
  {
    "slug": "jelle-van-dalen",
    "name": "Jelle Van Dalen",
    "study": "Biomedical Engineering",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/2B7XMtAaEvJk0i1GR91W0UduAiJCJUXmixTzCKeG.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/eWSzeP57fligWcDxm8R3NKtxsgNEDzQmAawJ2TIy.jpg",
    "bio": [
      "Hoi! Ik ben Jelle van Dalen en op dit moment ben ik bezig met mijn master in Biomedical Engineering. Naast mijn studie hou ik me regelmatig bezig met Bijles Bèta.",
      "Vanaf mijn eerste schooldag was al duidelijk dat Bèta mij een stuk beter afging dan Alfa en daarom heb ik in de 4e klas van het VWO zonder twijfel N&T en N&G gekozen. Nadat ik mijn VWO diploma haalde in Utrecht, was ik zeker nog niet klaar met alle Bèta vakken. Daarom besloot ik Biomedische Technologie te gaan studeren aan de RUG; een combinatie van al deze mooie vakken, in het mooie Groningen!",
      "Ik ben begonnen met bijles geven toen ik van huis uit de vraag kreeg of ik mijn zusje bijles natuurkunde wilde gaan geven. Het geeft mij namelijk een enorme kick om een ander een vak niet alleen beter te laten begrijpen, maar vooral ook om een ander het vak leuker te gaan laten vinden! Ondertussen geef ik nu alweer meer dan vier jaar bijles bij Bijles Bèta."
    ]
  },
  {
    "slug": "rutger-talens",
    "name": "Rutger Talens",
    "study": "Sterrenkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/vbnBGFxHzwtcnlZh5vtsLZvSfPfGlbpirnpkUwMk.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/pLWQNbKqUUxJAHwP0h7oK7V6YWISxcvzsucryFxf.jpg",
    "bio": [
      "Mijn naam is Rutger Talens en ik kom uit Delfzijl. Ik heb eerst havo gedaan op het Rudolph Pabus Cleveringa Lyceum en ik neigde daar al sinds het begin naar de bèta kant. Mijn profielkeuze voor de bovenbouw werd dan ook Natuur & Techniek.",
      "Na een aantal open dagen te hebben bezocht voor zowel HBO als universitaire studies, ontdekte ik dat mijn passie echt lag bij theoretische natuurkunde, voornamelijk astrofysica. Vol enthousiasme ben ik daarom na havo doorgestroomd naar het vwo, waarna ik begonnen ben aan de bacheloropleiding Sterrenkunde op de RUG.",
      "Ik ben nooit mijn enthousiasme verloren voor de bèta vakken en door mijn passie voor theorie leer ik graag de fijne kneepjes kennen van de stof! Dit in combinatie met mijn ervaring met zowel havo als vwo zorgt ervoor dat ik goed de stof kan uitleggen op allerlei niveaus."
    ]
  },
  {
    "slug": "niek-seller",
    "name": "Niek Seller",
    "study": "BSc Econometrics and Operations Research",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/CRe90XAcCuoqoAcZADTxUPtGXkQ6AJF48qUkPrGQ.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/OJVEItmIXGDYEzadJdjiYWuhNFwBKz7AGTPkXPSC.jpg",
    "bio": [
      "Hoi! Ik ben Niek Seller en ik zit nu in mijn derde jaar van de bachelor Econometrie en Operationele research. Ik ben 21 jaar en woon nu bijna drie jaar in Groningen.",
      "Ik heb mijn VWO afgerond met een Natuur en Techniek profiel met wiskunde D en vond dit het leukste vak van mijn pakket. Hoewel Econometrie op de Economische Faculteit zit, is dit toch een bèta studie.",
      "Ik haal heel veel plezier uit het oplossen van verschillende puzzels en uitdagende sommen. Ik vind het heel leuk om bezig te zijn met de stof en anderen te helpen met het begrijpen ervan, vandaar dat ik bijles ben gaan geven bij Bijles Bèta."
    ]
  },
  {
    "slug": "jonah-horjus",
    "name": "Jonah Horjus",
    "study": "Technische Natuurkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/BZ2MURplZysUe2aXHBsgu7U6gxTouQxC3uUZe756.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/pr2kAaWIT4jgvVIYTPu6qLi3zMpXyRQIme1qmroy.jpg",
    "bio": [
      "Mijn naam is Jonah Horjus en ik studeer Technische Natuurkunde. In mijn vrije tijd ga ik graag naar de sportschool en speel ik gitaar.",
      "Vanaf jongs af aan heb ik een voorliefde gehad voor bèta-vakken. Mijn profielkeuze was daarom snel gemaakt: ik heb het VWO-profiel Natuur & Techniek afgerond aan de CSG Bogerman in Sneek.",
      "Ik haal veel plezier uit het helpen van anderen met dit vak en hoop misschien zelfs anderen te inspireren om dezelfde richting op te gaan! Aangezien mijn middelbare schooltijd nog niet zo lang geleden is, zit de stof nog vers in mijn geheugen."
    ]
  },
  {
    "slug": "wout-sijtsma",
    "name": "Wout Sijtsma",
    "study": "Sterrenkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/6OXY9RF4g88rwHI2VPgGpUE0hnhU91uJfesnpqfz.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/YuJYic1BSpJVRKTmwT1oO9yDMaDEFTBBvEJLshpW.jpg",
    "bio": [
      "Ik ben Wout Sijtsma en ik ben dit jaar begonnen met mijn studie sterrenkunde aan de RUG. In mijn vrije tijd houd ik ervan om te volleyballen of gezellig met vrienden af te spreken.",
      "Op de middelbare school heb ik altijd al veel interesse gehad in grote vraagstukken over ons heelal en onze plek daarin, wat zeker een grote motivatie voor mij is geweest voor de bèta vakken, maar ook filosofie.",
      "Omdat ik nog zo dichtbij de stof sta, denk ik dat het makkelijker is om de kennis over te dragen op een manier die voor leerlingen te begrijpen en interessant is."
    ]
  },
  {
    "slug": "wout-bongers",
    "name": "Wout Bongers",
    "study": "Chemistry and Physics",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/XklWB1cgykGVlW7brbRsaMf4k3C4tDp8K9Du4S30.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/RelmImdKhrePbHjzags3lx2bqEWY3U9PnU8GI46p.jpg",
    "bio": [
      "Hoi! Ik ben Wout Bongers en ik ben begonnen met chemistry studeren aan de Rijksuniversiteit Groningen. In mijn tweede jaar heb ik besloten om over te gaan naar natuurkunde. In mijn vrije tijd doe ik aan boulderen en game ik.",
      "Ik ben begonnen op het VMBO-TL en kwam er achter dat er meer in mij zat. Ik heb daarom daarna HAVO gaan doen en ontdekte daar mijn passie voor bèta. Al snel kwam ik erachter dat ik nog meer uit mezelf kon halen en ik ben toen gaan voorbereiden voor het VWO.",
      "Omdat ik het VMBO-TL, HAVO en VWO heb afgerond heb ik veel ervaring met de stof op verschillende niveaus en kan ik dat goed uitleggen."
    ]
  },
  {
    "slug": "pelle-van-der-woude",
    "name": "Pelle van der Woude",
    "study": "Wiskunde",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/Tx9YAbN1CJspvxnGJFPoQ7QmoentfqTLVosJluEv.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/S4DegvQL4X8SaxpBvV4FsgGhYJWTZWX4MtWc3KmK.jpg",
    "bio": [
      "Hoi! Ik ben Pelle van der Woude, ik studeer wiskunde en ik kom uit Heerenveen, in Friesland. In mijn vrije tijd ga ik geregeld naar de sportschool en daarnaast ben ik actief bij mijn studievereniging.",
      "Op mijn middelbare heb ik het VWO afgerond met het profiel NT/NG. Mijn interesse lag al vrij vroeg bij de bètavakken dus daarom ben ik voor dit profiel gegaan, en uiteindelijk heb ik ervoor gekozen om wiskunde te gaan studeren.",
      "Ik heb in het verleden al aan kennissen bijles gegeven in voornamelijk wiskunde en ik vond dat erg leuk om te doen, dus het was voor mij een logische keuze om ook in Groningen bijles te gaan geven."
    ]
  },
  {
    "slug": "wendy-woldijk",
    "name": "Wendy Woldijk",
    "study": "Life Science & Technology",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/9GrfbEHs2si6Gfy6FsuVrccmlAC8zHYeS7VNJlYC.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/hvkxvkiQKVEbbnvJ2LN5BN2v1CMWqYDATXeA4pUT.jpg",
    "bio": [
      "Hey! Mijn naam is Wendy en studeer momenteel Life Science & Technology aan de Rijksuniversiteit Groningen. Van jongs af aan riep ik al dat ik iets met wetenschap wilde doen in mijn toekomst.",
      "Naast mijn studie ben ik vaak op het voetbalveld te vinden, speel ik muziek en geniet ik volop van gezellige momenten met mijn vriendinnen. Ik heb mijn VWO afgerond met een NT-profiel, een keuze die voor mij vanzelfsprekend was.",
      "Ik vind het persoonlijk belangrijk om de dingen die ik doe goed te begrijpen, want ik vind pas écht iets leuk als ik het ook begrijp. Daarom help ik graag anderen met lastige onderwerpen."
    ]
  },
  {
    "slug": "bram-hoeflaak",
    "name": "Bram Hoeflaak",
    "study": "Scheikunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/uojpTFj2PXx3wOBl2KvVwnejj2qytDCEOAkrc6B6.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/49z37V8FBS3cV2XFAeRtaILkTA4EiLmNovIchRU9.jpg",
    "bio": [
      "Hoi! Ik ben Bram en ik kom uit Nieuwleusen, dat ligt in de buurt van Zwolle. Ik studeer en woon sinds een tijdje nu in Groningen.",
      "Ik studeer farmacie. Ik heb deze studie gekozen omdat ik het interessant vind hoe medicijnen op klein niveau in het menselijk lichaam werken. Op de middelbare school hebben de bètavakken mij altijd goed gelegen en ik heb met name scheikunde en biologie altijd interessant gevonden.",
      "Naast mijn studie vind ik het leuk om met vrienden af te spreken en uit te gaan in Groningen. Ook houd ik erg veel van muziek. Ik speel dan ook piano en gitaar."
    ]
  },
  {
    "slug": "stefan-eduard",
    "name": "Stefan Eduard",
    "study": "Sterrenkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/9XUpS8NlEPVtZtr1lqHv8Ntj2OADhW3U3FmqMxC3.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/O9WxB8afrclEkKAXeZFPwsdLqRkB3B7nwlkjuftl.jpg",
    "bio": [
      "Hallo! Ik ben Stefan Eduard, ik kom uit Zwolle, en ik ben student Sterrenkunde. Al zolang ik me kan herinneren vind ik het leuk om met getallen te werken. Op het VWO heb ik Natuur en Techniek gevolgd, met Wiskunde D.",
      "Ik ben zelf van mening dat de bètavakken de mooiste vakken zijn die er bestaan, en dit kun je pas echt goed inzien als je ze goed begrijpt. Daarom geeft het me groot plezier om andere mensen met deze vakken te helpen.",
      "Ik geef al bijles in de bètavakken sinds mijn zestiende, toen ik in de vijfde zat, destijds aan andere leerlingen op mijn middelbare school. Het bevalt me nog steeds erg goed, en ik doe mijn uiterste best om mijn enthousiasme met anderen te delen."
    ]
  },
  {
    "slug": "thomas-smeman",
    "name": "Thomas Smeman",
    "study": "Sterrenkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/LuI0ZavDx1RjGDG6kCdZnU5LFHbK3g2jV7TCzRO7.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/gB4DhHaSxG32VHTOsqyOTo33G5cfYWnMurPv7NTo.jpg",
    "bio": [
      "Mijn naam is Thomas Smeman en studeer Sterrenkunde aan de RUG. Ik heb VWO+ gedaan op het Stellingwerfcollege in Oosterwolde, waar ik erachter kwam dat de bèta vakken mij goed liggen.",
      "Ik was echter niet altijd even goed in wiskunde, maar met genoeg oefening is het mij gelukt zowel wiskunde A en B te halen met een NT/NG profiel.",
      "Nu heb ik een dubbele bachelor in natuurkunde en sterrenkunde. Ik heb de stof vanuit verschillende perspectieven geleerd, wat mij zeker helpt met het uitleggen van de fijne kneepjes."
    ]
  },
  {
    "slug": "marieke-spijker",
    "name": "Marieke Spijker",
    "study": "Biomolecular Sciences",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/I7EBOdPfVysGgjncxwBCJbZa1XDZYb5H6BPZ62rN.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/HsWDBg6GIKh4VxUkUHbfZpt1nhHwJpIppX9UtDDT.jpg",
    "bio": [
      "Hoi! Ik ben Marieke en ben bezig met mijn master Biomolecular Sciences. Ik ben van jongs af aan al breed geïnteresseerd en heb op het vwo voor een NG/NT profiel gekozen om nog alle kanten op te kunnen.",
      "In mijn studiekeuze wilde ik mezelf zo breed mogelijk ontwikkelen, en heb daarom gekozen voor de multidisciplinaire bachelor Life Science and Technology. Uiteindelijk heb ik ervoor gekozen om te specialiseren in de biochemie.",
      "Mijn enthousiasme voor de bètavakken deel ik graag door de lesstof op een heldere en begrijpelijke manier uit te leggen. Zo help ik leerlingen om met meer zelfvertrouwen de lesstof door te gaan."
    ]
  },
  {
    "slug": "ferre-korf",
    "name": "Ferre Korf",
    "study": "Natuurkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/grKJ5AVCiNIygngWE3pwAHM8uF2Ujul6vgfIxWjD.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/a7idWaQwAxbD18v1VqYqFyJEjfSXJANar18DMaT1.jpg",
    "bio": [
      "Hey! Ik ben Ferre en ik studeer Natuurkunde aan de RUG. In mijn vrije tijd drum ik graag en doe ik aan miniatuurschilderen en kaartspellen.",
      "Mijn interesse in de bètavakken begon al op de basisschool, waar ik zelfs 3e ben geworden van Nederland en België met de techniek Olympiade. In de bovenbouw lag mijn interesse vooral bij de scheikunde, maar in de 6e ben ik toch naar de natuurkunde overgestapt.",
      "Ik ben altijd erg enthousiast over schei-, wis- en natuurkunde en vind het erg leuk om erover te praten en dingen aan anderen uit te leggen."
    ]
  },
  {
    "slug": "joes-boerstra",
    "name": "Joes Boerstra",
    "study": "Life science and Technology",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/rhgJ8NpmAq1m9Eyyk2aAOsCCRMh5ArSfA7E2nLj7.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/mqbztjnd46ak3YH9PSoPQsmgGi94bnnPQxtRfWBi.jpg",
    "bio": [
      "Hoi, ik ben Joes, 19 jaar, en ik zit nu in mijn eerste jaar van de bachelor Life Science & Technology. Verder zit ik bij circus Santelli en speel ik viool.",
      "Ik ben opgegroeid in Groningen en heb hier ook mijn diploma met een NT/NG-profiel gehaald. Ik heb bèta vakken altijd heel interessant en leuk gevonden en heb hier veel uitdaging in gezocht door wiskunde D in mijn pakket te nemen.",
      "Het leukste aan bèta vakken vind ik dat als je het eenmaal door hebt, je snel kan zien dat alles met elkaar te maken heeft, en het toch makkelijker te begrijpen is dan je eerst denkt!"
    ]
  },
  {
    "slug": "iskander-woldinga",
    "name": "Iskander Woldinga",
    "study": "Werktuigbouwkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/4xFuUjOp9gXeOrRUrPWDt887C9GIGAPZ0DZBOftT.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/VgTWPx5kIaTg3VEOUEeRR8xQfXjVUrQP8gvBfIyS.jpg",
    "bio": [
      "Hallo! Ik ben Iskander en ik kom uit Vries, een dorpje net onder Groningen. Ik heb op het Zernike College in Haren mijn VWO afgerond.",
      "Na de middelbare school ben ik werktuigbouwkunde gaan studeren omdat ik een interesse heb in natuurwetenschappen en ik het erg leuk vind om creatief na te denken en dingen te ontwerpen. Nu doe ik de master werktuigbouwkunde aan de RUG.",
      "Bètavakken kunnen soms ingewikkeld en abstract lijken maar als je de stof beter snapt dan wordt het een stuk inzichtelijker en vooral ook leuker!"
    ]
  },
  {
    "slug": "henk-velders",
    "name": "Henk Velders",
    "study": "Technische Bedrijfskunde",
    "expertise": [
      "Wiskunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/e0RbvwExdRyYSohI27QbL8AMCCjNCEdkvedJxDiA.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/5jmDOTxzmk2Mq6sarB3tyvKyamLBFfNoBzf1nhOC.jpg",
    "bio": [
      "Ik ben Henk Velders, en momenteel zit ik in het derde jaar van mijn studie Technische bedrijfskunde. Naast mijn studie doe ik ook graag aan wielrennen, gamen en wieler- / autoraces kijken.",
      "Het VWO heb ik afgerond met een Economie en Maatschappijleer pakket inclusief wiskunde A, maar in de 5de klas kwam ik erachter hoe interessant ik techniek vond en daarom heb ik na het halen van mijn diploma wiskunde B gehaald om deze studie te mogen starten.",
      "Ik had veel plezier met wiskunde A, B en nu nog met wiskunde en ik hoop dat ik ervoor kan zorgen dat anderen ook plezier uit wiskunde halen, daarom ben ik gaan werken bij Bijles Bèta."
    ]
  },
  {
    "slug": "thijs-noordover",
    "name": "Thijs Noordover",
    "study": "Sterrenkunde & theoretische natuurkunde",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/t0soIyEuwcDgBffKQ7qrsFRNldT2NTrSnX5MsJvu.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/BLpjiVcFGr7wOpfRp7tXPSNAYaqFYf1XUO2oJeXM.jpg",
    "bio": [
      "Hoi, mijn naam is Thijs. In mijn vrije tijd sport ik graag, spreek ik vaak af met vrienden om bordspellen te spelen, ook ga ik graag naar concerten. Ik ben student sterrenkunde en theoretische natuurkunde aan de RUG.",
      "Hiervoor zat ik op het Hondsrug College in Emmen, waar ik begon op de havo en hierna vwo ging doen, beide met het vakkenpakket N&G en N&T. Op de middelbare school was ik zeker geen sterleerling maar toen het kwartje eenmaal viel ging het al stukken beter.",
      "Door de jaren heen heb ik op de middelbare school mijn klasgenoten en lagerejaars bijles gegeven in de vakken scheikunde, biologie en natuurkunde. En ik hoop dat ook voor jou het kwartje zal vallen!"
    ]
  },
  {
    "slug": "tjalle-durk-van-der-eems",
    "name": "Tjalle-Durk van der Eems",
    "study": "Computing Science",
    "expertise": [
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/GmeJmfc0rJDA9zNTwyUi0pXWvvTzR2BwgwXLEWXy.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/s3ffDYoSJH2tWxoX9POP7zF2BmIAmAqJC3aHY5BK.jpg",
    "bio": [
      "Hallo! Mijn naam is Tjalle-Durk van der Eems en studeer inmiddels Computing Science aan de RUG. Ik heb VWO afgerond op CSG Bogerman te Sneek en heb altijd al grote voorkeur gehad voor de bèta vakken.",
      "Ik heb het profiel NT gevolgd gecombineerd met informatica en BSM. Ik merkte direct dat ik mezelf vrij makkelijk redde in de bèta vakken en wil nu graag andere leerlingen helpen het plezier eruit te halen.",
      "Ik merkte op de middelbare dat bepaalde onderwerpen redelijk snel besproken worden en dat er dan direct naar het volgende stukje stof wordt gegaan, terwijl dit voor veel mensen net iets te snel gaat. Ik help jullie graag om het beter te begrijpen!"
    ]
  },
  {
    "slug": "minke-muller-kobold",
    "name": "Minke Muller Kobold",
    "study": "Biomedische Technologie",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/RR5CbDoz17Y0HIdT8ykk3oiXDs3HDg0HNM3X6IvW.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/luVAjGLmVenB3yd88AVdmzDE5D8mxaCZykJ1243W.jpg",
    "bio": [
      "Hoi! Ik ben Minke en ik zit in mijn tweede jaar van de bachelor Biomedische Technologie. Ik kom oorspronkelijk uit Enschede, maar ben voor de studie en de stad naar Groningen verhuisd.",
      "Mijn middelbare school heb ik pas twee jaar geleden afgerond, waardoor de stof nog goed in mijn hoofd zit. Dat helpt bij het geven van bijles, omdat ik weet waar leerlingen vaak tegenaan lopen.",
      "Mijn interesse in de technische vakken komt doordat ik het altijd al leuk heb gevonden om problemen en puzzels op te lossen. In mijn studie zie ik die uitdagingen nog steeds als een soort moeilijke puzzel."
    ]
  },
  {
    "slug": "jelmer-spoor",
    "name": "Jelmer Spoor",
    "study": "Computing Science",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/X8RJ3Vbtz2bLceTbyHGO82lAJFnsWLCQpPRez3Ut.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/SPkRfDvzIg7GYLQJ7ba9xS03Mu314T3Py6xO2Gp7.jpg",
    "bio": [
      "Hoi! Mijn naam is Jelmer Spoor, ik ben 21 jaar en ik studeer Computing Science. Naast mijn studie ben ik fanatiek volleyballer en speel ik bij Sudosa-Desto op het één-na hoogste niveau van Nederland.",
      "Op de middelbare school merkte ik dat de bètavakken mij goed lagen en vond ik vooral wiskunde het leukste. Daarom heb ik ook gekozen voor het profiel Natuur & Techniek (HAVO en VWO met wiskunde D).",
      "Tijdens mijn schooltijd gaf ik regelmatig bijles in de bètavakken. Dat vond ik erg leuk om te doen en leek het mij leuk om dit weer te doen maar dan in Groningen."
    ]
  },
  {
    "slug": "tymen-postma",
    "name": "Tymen Postma",
    "study": "Chemische Technologie",
    "expertise": [
      "Wiskunde",
      "Natuurkunde",
      "Scheikunde"
    ],
    "photo": "https://mijn.bijlesbeta.nl/storage/provider-pictures/tUvVcEVS0fItqLw3YiYLIpowVb5IRj69OVLtnvnD.jpg",
    "extraPhoto": "https://mijn.bijlesbeta.nl/storage/provider-pictures/bunJIFRUz18Z7UsCfXeXkXCR0jHxf7FLSdxuFCTA.jpg",
    "bio": [
      "Hey! Ik ben Tymen Postma, 21 jaar, vierdejaars student Chemische Technologie aan de NHL Stenden in Leeuwarden. In mijn vrije tijd sport ik graag.",
      "Ik heb gekozen voor de opleiding Chemische Technologie omdat ik de chemische basis, samen met de gekoppelde wiskunde en natuurkunde, erg interessant vind, vooral om te begrijpen hoe productieprocessen in de industrie werken.",
      "Met de kennis die ik tijdens mijn studie heb opgedaan, wil ik bij de bijlessen laten zien hoe je de stof sneller en gemakkelijker kunt begrijpen."
    ]
  }
]


export function findTutor(slug: string): Tutor | undefined {
  return tutors.find((tutor) => tutor.slug === slug)
}

/** `count` other tutors, starting after the given one, wrapping around. */
export function otherTutors(slug: string, count: number): Tutor[] {
  const index = tutors.findIndex((tutor) => tutor.slug === slug)
  const start = index === -1 ? 0 : index + 1
  return Array.from({ length: Math.min(count, tutors.length - 1) }, (_, i) =>
    tutors[(start + i) % tutors.length]!,
  )
}
