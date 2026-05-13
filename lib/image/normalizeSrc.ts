/** Make image URLs safe for `<img src>` / Next `Image` (protocol-relative, trim). */
export function normalizeImageSrc(raw: string | undefined | null): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  if (s.startsWith("//")) return `https:${s}`;
  return s;
}
