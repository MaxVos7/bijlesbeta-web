<script setup lang="ts">
import { landingPath } from '~/data/landings'
import { contact, legalLinks, nav, portalLinks, socials, tagline } from '~/data/site'

const config = useRuntimeConfig()

// The live site's footer omits Kennisbank — it's a header-only link there.
const footerNav = nav.filter((item) => item.label !== 'Kennisbank')

/**
 * The "Vakken" column on bijlesbeta.nl is its own hand-built menu rather than
 * the `subjects` list: three subject landings plus the aan-huis landing.
 */
const subjectLinks = [
  { label: 'Wiskunde', to: landingPath('wiskunde-groningen') },
  { label: 'Natuurkunde', to: landingPath('natuurkunde-groningen') },
  { label: 'Scheikunde', to: landingPath('scheikunde-groningen') },
  { label: 'Bijles aan Huis', to: landingPath('aan-huis-groningen') },
]
</script>

<!--
  A 1:1 rebuild of the Elementor footer on bijlesbeta.nl (footer template 126).

  Everything here is pinned to the values the live template computes rather than
  to this app's design tokens, because the brief is pixel parity at every
  viewport: four full-bleed bands (84px spacer, brand, five columns, 108px
  spacer), a 1328px content width for the columns and 1400px for the brand band,
  40px page gutters that halve to 20px under Elementor's 768px breakpoint, and a
  60px column gap that becomes a 30px row gap once the columns stack.

  Measurements were read off the live DOM, so the numbers below are literal:
  the logo's 60.581px height, the 217.6px columns that fall out of `width: 20%`
  flex-shrinking against a 60px gap, and the buttons' 11px line-height (their
  53.9px height comes from the icon, not the label).
-->
<template>
  <footer class="site-footer">
    <div class="fb-band"><div class="fb-spacer fb-spacer--top" /></div>

    <div class="fb-band">
      <div class="fb-inner fb-inner--brand">
        <NuxtLink to="/" class="fb-logo" aria-label="Bijles Bèta — naar de homepage">
          <img src="/logo.svg" alt="Bijles Bèta" width="142" height="56">
        </NuxtLink>

        <h5 class="fb-tagline">{{ tagline }}</h5>

        <ul class="fb-socials">
          <li v-for="social in socials" :key="social.label">
            <a :href="social.href" rel="noopener" target="_blank" :aria-label="social.label">
              <!-- Font Awesome 6 brand glyphs, as Elementor renders them. -->
              <svg
                v-if="social.label === 'Facebook'"
                viewBox="0 0 512 512"
                aria-hidden="true"
              >
                <path
                  d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
                />
              </svg>
              <svg
                v-else-if="social.label === 'Instagram'"
                viewBox="0 0 448 512"
                aria-hidden="true"
              >
                <path
                  d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                />
              </svg>
              <svg
                v-else-if="social.label === 'LinkedIn'"
                viewBox="0 0 448 512"
                aria-hidden="true"
              >
                <path
                  d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                />
              </svg>
              <svg v-else viewBox="0 0 512 512" aria-hidden="true">
                <path
                  d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                />
              </svg>
            </a>
          </li>
        </ul>

        <div class="fb-brand-tail" />
      </div>
    </div>

    <div class="fb-band">
      <div class="fb-inner fb-columns">
        <div class="fb-col">
          <div class="fb-text">
            <p>
              <strong>Bijles Bèta</strong><br>{{ contact.address.street }},
              {{ contact.address.postalCode }} {{ contact.address.city }}
            </p>
          </div>
          <div class="fb-text">
            <p><strong>Te bereiken op:</strong></p>
            <!-- The live copy pads the two columns with non-breaking spaces
                 rather than laying them out, so it is reproduced verbatim. -->
            <p>
              Ma t/m Za&nbsp; &nbsp; &nbsp; 10:00 – 18:00<br>Zondag&nbsp; &nbsp;
              &nbsp; &nbsp; &nbsp; Gesloten
            </p>
          </div>
        </div>

        <div class="fb-col">
          <h6 class="fb-heading">Contact</h6>
          <div class="fb-stack">
            <div class="fb-text fb-text--sm"><p>Whatsapp of bel ons!</p></div>
            <div class="fb-text fb-text--strong">
              <p><a :href="contact.phoneHref">{{ contact.phone }}</a></p>
            </div>
          </div>
          <div class="fb-stack">
            <div class="fb-text fb-text--sm"><p>Liever mailen?</p></div>
            <div class="fb-text fb-text--strong">
              <p><a :href="contact.emailHref">{{ contact.email }}</a></p>
            </div>
          </div>
        </div>

        <div class="fb-col">
          <h6 class="fb-heading">Vakken</h6>
          <nav class="fb-menu">
            <ul>
              <li v-for="link in subjectLinks" :key="link.to">
                <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <div class="fb-col fb-col--portal">
          <div class="fb-stack fb-stack--12">
            <h6 class="fb-heading">Mijn Bijles Bèta</h6>
            <nav class="fb-menu">
              <ul>
                <li v-for="link in portalLinks" :key="link.label">
                  <a :href="`${config.public.portalUrl}${link.path}`">{{ link.label }}</a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="fb-stack fb-stack--12 fb-stack--start">
            <NuxtLink to="/aanmelden" class="fb-btn fb-btn--primary">
              <span class="fb-btn__inner">
                <span class="fb-btn__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="13"
                    viewBox="0 0 14 13"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 5.75C0.585786 5.75 0.25 6.08579 0.25 6.5C0.25 6.91421 0.585786 7.25 1 7.25V5.75ZM13.5303 7.03033C13.8232 6.73744 13.8232 6.26256 13.5303 5.96967L8.75736 1.1967C8.46447 0.903806 7.98959 0.903806 7.6967 1.1967C7.40381 1.48959 7.40381 1.96447 7.6967 2.25736L11.9393 6.5L7.6967 10.7426C7.40381 11.0355 7.40381 11.5104 7.6967 11.8033C7.98959 12.0962 8.46447 12.0962 8.75736 11.8033L13.5303 7.03033ZM1 6.5V7.25H13V6.5V5.75H1V6.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span class="fb-btn__text">Aanmelden</span>
              </span>
            </NuxtLink>
            <a :href="config.public.portalUrl" class="fb-btn fb-btn--secondary">
              <span class="fb-btn__inner">
                <span class="fb-btn__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="13"
                    viewBox="0 0 14 13"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 5.75C0.585786 5.75 0.25 6.08579 0.25 6.5C0.25 6.91421 0.585786 7.25 1 7.25V5.75ZM13.5303 7.03033C13.8232 6.73744 13.8232 6.26256 13.5303 5.96967L8.75736 1.1967C8.46447 0.903806 7.98959 0.903806 7.6967 1.1967C7.40381 1.48959 7.40381 1.96447 7.6967 2.25736L11.9393 6.5L7.6967 10.7426C7.40381 11.0355 7.40381 11.5104 7.6967 11.8033C7.98959 12.0962 8.46447 12.0962 8.75736 11.8033L13.5303 7.03033ZM1 6.5V7.25H13V6.5V5.75H1V6.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span class="fb-btn__text">Inloggen</span>
              </span>
            </a>
          </div>
        </div>

        <div class="fb-col">
          <h6 class="fb-heading">Navigatie</h6>
          <nav class="fb-menu">
            <ul>
              <li v-for="item in footerNav" :key="item.to">
                <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
              </li>
              <li v-for="item in legalLinks" :key="item.to">
                <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </nav>
          <!-- TODO: reopens the consent banner, which isn't built yet — the
               anchor is a placeholder until it is. -->
          <div class="fb-manage"><a href="#cookies">Beheer cookies</a></div>
        </div>
      </div>
    </div>

    <div class="fb-band"><div class="fb-spacer fb-spacer--bottom" /></div>
  </footer>
</template>

<style scoped>
/*
  Local aliases for the tokens this block leans on, so the rules below read the
  way Elementor's template does without restating any value. The `@theme` block
  in `main.css` stays the single source: `ink-900` and `accent-500` already are
  the kit's #1D1D1B and #FFBB00.
*/
.site-footer {
  --fb-ink: var(--color-ink-900);
  --fb-accent: var(--color-accent-500);
  --fb-display: var(--font-display);
  --fb-text: var(--font-sans);

  background: var(--color-white);
  color: var(--fb-ink);
  font-family: var(--fb-text);
  font-size: 16px;
  line-height: 1.5;
}

/* Full-bleed band with the page gutter; the inner element carries the cap. */
.fb-band {
  padding: 0 40px;
}

.fb-inner {
  width: 100%;
  margin: 0 auto;
}

.fb-spacer--top {
  height: 84px;
}

.fb-spacer--bottom {
  height: 108px;
}

/* ---- Brand band ------------------------------------------------------- */

.fb-inner--brand {
  display: flex;
  max-width: 1400px;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.fb-logo {
  display: block;
}

.fb-logo img {
  display: block;
  width: 154px;
  /* The live template pins the scaled height rather than letting it derive. */
  height: 60.581px;
  object-fit: cover;
  object-position: center center;
}

.fb-tagline {
  width: 100%;
  margin: 0;
  font-family: var(--fb-display);
  font-size: 22px;
  font-weight: 700;
  line-height: 44px;
  text-align: center;
}

.fb-socials {
  display: flex;
  margin: 0;
  padding: 0;
  gap: 12px;
  list-style: none;
}

/* Flex rather than inline, so the row is exactly 25px and not a line box. */
.fb-socials li {
  display: flex;
}

.fb-socials a {
  display: flex;
  width: 25px;
  height: 25px;
  align-items: center;
  justify-content: center;
  border-radius: 10%;
  background: var(--color-white);
  color: var(--fb-ink);
}

.fb-socials a:hover {
  color: var(--fb-ink);
  opacity: 0.9;
}

.fb-socials svg {
  width: 25px;
  height: 25px;
  fill: currentColor;
}

/* Closes the band the way the template's trailing 24px spacer does. */
.fb-brand-tail {
  height: 24px;
}

/* ---- Columns ---------------------------------------------------------- */

.fb-columns {
  display: flex;
  max-width: 1328px;
  flex-direction: row;
  gap: 60px;
}

/*
  `width: 20%` against a 60px gap overflows by the gap total, and the default
  shrink resolves it — which is exactly how the columns land on 217.6px at the
  1328px cap. Stating a resolved width instead would drift at other viewports.
*/
.fb-col {
  display: flex;
  width: 20%;
  min-width: 0;
  flex-direction: column;
  flex-shrink: 1;
  gap: 12px;
}

.fb-col--portal {
  gap: 20px;
}

.fb-stack {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.fb-stack--12 {
  gap: 12px;
}

.fb-stack--start {
  align-items: flex-start;
}

.fb-heading {
  margin: 0;
  color: var(--fb-accent);
  font-family: var(--fb-display);
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
}

.fb-text p {
  margin: 0;
}

.fb-text--sm {
  font-size: 13px;
}

.fb-text--strong {
  font-family: var(--fb-display);
  font-weight: 600;
}

.fb-text a {
  color: var(--fb-ink);
  text-decoration: none;
}

/* The live template pins these links, so they don't warm on hover. */
.fb-text a:hover {
  color: var(--fb-ink);
}

.fb-menu ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.fb-menu li:not(:last-child) {
  margin-bottom: 10px;
}

.fb-menu a {
  display: block;
  padding: 0;
  color: var(--fb-ink);
  font-family: var(--fb-display);
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  text-decoration: none;
}

.fb-menu a:hover,
.fb-menu a:focus {
  color: var(--fb-accent);
}

.fb-manage {
  margin: -2px 0 0;
}

.fb-manage a {
  color: var(--fb-ink);
  font-family: var(--fb-display);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all ease-in-out 0.1s;
}

.fb-manage a:hover {
  color: var(--fb-accent);
}

/* ---- Buttons ---------------------------------------------------------- */

/*
  The 11px line-height is the live kit's: the 53.9px height comes from the 14px
  icon plus the 20px padding, not from the label's leading.
*/
.fb-btn {
  display: inline-block;
  border-radius: 4px;
  color: var(--fb-ink);
  font-family: var(--fb-display);
  font-size: 15px;
  font-weight: 700;
  line-height: 11px;
  padding: 20px 24px;
  text-decoration: none;
}

.fb-btn--primary {
  background-color: var(--fb-accent);
}

.fb-btn--secondary {
  /* The live hairline is black at 20%, not one of the `line-*` greys. */
  border: 1px solid color-mix(in srgb, var(--color-black) 20%, transparent);
  background-color: var(--color-white);
}

.fb-btn:hover,
.fb-btn:focus {
  background-color: var(--fb-ink);
  color: var(--color-white);
}

.fb-btn__inner {
  display: flex;
  flex-direction: row-reverse;
  gap: 12px;
}

.fb-btn__icon {
  display: flex;
}

/*
  The arrow tracks `color`, which is the ink at rest and white on hover — the
  live template does the same with a paired `:hover svg { fill: … }` rule. A
  fixed fill on the path would survive the hover and vanish into the dark
  ground, since a declaration on the element beats an inherited one.
*/
.fb-btn__icon svg {
  width: 1em;
  height: auto;
  fill: currentColor;
}

/* ---- Elementor's 768px breakpoint ------------------------------------- */

@media (max-width: 767px) {
  .fb-band {
    padding: 0 20px;
  }

  .fb-tagline {
    line-height: 24px;
  }

  .fb-socials {
    margin-top: 16px;
  }

  .fb-columns {
    flex-wrap: wrap;
    gap: 30px;
  }

  .fb-col {
    width: 100%;
  }

  .fb-spacer--bottom {
    height: 48px;
  }
}
</style>
