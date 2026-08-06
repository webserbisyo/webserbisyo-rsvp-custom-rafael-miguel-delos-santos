/**
 * Music Metadata Parser
 *
 * Extracts display title and artist from a combined music title string.
 * Duplicated logic previously lived in both MusicEffectsSection (inside
 * ClientEventRenderer.tsx) and FloatingMusicBubble.tsx.
 *
 * Supports two formats:
 *   "Title - Artist"
 *   "Title by Artist"
 */

export function parseMusicMeta(title?: string): {
  displayTitle: string;
  displayArtist: string;
} {
  const fallbackTitle = "Our Wedding Song";
  const fallbackArtist = "Wedding Ambience";

  if (!title) {
    return { displayTitle: fallbackTitle, displayArtist: fallbackArtist };
  }

  if (title.includes(" - ")) {
    const parts = title.split(" - ");
    return {
      displayTitle: parts[0].trim(),
      displayArtist: parts[1].trim(),
    };
  }

  if (title.includes(" by ")) {
    const parts = title.split(" by ");
    return {
      displayTitle: parts[0].trim(),
      displayArtist: parts[1].trim(),
    };
  }

  return { displayTitle: title, displayArtist: fallbackArtist };
}
