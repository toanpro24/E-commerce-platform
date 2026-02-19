/**
 * Pick the translated name from an object based on language.
 * Falls back to the default `name` (Vietnamese).
 */
export function localName(item, lang) {
  if (!item) return "";
  if (lang === "en") return item.name_en || item.name;
  if (lang === "zh") return item.name_zh || item.name;
  return item.name;
}
