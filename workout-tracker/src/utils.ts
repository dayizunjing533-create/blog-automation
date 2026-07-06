export function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function uid(): string {
  return crypto.randomUUID()
}

export function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y}/${m}/${d}`
}
