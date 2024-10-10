/*
# To run this script
  npx tsx merge.ts

# To get source data

  JSON.stringify([...document.querySelectorAll('[href]')].filter(n => n.href && n.href.includes('specimen')).map(n => [n.innerText, n.href]))

# Generate tags file from specimen array

  function extractFamily(url) {
      // Create a URL object
      const urlObj = new URL(url);

      // Get the pathname and remove the leading '/specimen/'
      const fontPath = urlObj.pathname.replace('/specimen/', '');

      // Replace '+' with spaces
      const fontName = fontPath.replace(/\+/g, ' ');

      return fontName;
  }
  JSON.stringify(Object.fromEntries(zhcn.map(n => [extractFamily(n[1]), []])), null, 2)
 */


import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
import {uniq} from "lodash-es";
import {tagToUrlSlug} from "../utils";
type FontData = Record<string, string[] | undefined>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const googleCsvFilePath = path.join(__dirname, './raw/googleFonts/families.csv');
const jsonFilePath = path.join(__dirname, './raw/fontLibrary/families.json');
const tagsJapanesePath = path.join(__dirname, './raw/fontSensei/tags-japanese.json');
const tagsChineseSimplifiedPath = path.join(__dirname, './raw/fontSensei/tags-chinese-simplified.json');
const tagsChineseTraditionalPath = path.join(__dirname, './raw/fontSensei/tags-chinese-traditional.json');
const tagsKoreanPath = path.join(__dirname, './raw/fontSensei/tags-korean.json');
// output file names
const outputDirWithSlash = path.join(__dirname, '../../../public/data/');
fs.mkdirSync(outputDirWithSlash, { recursive: true });

const TAGS_BY_NAME_FILE = 'tagsByName.json';
const COUNT_BY_TAGS_FILE = 'countByTags.json';
const FIRST_FONT_BY_TAGS_FILE = 'firstFontByTags.json';

// Function to read JSON data
const readJSON = (filePath: string): Promise<FontData> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      const parsed = JSON.parse(data);
      Object.keys(parsed).forEach((k) => {
        parsed[k] = parsed[k].map(tagToUrlSlug);
      });

      resolve(parsed);
    });
  });
};

// Function to parse CSV and extract family names
const parseCSV = (filePath: string): Promise<Set<string>> => {
  return new Promise((resolve, reject) => {
    const families = new Set<string>();

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        families.add(row.Family);
      })
      .on('end', () => {
        resolve(families);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Main function to merge data and write to output
const matched: Record<string, true> = {};

const countByTags = {} as Record<string, number>;
const firstFontByTags = {} as Record<string, string>;
const mergeData = async () => {
  try {
    const familiesFromGoogle = await parseCSV(googleCsvFilePath);
    const fontFamilyTags = await readJSON(jsonFilePath);
    const tagsJapanese_raw = await readJSON(tagsJapanesePath);
    const tagsJapanese = Object.fromEntries(Object.entries(tagsJapanese_raw).map(([k, v]) => {
      return [k, ['lang_ja', ...v ?? []]];
    }));
    const tagsChineseSimplified_raw = await readJSON(tagsChineseSimplifiedPath);
    const tagsChineseSimplified = Object.fromEntries(Object.entries(tagsChineseSimplified_raw).map(([k, v]) => {
      return [k, ['lang_zh-Hans', ...v ?? []]];
    }));
    const tagsChineseTraditional_raw = await readJSON(tagsChineseTraditionalPath);
    const tagsChineseTraditional = Object.fromEntries(Object.entries(tagsChineseTraditional_raw).map(([k, v]) => {
      return [k, ['lang_zh-Hant', ...v ?? []]];
    }));
    const tagsKorean_raw = await readJSON(tagsKoreanPath);
    const tagsKorean = Object.fromEntries(Object.entries(tagsKorean_raw).map(([k, v]) => {
      return [k, ['lang_ko',...v ?? []]];
    }));

    const mergedData: FontData = {};

    const families = uniq([
      ...familiesFromGoogle,

      // it's weird that google is missing fonts in their Github csv.
      ...Object.keys(tagsJapanese),
      ...Object.keys(tagsChineseSimplified),
      ...Object.keys(tagsChineseTraditional),
      ...Object.keys(tagsKorean),
    ]);

    families.forEach((family) => {
      matched[family] = true;
      const tags = uniq([
        ...(fontFamilyTags[family] ?? []),
        ...(tagsJapanese[family] ?? []),
        ...(tagsChineseSimplified[family] ?? []),
        ...(tagsChineseTraditional[family] ?? []),
        ...(tagsKorean[family] ?? []),
      ]);
      if (tags.length) {
        mergedData[family] = tags;

        for (const tag of tags) {
          countByTags[tag] = (countByTags[tag] ?? 0) + 1;
          if (!firstFontByTags[tag]) {
            firstFontByTags[tag] = family;
          }
        }
      }
    });

    fs.writeFileSync(outputDirWithSlash + TAGS_BY_NAME_FILE, JSON.stringify(mergedData, null, 2), 'utf-8');
    fs.writeFileSync(outputDirWithSlash + COUNT_BY_TAGS_FILE, JSON.stringify(countByTags, null, 2), 'utf-8');
    fs.writeFileSync(outputDirWithSlash + FIRST_FONT_BY_TAGS_FILE, JSON.stringify(firstFontByTags, null, 2), 'utf-8');
    console.log('Data successfully merged and written!');

    console.log(
      'missing font faces from fontLibrary:',
      [...familiesFromGoogle].filter((family) => !matched[family])
    );

  } catch (error) {
    console.error('Error merging data:', error);
  }
};

await mergeData();
