import { legacyRedirects } from "../redirects.mjs";

const target = process.argv[2];

if (!target) {
  console.error("Usage: node scripts/check-redirects.mjs https://preview-url.vercel.app");
  process.exit(1);
}

const base = target.replace(/\/$/, "");

async function follow(url, hops = []) {
  const res = await fetch(url, { redirect: "manual" });
  hops.push(res.status);
  const location = res.headers.get("location");
  if (location && hops.length < 6) {
    return follow(new URL(location, url).href, hops);
  }
  return { finalUrl: url, status: res.status, hops };
}

const cases = Object.entries(legacyRedirects).flatMap(([from, to]) => [
  { from, to },
  { from: `${from}/`, to },
]);

let failures = 0;

for (const { from, to } of cases) {
  const expected = new URL(to, base).href;
  const { finalUrl, status, hops } = await follow(`${base}${from}`);
  const ok = status === 200 && finalUrl.split("#")[0] === expected.split("#")[0];
  if (!ok) failures += 1;
  console.log(
    `${ok ? "OK  " : "FAIL"} ${from}\n     → ${finalUrl} [${hops.join(" → ")}]${ok ? "" : `\n     expected ${expected}`}`,
  );
}

const sitemap = await fetch(`${base}/sitemap-0.xml`).then((r) => r.text());
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

for (const page of pages) {
  const path = new URL(page).pathname;
  const { status, hops } = await follow(`${base}${path}`);
  const ok = status === 200 && hops.length === 1;
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${path} [${hops.join(" → ")}]`);
}

console.log(`\n${cases.length + pages.length} checks, ${failures} failure(s)`);
process.exit(failures > 0 ? 1 : 0);
