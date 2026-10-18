/** One docent's profile, or a 404 for a slug the roster doesn't carry. */
export default defineEventHandler(async (event) => {
  const tutor = await getTutor(String(getRouterParam(event, 'slug')))
  if (!tutor) throw createError({ statusCode: 404, statusMessage: 'Docent niet gevonden' })
  return tutor
})
