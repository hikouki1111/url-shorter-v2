export function parseOrNull(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.href
  } catch {
    return null
  }
}

export function randomID(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from(crypto.getRandomValues(new Uint8Array(length))).map((n)=>chars[n%chars.length]).join('')
}