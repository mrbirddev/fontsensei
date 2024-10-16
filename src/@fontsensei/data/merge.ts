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
import languageSpecificTags from "@fontsensei/data/raw/fontSensei/languageSpecificTags";
import {readRawJson} from "@fontsensei/data/utils";
import {FontMetadata} from "@fontsensei/data/raw/googleFonts";
type FontData = Record<string, string[] | undefined>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const googleApiResPath = path.join(__dirname, './raw/googleFonts/fonts.json');
const jsonFilePath = path.join(__dirname, './raw/fontLibrary/families.json');
const tagsJapanesePath = path.join(__dirname, './raw/fontSensei/step2-generated/tags-japanese.json');
const tagsChineseSimplifiedPath = path.join(__dirname, './raw/fontSensei/step2-generated/tags-chinese-simplified.json');
const tagsChineseTraditionalPath = path.join(__dirname, './raw/fontSensei/step2-generated/tags-chinese-traditional.json');
const tagsKoreanPath = path.join(__dirname, './raw/fontSensei/step2-generated/tags-korean.json');
const tagsHardCodedPath = path.join(__dirname, './raw/fontSensei/tags-hardcoded.json');

// output file names
const outputDirWithSlash = path.join(__dirname, '../../../public/data/');
fs.mkdirSync(outputDirWithSlash, { recursive: true });

const TAGS_BY_NAME_FILE = 'tagsByName.json';
const COUNT_BY_TAGS_FILE = 'countByTags.json';
const FIRST_FONT_BY_TAGS_FILE = 'firstFontByTags.json';
const LANGUAGE_SPECIFIC_TAGS = 'languageSpecificTags.json';
const METADATA_RECORD = 'metadataRecord.json';

// Function to read JSON data
const readJsonFontData = (filePath: string): Promise<FontData> => {
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

// Main function to merge data and write to output
const matched: Record<string, true> = {};

const countByTags = {} as Record<string, number>;
const firstFontByTags = {} as Record<string, string>;
const mergeData = async () => {
  try {
    const googleApiRes = await readRawJson(googleApiResPath) as {familyMetadataList: FontMetadata[]};
    const familiesFromGoogle = googleApiRes.familyMetadataList.map(row => row.family);
    const metadataRecord = {} as Record<string, FontMetadata>;
    googleApiRes.familyMetadataList.forEach(row => {
      metadataRecord[row.family] = row;
    });

    const fontFamilyTags = await readJsonFontData(jsonFilePath);

    const tagsHardCoded = await readJsonFontData(tagsHardCodedPath);

    const tagsJapanese_raw = await readJsonFontData(tagsJapanesePath);
    const tagsJapanese = Object.fromEntries(Object.entries(tagsJapanese_raw).map(([k, v]) => {
      return [k, ['lang_ja', ...v ?? [], ...tagsHardCoded[k] ?? []]];
    }));
    const tagListJapanese = uniq(
      Object.entries(tagsJapanese).map(([k, v]) => v).flat()
    );

    const tagsChineseSimplified_raw = await readJsonFontData(tagsChineseSimplifiedPath);
    const tagsChineseSimplified = Object.fromEntries(Object.entries(tagsChineseSimplified_raw).map(([k, v]) => {
      return [k, ['lang_zh-hans', ...v ?? [], ...tagsHardCoded[k] ?? []]];
    }));
    const tagListChineseSimplified = uniq(
      Object.entries(tagsChineseSimplified).map(([k, v]) => v).flat()
    );

    const tagsChineseTraditional_raw = await readJsonFontData(tagsChineseTraditionalPath);
    const tagsChineseTraditional = Object.fromEntries(Object.entries(tagsChineseTraditional_raw).map(([k, v]) => {
      return [k, ['lang_zh-hant', ...v ?? [], ...tagsHardCoded[k] ?? []]];
    }));
    const tagListChineseTraditional = uniq(
      Object.entries(tagsChineseTraditional).map(([k, v]) => v).flat()
    );

    const tagsKorean_raw = await readJsonFontData(tagsKoreanPath);
    const tagsKorean = Object.fromEntries(Object.entries(tagsKorean_raw).map(([k, v]) => {
      return [k, ['lang_ko',...v ?? [], ...tagsHardCoded[k] ?? []]];
    }));
    const tagListKorean = uniq(
      Object.entries(tagsKorean).map(([k, v]) => v).flat()
    );

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
      ]).map(tagToUrlSlug);

      const lang = tags.filter(tag => tag.startsWith('lang_'))[0];
      if (lang) {
        switch (lang) {
          case 'lang_ja':
            // console.log('sorting', family, tags);
            tags.sort(t => tagListJapanese.includes(t) ? -1 : 1);
            // console.log('after', tags);
            break;
          case 'lang_zh-hans':
            // console.log('sorting', family, tags);
            tags.sort(t => tagListChineseSimplified.includes(t) ? -1 : 1);
            // console.log('after', tags);
            break;
          case 'lang_zh-hant':
            // console.log('sorting', family, tags);
            tags.sort(t => tagListChineseTraditional.includes(t) ? -1 : 1);
            // console.log('after', tags);
            break;
          case 'lang_ko':
            // console.log('sorting', family, tags);
            tags.sort(t => tagListKorean.includes(t) ? -1 : 1);
            // console.log('after', tags);
            break;
        }
      }

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

    // fixing first font to ensure readability on tags
    firstFontByTags.lang_ja = 'Noto Sans JP';
    firstFontByTags["lang_zh-hans"] = 'Noto Sans SC';
    firstFontByTags["lang_zh-hant"] = 'Noto Sans TC';
    firstFontByTags.lang_ko = 'Noto Sans KR';

    fs.writeFileSync(outputDirWithSlash + TAGS_BY_NAME_FILE, JSON.stringify(mergedData, null, 2), 'utf-8');
    fs.writeFileSync(outputDirWithSlash + COUNT_BY_TAGS_FILE, JSON.stringify(countByTags, null, 2), 'utf-8');
    fs.writeFileSync(outputDirWithSlash + FIRST_FONT_BY_TAGS_FILE, JSON.stringify(firstFontByTags, null, 2), 'utf-8');
    fs.writeFileSync(outputDirWithSlash + LANGUAGE_SPECIFIC_TAGS, JSON.stringify(languageSpecificTags, null, 2), 'utf-8');
    fs.writeFileSync(outputDirWithSlash + METADATA_RECORD, JSON.stringify(metadataRecord, null, 2), 'utf-8');
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
