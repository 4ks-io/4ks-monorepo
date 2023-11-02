export function normalizeForURL(s: string | undefined) {
  if (!s) {
    // todo: i18n
    return 'recipe-title';
  }
  // Convert i18n characters like é, ü, etc. to their base
  const normalizedStr = s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Replace spaces with hyphens, remove special characters, and convert to lowercase
  return normalizedStr.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
}
