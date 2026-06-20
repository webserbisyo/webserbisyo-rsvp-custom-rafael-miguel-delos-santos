import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

function cleanUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

const slug = process.argv[2]?.trim();
const apiBaseUrl = cleanUrl(process.env.NEXT_PUBLIC_WEBSERBISYO_API_URL || "https://webserbisyo.com");

if (!slug) {
  console.error("Usage: npm run prefetch:event -- <event-slug>");
  process.exit(1);
}

const url = `${apiBaseUrl}/api/public/events/${encodeURIComponent(slug)}`;

try {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  const body = await response.text();

  if (!response.ok) {
    console.error(`Prefetch failed: ${response.status} ${response.statusText}`);
    console.error(body);
    process.exit(1);
  }

  const directory = join(process.cwd(), ".webserbisyo");
  const target = join(directory, "event.snapshot.json");
  await mkdir(directory, { recursive: true });
  await writeFile(target, `${body}\n`, "utf8");
  console.log(`Wrote ${target}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Prefetch failed.");
  process.exit(1);
}
