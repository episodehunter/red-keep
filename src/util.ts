export function safeStringSplit(str: string | null | undefined, key: string): string[] {
  if (!str || !str.split) {
    return []
  }
  return str.split(key)
}
