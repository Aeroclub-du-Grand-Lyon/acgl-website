// Syncs the site logos from design/logo and generates the favicon set.
// Run with: node scripts/generate-favicons.mjs
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const designDir = join(root, "design", "logo");
const source = join(publicDir, "logo-square.png");
const background = { r: 255, g: 255, b: 255, alpha: 1 };

// Circle logo, used as-is for the header, footer and SVG favicon.
const circleSvg = await readFile(join(designDir, "cercle", "logo-cercle.svg"), "utf8");
await writeFile(join(publicDir, "logo-square.svg"), circleSvg);
console.log("wrote logo-square.svg");

// Vertical logo is displayed on navy backgrounds: switch the text group to white.
const verticalSvg = await readFile(join(designDir, "vertical", "logo-vertical.svg"), "utf8");
const textGroup = /<g\s+id="g3-9"[\s\S]*?<\/g>/;
if (!textGroup.test(verticalSvg)) throw new Error("text group g3-9 not found in logo-vertical.svg");
const whiteVerticalSvg = verticalSvg.replace(textGroup, (group) => group.replaceAll("#04205a", "#ffffff"));
await writeFile(join(publicDir, "logo-vertical.svg"), whiteVerticalSvg);
console.log("wrote logo-vertical.svg (white text)");

await sharp(Buffer.from(circleSvg), { density: 300 }).resize(781, 781).png().toFile(source);
console.log("wrote logo-square.png (781x781)");

const pngTargets = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

const renderPng = (size) =>
  sharp(source)
    .resize(size, size, { fit: "contain", background })
    .flatten({ background })
    .png()
    .toBuffer();

const buildIco = (entries) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = [];
  const images = [];
  for (const { size, data } of entries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    dir.push(entry);
    images.push(data);
    offset += data.length;
  }
  return Buffer.concat([header, ...dir, ...images]);
};

for (const { name, size } of pngTargets) {
  const buf = await renderPng(size);
  await writeFile(join(publicDir, name), buf);
  console.log(`wrote ${name} (${size}x${size})`);
}

const icoSizes = [16, 32, 48];
const icoEntries = [];
for (const size of icoSizes) {
  icoEntries.push({ size, data: await renderPng(size) });
}
await writeFile(join(publicDir, "favicon.ico"), buildIco(icoEntries));
console.log(`wrote favicon.ico (${icoSizes.join(", ")})`);
