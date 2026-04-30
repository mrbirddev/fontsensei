import {type FSFontFilterOptions, type FSFontItem} from "./types";
import {loadMetadataRecord} from "@fontsensei/core/getMetadata";
import {FONT_DATA_FOLDER} from "@fontsensei/data/generated/fontDataFolder";
import type {FontMetadataReduced} from "@fontsensei/data/raw/googleFonts";
import invariant from "tiny-invariant";

const ENABLE_CACHE = true;

let _serverCache = undefined as FSFontItem[] | undefined;
let _serverScoreCache = {} as Record<string, Record<string, number>>;
let _clientCache = undefined as FSFontItem[] | undefined;
let _clientCachePromise = undefined as Promise<FSFontItem[]> | undefined;
let _clientScoreCache = {} as Record<string, Record<string, number>>;

const toFontItemList = (jsonObj: object, metadataRecord: Record<string, FontMetadataReduced>) => {
  const list = [] as FSFontItem[];
  for (const fontName of Object.keys(jsonObj)) {
    const metadata = metadataRecord[fontName];
    invariant(metadata);
    list.push({
      family: fontName,
      tags: (jsonObj as Record<string, string[]>)[fontName],
      metadata: metadata,
    } as FSFontItem);
  }
  return list;
};

const buildScoreMap = (list: FSFontItem[], baseFontName: string): Record<string, number> => {
  const sourceItem = list.find((item) => item.family === baseFontName);
  if (!sourceItem) {
    return {};
  }
  const sourceTags = new Set(sourceItem.tags);
  const scoreByFamily = {} as Record<string, number>;
  for (const item of list) {
    if (item.family === baseFontName) {
      continue;
    }
    let overlap = 0;
    for (const tag of item.tags) {
      if (sourceTags.has(tag)) {
        overlap += 1;
      }
    }
    if (overlap > 0) {
      scoreByFamily[item.family] = overlap;
    }
  }
  return scoreByFamily;
};

const filterAndSort = (
  list: FSFontItem[],
  scoreByFamily: Record<string, number>,
  opts: FSFontFilterOptions,
) => {
  const lcFilter = opts.filterText.toLowerCase();
  const filtered = list.filter((item) => {
    if (!scoreByFamily[item.family]) {
      return false;
    }
    return !opts.filterText || item.family.toLowerCase().includes(lcFilter);
  });
  filtered.sort((a, b) => {
    const scoreDiff = (scoreByFamily[b.family] ?? 0) - (scoreByFamily[a.family] ?? 0);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    return a.family.localeCompare(b.family);
  });
  return filtered.slice(opts.skip, opts.skip + opts.take);
};

const listSimilarFonts = async (
  baseFontName: string,
  opts: Omit<FSFontFilterOptions, "tagValue">,
) => {
  if (typeof window === "undefined") {
    if (_serverCache) {
      const scoreByFamily = _serverScoreCache[baseFontName] ?? buildScoreMap(_serverCache, baseFontName);
      _serverScoreCache[baseFontName] = scoreByFamily;
      return filterAndSort(_serverCache, scoreByFamily, {...opts, tagValue: "all"});
    }

    const [tagsMod, metadataRecord] = await Promise.all([
      import(`../../../public/data/${FONT_DATA_FOLDER}/tagsByName.json`),
      loadMetadataRecord(),
    ]);
    const list = toFontItemList(tagsMod.default, metadataRecord);
    const scoreByFamily = buildScoreMap(list, baseFontName);

    if (ENABLE_CACHE) {
      _serverCache = list;
      _serverScoreCache[baseFontName] = scoreByFamily;
    }
    return filterAndSort(list, scoreByFamily, {...opts, tagValue: "all"});
  }

  if (_clientCache) {
    const scoreByFamily = _clientScoreCache[baseFontName] ?? buildScoreMap(_clientCache, baseFontName);
    _clientScoreCache[baseFontName] = scoreByFamily;
    await new Promise((resolve) => setTimeout(resolve, 1));
    return filterAndSort(_clientCache, scoreByFamily, {...opts, tagValue: "all"});
  }

  if (!_clientCachePromise) {
    _clientCachePromise = Promise.all([
      fetch(`/data/${FONT_DATA_FOLDER}/tagsByName.json`).then((res) => res.json()),
      loadMetadataRecord(),
    ]).then(([json, metadataRecord]) => toFontItemList(json, metadataRecord));
  }
  _clientCache = await _clientCachePromise;
  const scoreByFamily = buildScoreMap(_clientCache, baseFontName);
  _clientScoreCache[baseFontName] = scoreByFamily;
  return filterAndSort(_clientCache, scoreByFamily, {...opts, tagValue: "all"});
};

export default listSimilarFonts;
