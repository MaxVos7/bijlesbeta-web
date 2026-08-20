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
 * unset, submissions are logged in development so the forms stay testable, and
 * in production the hand-off is reported as failed rather than refused — the
 * route then mails the office the submission instead of losing it. Nothing in
 * here throws; see `PortalResult`.
 */

type PortalConfig = { url: string, key: string }

/**
 * What happened to a hand-off.
 *
 * Nothing here throws any more. A failed hand-off used to end the request with
 * a 502 and the submission with it; now the route hears about it, mails the
 * office the whole submission marked `NIET VERWERKT`, and only turns it into
 * an error for the visitor if that copy could not be sent either. `reason` is
 * for the office and the log — it is never shown to the visitor.
 */
export type PortalResult =
  | { ok: true, forwarded: boolean }
  | { ok: false, reason: string }

/** The config, or the reason there isn't one. */
function portalConfig(
  event: H3Event,
  path: string,
  payload: unknown,
): { ok: true, config: PortalConfig } | { ok: true, config: null } | { ok: false, reason: string } {
  const config = useRuntimeConfig(event)

  // Coerced: Nitro's `destr` turns an all-digit secret into a number, and it
  // goes out as an HTTP header.
  const portalApiUrl = String(config.portalApiUrl ?? '')
  const portalSecretKey = String(config.portalSecretKey ?? '')

  if (portalApiUrl && portalSecretKey) {
    return { ok: true, config: { url: portalApiUrl, key: portalSecretKey } }
  }

  if (import.meta.dev) {
    console.info(
      `[form] ${path} (NUXT_PORTAL_API_URL / NUXT_PORTAL_SECRET_KEY not set, not forwarded)`,
      payload,
    )
    return { ok: true, config: null }
  }

  // Not a throw any more. An unconfigured portal on a live deploy is the one
  // outage that lasts until somebody notices, so it is exactly the case the
  // office copy exists for.
  return { ok: false, reason: 'de koppeling met het portaal is niet geconfigureerd' }
}

/**
 * Turns a failed request into a sentence the office can act on.
 *
 * A 422 is ours, not the visitor's: it means the portal was reachable and
 * refused what we sent. Naming the fields it complained about is what makes
 * the difference between "something went wrong" and a five-minute fix.
 */
function describe(error: any): string {
  const status = error?.status ?? error?.statusCode
  const message = error?.data?.message

  if (status === 401) return 'het portaal weigerde onze sleutel (401)'
  if (status === 422) {
    const fields = Object.keys(error?.data?.errors ?? {})
    const detail = fields.length ? ` (${fields.join(', ')})` : message ? ` (${message})` : ''
    return `het portaal wees de gegevens af${detail}`
  }
  if (status) return `het portaal antwoordde met een fout (${status})`

  return `het portaal was niet bereikbaar (${error?.message ?? 'onbekende fout'})`
}

/** The same, for a response we inspected rather than an error we caught. */
function describeResponse(response: {
  status: number
  headers: Headers
  _data?: any
}): string {
  if (response.status >= 300 && response.status < 400) {
    return `het portaal stuurde ons door naar ${response.headers.get('location') ?? 'een andere pagina'}`
  }
  if (response.status === 401) return 'het portaal weigerde onze sleutel (401)'
  if (response.status === 422) {
    const fields = Object.keys(response._data?.errors ?? {})
    const detail = fields.length
      ? ` (${fields.join(', ')})`
      : response._data?.message ? ` (${response._data.message})` : ''
    return `het portaal wees de gegevens af${detail}`
  }
  return `het portaal antwoordde met een fout (${response.status})`
}

/**
 * Posts a JSON payload to one of the external-registration endpoints.
 *
 * Reports rather than throws: see `PortalResult`. A 422 is logged in full,
 * because it means our mapping sent something the portal wouldn't take, which
 * is a bug on this side.
 */
export async function postToPortal(
  event: H3Event,
  path: string,
  payload: Record<string, unknown>,
): Promise<PortalResult> {
  const configured = portalConfig(event, path, payload)
  if (!configured.ok) return configured
  if (!configured.config) return { ok: true, forwarded: false }

  try {
    /*
      The status is checked by hand rather than left to ofetch, which follows
      redirects and then resolves — so a 302 reads as a delivery. These routes
      live in `routes/auth.php` inside a `guest` middleware group, so a
      redirect is a shape they really can return, and treating one as success
      would thank the visitor for a submission nobody received.
    */
    const response = await $fetch.raw(path, {
      baseURL: configured.config.url,
      method: 'POST',
      body: payload,
      headers: { Accept: 'application/json', 'X-Secret-Key': configured.config.key },
      timeout: 15_000,
      redirect: 'manual',
      ignoreResponseError: true,
    })

    if (response.status < 200 || response.status >= 300) {
      console.error(`[form] posting ${path} to the portal failed`, {
        status: response.status,
        location: response.headers.get('location'),
        // The portal returns { message, errors } on a 422 — both matter here.
        body: response._data,
      })

      return { ok: false, reason: describeResponse(response) }
    }

    return { ok: true, forwarded: true }
  }
  catch (error: any) {
    console.error(`[form] posting ${path} to the portal failed`, {
      status: error?.status ?? error?.statusCode,
      body: error?.data,
    })

    return { ok: false, reason: describe(error) }
  }
}

/**
 * Uploads a CV and returns the URL the portal can fetch it from.
 *
 * `register-external-applicant` takes `resume_url` and hands it to a job that
 * does a plain `Http::get`, so the file has to live somewhere public before
 * the application is posted. Gravity Forms had WordPress host it; this app
 * cannot (no runtime filesystem writes), so the portal takes the upload —
 * `ExternalResumeController` parks it on a private disk and hands back a
 * signed URL good for seven days.
 *
 *   POST /upload-external-resume
 *   X-Secret-Key: <the same shared key>
 *   multipart/form-data, one `file` part (pdf/doc/docx, <= 10 MB)
 *   201 -> { "url": "https://…" }
 *
 * Reports rather than throws. A failed upload means the application cannot be
 * posted — the portal requires `resume_url` — but the file is still in memory
 * at that point, so the route attaches it to the office copy instead. That is
 * the only remaining copy of it, and it is why this must not end the request.
 */
export async function uploadResume(
  event: H3Event,
  // `Uint8Array` rather than `Buffer`, which isn't in this project's types —
  // h3 hands back a Buffer and it satisfies both this and `Blob`.
  file: { data: Uint8Array, filename: string, type: string },
): Promise<{ ok: true, url: string | null } | { ok: false, reason: string }> {
  const path = '/upload-external-resume'
  const configured = portalConfig(event, path, {
    filename: file.filename,
    bytes: file.data.length,
  })
  if (!configured.ok) return configured
  if (!configured.config) return { ok: true, url: null }

  const body = new FormData()
  // h3 hands back a Buffer, which is a valid BlobPart at runtime; its type is
  // `Uint8Array<ArrayBufferLike>`, which TS won't narrow to `ArrayBufferView<ArrayBuffer>`.
  body.append('file', new Blob([file.data as BlobPart], { type: file.type }), file.filename)

  try {
    const response = await $fetch.raw<{ url?: string }>(path, {
      baseURL: configured.config.url,
      method: 'POST',
      body,
      headers: { Accept: 'application/json', 'X-Secret-Key': configured.config.key },
      timeout: 30_000,
      redirect: 'manual',
      ignoreResponseError: true,
    })

    if (response.status < 200 || response.status >= 300) {
      console.error('[form] uploading the CV to the portal failed', {
        status: response.status,
        location: response.headers.get('location'),
        body: response._data,
      })

      return { ok: false, reason: `het CV kon niet worden geupload — ${describeResponse(response)}` }
    }

    // A 2xx that isn't the documented body is still a failure: `resume_url` is
    // required, and posting the application without it loses the CV.
    if (!response._data?.url) {
      return { ok: false, reason: 'het uploaden van het CV leverde geen URL op' }
    }

    return { ok: true, url: response._data.url }
  }
  catch (error: any) {
    console.error('[form] uploading the CV to the portal failed', {
      status: error?.status ?? error?.statusCode,
      body: error?.data,
      message: error?.message,
    })

    return { ok: false, reason: `het CV kon niet worden geupload — ${describe(error)}` }
  }
}

/**
 * Subject ids, from the portal's `SubjectsSeeder`. The endpoints take
 * `subjects` as a comma-separated list of numeric ids and discard anything
 * non-numeric, so a name that isn't in this map is dropped *silently* — the
 * submission still succeeds, just without the subjects on it.
 *
 * That is why the two split maths are keyed twice. The signup wizard labels
 * them `Wiskunde A` / `Wiskunde B`; `/werken-bij` uses the portal's own
 * `Wiskunde A/C` / `Wiskunde B/D`, which are the live site's labels on that
 * form and shouldn't be reworded for our convenience. Both spellings are
 * accepted here rather than either form being changed.
 *
 * Add a new subject to this map *and* to the portal's seeder, or it is dropped
 * without an error.
 */
const SUBJECT_IDS: Record<string, number> = {
  'Wiskunde A': 1,
  'Wiskunde A/C': 1,
  'Wiskunde B': 2,
  'Wiskunde B/D': 2,
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

/**
 * The payload with every key present, blanks included.
 *
 * This used to be `compact`, which dropped empty values "so the portal's
 * `nullable` rules see absent, not ''". That was backwards, and it took
 * `/aanmelden` down in production: a visitor who left the optional
 * contactpersoon phone number blank had no `account_phone_number` key sent at
 * all, and `RegisteredUserController::storeExternalFull` reads that one
 * straight out of `$validator->validated()` with no `??` behind it. An
 * undefined array key is an `ErrorException` under Laravel's error handler, so
 * the endpoint answered 500 and the aanmelding only existed in the office copy.
 *
 * An empty string was never the problem it was written to avoid. The portal
 * runs `ConvertEmptyStringsToNull` in its global middleware, so `''` arrives
 * there *as* null and every `nullable` rule passes — while the key stays in
 * `validated()`, which is the part the controller depends on. That is also why
 * the Gravity Forms webhook never hit this: it posts every field of the form,
 * every time, and so do we now.
 *
 * `undefined` still goes, and becomes an explicit `null` rather than a missing
 * key: it means a value we decided not to send (`levelId('different')` has no
 * id to send), and JSON would drop the key silently otherwise.
 */
export function portalPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value ?? null]),
  )
}

