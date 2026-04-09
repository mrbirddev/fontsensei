import {readFileSync} from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {locales} from "@nextutils/config";
import {flattenLocale} from "@nextutils/i18n/flattenLocale";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const orderedLocales = locales.map((l) => l.locale);

async function loadFontsenseiFlat(locale: string): Promise<Record<string, string>> {
  const faqPath = path.join(__dirname, "../locales", locale, "indexFaq.md");
  const [{default: landingMsg}, {default: tagValueMsg}, {default: tagDescMsg}] =
    await Promise.all([
      import(`../locales/${locale}/landingMsg.ts`),
      import(`../locales/${locale}/tagValueMsg.ts`),
      import(`../locales/${locale}/tagDescMsg.ts`),
    ]);
  const indexFaq = readFileSync(faqPath, "utf-8");
  return flattenLocale({
    landingMsg,
    tagDescMsg,
    indexFaq,
    tagValueMsg,
  });
}

async function loadNextutilsFlat(locale: string): Promise<Record<string, string>> {
  const mod = await import(`../../@nextutils/locales/${locale}/index.ts`);
  return flattenLocale(mod.default);
}

function assertSameKeys(
  label: string,
  refKeys: string[],
  loc: string,
  keys: string[]
) {
  const refSet = new Set(refKeys);
  const set = new Set(keys);
  const missing = refKeys.filter((k) => !set.has(k));
  const extra = keys.filter((k) => !refSet.has(k));
  if (missing.length > 0 || extra.length > 0) {
    console.error(
      `[validateLocaleMessages] ${label} locale "${loc}" vs "${orderedLocales[0]}":\n` +
        `  missing (${missing.length}): ${missing.slice(0, 24).join(", ")}${
          missing.length > 24 ? " …" : ""
        }\n` +
        `  extra (${extra.length}): ${extra.slice(0, 24).join(", ")}${
          extra.length > 24 ? " …" : ""
        }`
    );
    process.exit(1);
  }
}

async function validateNamespace(
  label: string,
  load: (locale: string) => Promise<Record<string, string>>
) {
  const refLocale = orderedLocales[0]!;
  const refFlat = await load(refLocale);
  const refKeyList = Object.keys(refFlat).sort();

  for (const loc of orderedLocales.slice(1)) {
    const flat = await load(loc);
    const keyList = Object.keys(flat).sort();
    assertSameKeys(label, refKeyList, loc, keyList);
  }

  console.log(
    `[validateLocaleMessages] ${label}: OK (${orderedLocales.length} locales × ${refKeyList.length} keys)`
  );
}

async function main() {
  await validateNamespace("fontsensei", loadFontsenseiFlat);
  await validateNamespace("nextutils", loadNextutilsFlat);
}

void main();
