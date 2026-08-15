import type { H3Event } from 'h3'

/**
 * Client for the portal's external-registration endpoints — the ones the
 * Gravity Forms webhooks on bijlesbeta.nl post to today:
 *
 *   POST /register-external-full       the aanmeld wizard
 *   POST /register-external-applicant  the docent application
 *
 * These are not the `/api/...` routes `forwardToLaravel` talks to. They
 * authenticate with a shared `X-Secret-Key` header rather than a bearer token,
 * and they answer 201 on success, 401 on a bad key and 422 on validation.
 *
 * Configure with NUXT_PORTAL_API_URL + NUXT_PORTAL_SECRET_KEY. With either
 * unset, submissions are logged in development so the forms stay testable and
 * refused in production, the same contract `forwardToLaravel` keeps — a broken
 * hand-off must never look like a success.
 */

/** What the visitor is told when the hand-off fails. Never the upstream error. */
const UNAVAILABLE
  = 'Het formulier is tijdelijk niet beschikbaar. Bel of mail ons, dan helpen we je direct.'
const FAILED
  = 'We konden je aanmelding niet versturen. Probeer het zo nog eens, of bel ons even.'

type PortalConfig = { url: string, key: string }

/** Returns the config, or throws the 503 the visitor should see. */
function portalConfig(event: H3Event, path: string, payload: unknown): PortalConfig | null {
  const { portalApiUrl, portalSecretKey } = useRuntimeConfig(event)

  if (portalApiUrl && portalSecretKey) {
    return { url: portalApiUrl, key: portalSecretKey }
  }

  if (import.meta.dev) {
    console.info(
      `[form] ${path} (NUXT_PORTAL_API_URL / NUXT_PORTAL_SECRET_KEY not set, not forwarded)`,
      payload,
    )
    return null
  }

  throw createError({
    statusCode: 503,
    statusMessage: 'Portal endpoint not configured',
    data: { message: UNAVAILABLE },
  })
}

/**
 * Posts a JSON payload to one of the external-registration endpoints.
 *
 * A 422 from the portal means our mapping sent something it wouldn't take —
 * that is our bug, not the visitor's, so it is logged in full and reported as
 * a generic failure rather than surfaced as field errors the form can't
 * attach to anything.
 */
export async function postToPortal(
  event: H3Event,
  path: string,
  payload: Record<string, unknown>,
) {
  const config = portalConfig(event, path, payload)
  if (!config) return { ok: true, forwarded: false }

  try {
    await $fetch(path, {
      baseURL: config.url,
      method: 'POST',
      body: payload,
      headers: { Accept: 'application/json', 'X-Secret-Key': config.key },
      timeout: 15_000,
    })

    return { ok: true, forwarded: true }
  }
  catch (error: any) {
    console.error(`[form] posting ${path} to the portal failed`, {
      status: error?.status ?? error?.statusCode,
      // The portal returns { message, errors } on a 422 — both matter here.
      body: error?.data,
    })

    throw createError({
      statusCode: 502,
      statusMessage: 'Upstream request failed',
      data: { message: FAILED },
    })
  }
}

/**
 * Uploads a CV and returns the URL the portal can fetch it from.
 *
 * `register-external-applicant` takes `resume_url` and hands it to a job that
 * does a plain `Http::get`, so the file has to live somewhere public before
 * the application is posted. Gravity Forms had WordPress host it; this app
 * cannot (no runtime filesystem writes), so the portal takes the upload.
 *
 * Expected contract, which the portal side has to provide:
 *
 *   POST /upload-external-resume
 *   X-Secret-Key: <the same shared key>
 *   multipart/form-data, one `file` part
 *   201/200 -> { "url": "https://…" }   publicly fetchable
 *
 * Anything else is treated as a failure and the application is not sent, so a
 * candidate is never recorded without the CV they attached.
 */
export async function uploadResume(
  event: H3Event,
  // `Uint8Array` rather than `Buffer`, which isn't in this project's types —
  // h3 hands back a Buffer and it satisfies both this and `Blob`.
  file: { data: Uint8Array, filename: string, type: string },
) {
  const path = '/upload-external-resume'
  const config = portalConfig(event, path, { filename: file.filename, bytes: file.data.length })
  if (!config) return null

  const body = new FormData()
  // h3 hands back a Buffer, which is a valid BlobPart at runtime; its type is
  // `Uint8Array<ArrayBufferLike>`, which TS won't narrow to `ArrayBufferView<ArrayBuffer>`.
  body.append('file', new Blob([file.data as BlobPart], { type: file.type }), file.filename)

  try {
    const response = await $fetch<{ url?: string }>(path, {
      baseURL: config.url,
      method: 'POST',
      body,
      headers: { Accept: 'application/json', 'X-Secret-Key': config.key },
      timeout: 30_000,
    })

    if (!response?.url) {
      throw new Error('upload succeeded but returned no url')
    }

    return response.url
  }
  catch (error: any) {
    console.error('[form] uploading the CV to the portal failed', {
      status: error?.status ?? error?.statusCode,
      body: error?.data,
      message: error?.message,
    })

    throw createError({
      statusCode: 502,
      statusMessage: 'Resume upload failed',
      data: {
        message:
          'We konden je CV niet uploaden. Probeer het zo nog eens, of mail je sollicitatie naar ons.',
      },
    })
  }
}

/**
 * Subject ids, from the portal's `SubjectsSeeder`. The endpoints take
 * `subjects` as a comma-separated list of numeric ids and discard anything
 * non-numeric, so a name that isn't in this map is dropped rather than sent.
 *
 * Both forms label the two split maths as `Wiskunde A` / `Wiskunde B`, which
 * are the portal's `Wiskunde A/C` and `Wiskunde B/D`.
 */
const SUBJECT_IDS: Record<string, number> = {
  'Wiskunde A': 1,
  'Wiskunde B': 2,
  'Wiskunde': 3,
  'Natuurkunde': 4,
  'Scheikunde': 5,
  'NaSk': 6,
}

/** Maps subject labels onto the comma-separated id list the portal expects. */
export function subjectIds(subjects: readonly string[]): string {
  const ids = subjects
    .map((subject) => SUBJECT_IDS[subject.trim()])
    .filter((id): id is number => typeof id === 'number')

  return [...new Set(ids)].join(',')
}

/**
 * Level ids come straight from the wizard, whose option values are already the
 * portal's `levels.id` (1 vmbo, 2 havo, 3 vwo, 4 basisschool, 5 hbo). The one
 * exception is `different` — "Anders" — which the portal has no id for and
 * validates as `exists:levels,id`, so it is omitted and the visitor's own
 * wording is carried in the free-text note instead.
 */
export function levelId(level: string): number | undefined {
  const id = Number(level)
  return Number.isInteger(id) && id > 0 ? id : undefined
}

/** Drops empty values so the portal's `nullable` rules see absent, not ''. */
export function compact(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== '' && value !== undefined && value !== null),
  )
}
