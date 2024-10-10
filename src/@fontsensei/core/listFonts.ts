import {type FSFontFilterOptions, type FSFontItem} from "./types";

const ENABLE_CACHE = true;
let _serverCache = undefined as FSFontItem[] | undefined;
let _clientCache = undefined as FSFontItem[] | undefined;

const toFontItemList = (jsonObj: object) => {
  const list = [] as FSFontItem[];
  Object.keys(jsonObj).forEach((fontName) => {
    list.push({
      family: fontName,
      tags: (jsonObj as Record<string, string[]>)[fontName],
    } as FSFontItem);
  });
  return list;
};

const filterByOpts = (list: FSFontItem[], opts: FSFontFilterOptions) => {
  const filteredList = [] as FSFontItem[];
  for (const font of list) {
    if (opts.tagValue === "all") {
      filteredList.push(font);
    } else if (font.tags.indexOf(opts.tagValue) >= 0) {
      filteredList.push(font);
    }

    if (filteredList.length >= (opts.skip + opts.take)) {
      break;
    }
  }

  return filteredList.slice(opts.skip, opts.skip + opts.take);
}

const listFonts = async (opts: FSFontFilterOptions) => {
  if (typeof window === 'undefined') {
    if (_serverCache) {
      return filterByOpts(_serverCache, opts);
    }

    // reading the file from public/merged.json on server side,
    const mod = await import(`../../../public/data/tagsByName.json`);
    const list = toFontItemList(mod.default);

    if (ENABLE_CACHE) {
      _serverCache = list;
    }

    return filterByOpts(list, opts);
  }

  if (_clientCache) {
    // force make this function async
    // otherwise React will combine loading state and the initial list is not refreshed
    await new Promise((resolve) => setTimeout(resolve, 1));

    return filterByOpts(_clientCache, opts);
  }

  const list = await fetch(`/data/tagsByName.json`).then((res) => {
    return res.json();
  }).then((json) => {
    return toFontItemList(json);
  });

  if (ENABLE_CACHE) {
    _clientCache = list;
  }

  return filterByOpts(list, opts);
};

export default listFonts;
