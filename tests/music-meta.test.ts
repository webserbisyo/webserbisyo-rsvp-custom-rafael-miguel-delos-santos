import test from "node:test";
import assert from "node:assert";
import { parseMusicMeta } from "../src/client/utils/music-meta";

test("parseMusicMeta: returns empty displayArtist when no delimiter is present", () => {
  const result = parseMusicMeta("Perfect");
  assert.strictEqual(result.displayTitle, "Perfect");
  assert.strictEqual(result.displayArtist, "");
  assert.notStrictEqual(result.displayArtist, "Wedding Ambience");
});

test("parseMusicMeta: parses title and artist with ' - ' delimiter", () => {
  const result = parseMusicMeta("Perfect - Ed Sheeran");
  assert.strictEqual(result.displayTitle, "Perfect");
  assert.strictEqual(result.displayArtist, "Ed Sheeran");
});

test("parseMusicMeta: parses title and artist with ' by ' delimiter", () => {
  const result = parseMusicMeta("A Thousand Years by Christina Perri");
  assert.strictEqual(result.displayTitle, "A Thousand Years");
  assert.strictEqual(result.displayArtist, "Christina Perri");
});

test("parseMusicMeta: handles missing or empty title safely", () => {
  const emptyResult = parseMusicMeta("");
  assert.strictEqual(emptyResult.displayTitle, "Our Wedding Song");
  assert.strictEqual(emptyResult.displayArtist, "");

  const undefinedResult = parseMusicMeta(undefined);
  assert.strictEqual(undefinedResult.displayTitle, "Our Wedding Song");
  assert.strictEqual(undefinedResult.displayArtist, "");
});

test("contract: MusicSection uses playButtonLabel and semantic disc center/icon CSS classes", async () => {
  const fs = await import("node:fs/promises");
  const musicTsx = await fs.readFile(
    new URL("../src/client/sections/MusicSection.tsx", import.meta.url),
    "utf-8"
  );
  const css = await fs.readFile(
    new URL("../src/client/styles/client-theme.css", import.meta.url),
    "utf-8"
  );

  assert.ok(
    musicTsx.includes("musicEffects.playButtonLabel"),
    "MusicSection.tsx must reference musicEffects.playButtonLabel"
  );
  assert.ok(
    musicTsx.includes("wedding-music-disc-center"),
    "MusicSection.tsx must use .wedding-music-disc-center class"
  );
  assert.ok(
    musicTsx.includes("wedding-music-disc-icon"),
    "MusicSection.tsx must use .wedding-music-disc-icon class"
  );
  assert.ok(
    css.includes(".wedding-music-disc-icon"),
    "client-theme.css must define .wedding-music-disc-icon rule"
  );
});
