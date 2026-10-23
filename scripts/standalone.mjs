import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve("dist");
let html = await readFile(resolve(root, "index.html"), "utf8");
const script = /<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/;
const css = /<link\b[^>]*\bhref="([^"]+\.css)"[^>]*>/;
const jsMatch = html.match(script),
  cssMatch = html.match(css);
if (!jsMatch || !cssMatch)
  throw Error("Očekáván jeden JS a jeden CSS vstup v dist/index.html.");
const assetPath = (p) =>
  resolve(root, p.replace(/^\.\//, "").replace(/^\//, ""));
const js = await readFile(assetPath(jsMatch[1]), "utf8"),
  style = await readFile(assetPath(cssMatch[1]), "utf8");
if (/\b(?:import|export)\s+(?:[^;]*?\s+from\s+)?["']\.\//.test(js))
  throw Error("Samostatná stránka nesmí vyžadovat externí JS moduly.");
html = html
  .replace(
    script,
    () =>
      `<script type="module">${js.replace(/<\/script/gi, "<\\/script")}</script>`,
  )
  .replace(
    css,
    () => `<style>${style.replace(/<\/style/gi, "<\\/style")}</style>`,
  );
await writeFile(resolve(root, "numerologie-test.html"), html);
console.log("Samostatná aplikace: dist/numerologie-test.html");
