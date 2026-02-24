export function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '')
  if (c.length === 3)
    c = c
      .split('')
      .map((x) => x + x)
      .join('')
  const num = parseInt(c, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r},${g},${b},${alpha})`
}
