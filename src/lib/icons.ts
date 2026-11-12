const icons = import.meta.glob<string>('../icons/*.svg', { query: '?raw', import: 'default', eager: true });

/** The markup of an icon in src/icons, to be set inline. */
export function icon(name: string) {
  const svg = icons[`../icons/${name}.svg`];
  if (!svg) throw new Error(`no icon named "${name}" in src/icons`);
  return svg;
}
