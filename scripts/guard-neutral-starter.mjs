import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const runtimeDirs = ["src"];
const docFiles = [
  "AGENTS.md",
  "README.md",
  "docs/DATA_CONTRACT.md",
  "docs/PUBLIC_API.md",
  "docs/WEBSITE_FLOW.md",
  "docs/PREVIEW_INTEGRATION.md",
  "docs/DO_NOT_BREAK.md",
  "docs/CLIENT_CUSTOMIZATION_RULES.md",
  "docs/CUSTOMIZATION_LAYER.md",
  "docs/AI_PROMPTS.md",
  "docs/AI_QUICKREF.md",
  "docs/CLIENT_GUIDE.md",
  "docs/SECTION_MAP.md",
  "docs/QA_CHECKLIST.md"
];

const forbiddenThemeTerms = [
  "Tagaytay Garden Classic",
  "Tagaytay",
  "Alex Lisa",
  "Alex & Lisa",
  "alex-lisa",
  "The Garden Hall",
  "Formal garden attire",
  "client-specific default theme"
];

const forbiddenEnvNames = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "RESEND_API_KEY",
  "PAYMENT_PROVIDER_SECRET",
  "ADMIN_SECRET"
];

// src/client/** is allowed as a path. This guard must continue to
// block backend ownership, removed RSVP routes, and fake RSVP success patterns
// everywhere, including any future client-boundary files.
const runtimeForbiddenPatterns = [
  "rsvpEmbedUrl",
  "rsvpUrl",
  "Continue to RSVP Form",
  "official WebSerbisyo RSVP route",
  "webserbisyo:rsvp-embed:resize",
  "<iframe",
  "postMessage",
  "/r/${eventSlug}/rsvp",
  "/r/[slug]/rsvp",
  "/r/[slug]/rsvp/embed",
  "${apiBaseUrl}/r/${eventSlug}/rsvp",
  "fake RSVP success",
  "simulated RSVP success"
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(path));
      continue;
    }
    if (/\.(css|json|mjs|js|jsx|ts|tsx|md)$/.test(entry.name)) files.push(path);
  }

  return files;
}

function relative(path) {
  return path.replace(`${root}/`, "");
}

const failures = [];

for (const dir of runtimeDirs) {
  for (const file of await walk(join(root, dir))) {
    const content = await readFile(file, "utf8");
    for (const term of forbiddenThemeTerms) {
      if (content.includes(term)) failures.push(`${relative(file)}: contains "${term}"`);
    }
    for (const term of forbiddenEnvNames) {
      if (content.includes(term)) failures.push(`${relative(file)}: contains forbidden env name "${term}"`);
    }
    for (const pattern of runtimeForbiddenPatterns) {
      if (content.includes(pattern)) failures.push(`${relative(file)}: contains removed RSVP/runtime pattern "${pattern}"`);
    }
  }
}

const appPagePath = join(root, "src", "app", "page.tsx");
const appPage = await readFile(appPagePath, "utf8");

for (const term of ["SiteShell", "SiteHeader", "SiteFooter", "SectionRenderer"]) {
  if (appPage.includes(term)) failures.push(`src/app/page.tsx: default runtime imports or uses ${term}`);
}

for (const pattern of ["sticky top-0", "min-h-[54vh]", "min-h-[60vh]", "bg-terracotta text-white"]) {
  if (appPage.includes(pattern)) failures.push(`src/app/page.tsx: contains landing-page runtime pattern "${pattern}"`);
}

const platformRendererPath = join(root, "src", "components", "platform", "EventWebsiteRenderer.tsx");
const platformRenderer = await readFile(platformRendererPath, "utf8");
const platformIconsPath = join(root, "src", "components", "platform", "platform-icons.tsx");
const platformIcons = await readFile(platformIconsPath, "utf8");
const rsvpHelperPath = join(root, "src", "lib", "rsvp-url.ts");
const rsvpHelper = await readFile(rsvpHelperPath, "utf8");

for (const term of ["event-preview-section", "event-preview-section-anchor", "data-preview-section"]) {
  if (!platformRenderer.includes(term)) failures.push(`src/components/platform/EventWebsiteRenderer.tsx: missing ${term}`);
}

for (const term of ['id={sectionKey === "rsvp_form" ? RSVP_SECTION_ID : undefined}', 'id={RSVP_FORM_ID}']) {
  if (!platformRenderer.includes(term)) failures.push(`src/components/platform/EventWebsiteRenderer.tsx: missing inline RSVP anchor pattern "${term}"`);
}

if (!platformIcons.includes("lucide-react")) {
  failures.push("src/components/platform/platform-icons.tsx: must own the lucide-react import");
}

if (platformRenderer.includes("lucide-react")) {
  failures.push("src/components/platform/EventWebsiteRenderer.tsx: import icons from platform-icons.tsx, not lucide-react");
}

for (const term of [
  "PublicRsvpResponseForm",
  "submitRsvpResponseAction",
  "onSubmit",
  'type="submit"',
  "@/server/",
  "@/server",
  "server/actions",
  "server/queries"
]) {
  if (platformRenderer.includes(term)) failures.push(`src/components/platform/EventWebsiteRenderer.tsx: contains forbidden RSVP/backend pattern "${term}"`);
}

for (const term of ["PublicRsvpResponseForm", "submitRsvpResponseAction", "@supabase/", "@supabase"]) {
  for (const file of await walk(join(root, "src"))) {
    const content = await readFile(file, "utf8");
    if (content.includes(term)) failures.push(`${relative(file)}: contains forbidden RSVP/backend pattern "${term}"`);
  }
}

for (const term of ["RSVP_SECTION_ID", "RSVP_FORM_ID", "buildRsvpSectionHref"]) {
  if (!rsvpHelper.includes(term)) failures.push(`src/lib/rsvp-url.ts: missing inline RSVP helper "${term}"`);
}

if (rsvpHelper.includes("/rsvp") || rsvpHelper.includes("/r/")) {
  failures.push("src/lib/rsvp-url.ts: must not build removed platform RSVP routes");
}

for (const file of docFiles) {
  const content = await readFile(join(root, file), "utf8");

  if (file === "docs/WEBSITE_FLOW.md") {
    for (const phrase of ["inline RSVP", "#rsvp", "#rsvp-form"]) {
      if (!content.toLowerCase().includes(phrase.toLowerCase())) {
        failures.push(`docs/WEBSITE_FLOW.md: missing required RSVP guidance "${phrase}"`);
      }
    }
  }
}

const localRsvpRoutePath = join(root, "src", "app", "rsvp", "page.tsx");
try {
  await readFile(localRsvpRoutePath, "utf8");
} catch {
  failures.push("src/app/rsvp/page.tsx: missing approved local dedicated RSVP page");
}

if (failures.length) {
  console.error("Neutral starter guard failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Neutral starter guard passed.");
