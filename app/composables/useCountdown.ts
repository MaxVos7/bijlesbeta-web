/**
 * A live countdown to `end` (an ISO timestamp with its offset), ticking once
 * a second.
 *
 * It only runs in the browser: rendered on the server it would be stale by
 * the time it hydrated, and the mismatch would replace it anyway. Until the
 * clock is mounted `parts` is `undefined`, so callers render a placeholder of
 * the same size rather than a time that is already wrong.
 */
export function useCountdown(end: string) {
  const endMs = new Date(end).getTime()
  const parts = ref<{ days: number, hours: number, minutes: number, seconds: number }>()
  const now = ref(0)
  const ended = computed(() => parts.value !== undefined && endMs <= now.value)

  let timer: ReturnType<typeof setInterval> | undefined

  function tick() {
    now.value = Date.now()
    const diff = Math.max(0, endMs - now.value)
    parts.value = {
      days: Math.floor(diff / 864e5),
      hours: Math.floor((diff % 864e5) / 36e5),
      minutes: Math.floor((diff % 36e5) / 6e4),
      seconds: Math.floor((diff % 6e4) / 1e3),
    }
    if (diff === 0) clearInterval(timer)
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  return { parts, ended }
}
