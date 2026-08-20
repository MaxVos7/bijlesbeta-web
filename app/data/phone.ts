/**
 * The site's phone number, defined once.
 *
 * The number is written out here and nowhere else: the `tel:` link, the
 * `wa.me` link and the international form are all derived from the digits of
 * the way it is displayed, so changing it is a one-line edit and a link can
 * never point somewhere its label doesn't.
 *
 * `site.ts` and `legal.ts` both read from here; nothing else should hold a
 * number of its own. This is unrelated to `shared/utils/phone.ts`, which
 * checks the shape of a number a *visitor* typed into a form.
 */

/** The Netherlands. `wa.me` and `tel:` both want the number without its 0. */
const COUNTRY_CODE = '31'

export interface PhoneNumber {
  /** As it is written on the page — `085 820 1900`. */
  display: string
  /** National digits, no separators — `0858201900`. */
  digits: string
  /** `+31858201900`, the shape `tel:` and `wa.me` are built from. */
  international: string
  /** `tel:+31858201900` */
  telHref: string
  /** `https://wa.me/31858201900` */
  whatsappHref: string
}

function definePhoneNumber(display: string): PhoneNumber {
  const digits = display.replace(/\D/g, '')
  const international = `+${COUNTRY_CODE}${digits.replace(/^0/, '')}`

  return {
    display,
    digits,
    international,
    telHref: `tel:${international}`,
    whatsappHref: `https://wa.me/${international.replace('+', '')}`,
  }
}

/**
 * The one number the site shows. It is a WhatsApp Business line, so it is
 * also what the WhatsApp links point at — there is deliberately no second,
 * mobile number any more.
 */
export const phone = definePhoneNumber('085 820 1900')
