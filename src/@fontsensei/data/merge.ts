/*
To run this script
  npx tsx merge.ts

To get source data

JSON.stringify([...document.querySelectorAll('[href]')].filter(n => n.href && n.href.includes('specimen')).map(n => [n.innerText, n.href]))

 */


import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
type FontData = Record<string, string[] | undefined>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, './raw/googleFonts/families.csv');
const jsonFilePath = path.join(__dirname, './raw/fontLibrary/families.json');
const fontSenseiTagsPath = path.join(__dirname, './raw/fontSensei/tags.json');

// output file names
const outputDirWithSlash = path.join(__dirname, '../../../public/data/');
fs.mkdirSync(outputDirWithSlash, { recursive: true });

const TAGS_BY_NAME_FILE = 'tagsByName.json';
const COUNT_BY_TAGS_FILE = 'countByTags.json';
const FIRST_FONT_BY_TAGS_FILE = 'firstFontByTags.json';

const toUrlSlug = (tag: string) => {
  return tag.toLowerCase().split(' ').join('-');
};

// Function to read JSON data
const readJSON = (filePath: string): Promise<FontData> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      const parsed = JSON.parse(data);
      Object.keys(parsed).forEach((k) => {
        parsed[k] = parsed[k].map(toUrlSlug);
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
    const familiesFromCSV = await parseCSV(csvFilePath);
    const fontFamilyTags = await readJSON(jsonFilePath);
    const fontSenseiTags = await readJSON(fontSenseiTagsPath);

    const mergedData: FontData = {};

    familiesFromCSV.forEach((family) => {
      matched[family] = true;
      const tags = [
        ...(fontFamilyTags[family] ?? []),
        ...(fontSenseiTags[family] ?? []),
      ];
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
      [...familiesFromCSV].filter((family) => !matched[family])
    );

  } catch (error) {
    console.error('Error merging data:', error);
  }
};

await mergeData();
