const rawSvgs = import.meta.glob('./*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function extractInner(svg: string): string {
  const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
  return match ? match[1].trim() : svg
}

export const socialSvgs: Record<string, string> = Object.fromEntries(
  Object.entries(rawSvgs).map(([path, content]) => [
    path.replace('./', '').replace('.svg', ''),
    extractInner(content),
  ]),
)
