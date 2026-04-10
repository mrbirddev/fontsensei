import {FontMetadata, FontMetadataReduced} from "@fontsensei/data/raw/googleFonts";
import {FONT_DATA_FOLDER} from "@fontsensei/data/generated/fontDataFolder";
import {compact} from "lodash-es";

const ENABLE_CACHE = true; // this is so dangerous without cache, will be sending infinite requests
let _serverCache = undefined as Record<string, FontMetadataReduced> | undefined;
let _clientCache = undefined as Record<string, FontMetadataReduced> | undefined;

export const reduceMetadata = (metadata: FontMetadata) => {
  const variants = Object.keys(metadata.fonts);
  const hasItalic = Object.keys(metadata.fonts).some(font => font.indexOf('i') >= 0);
  const opticalSize = metadata.axes.find(v => v.tag === "opsz");
  const weight = metadata.axes.find(v => v.tag === "wght");

  let defaultSuffix = '';
  const axesRawData = compact([opticalSize, weight]);
  if (axesRawData.length) {
    const axesTypeString = axesRawData.map(v => v.tag).join(',');
    const axesRangeString = axesRawData.map(v => v.min + '..' + v.max).join(',');
    if (hasItalic) {
      defaultSuffix = `:ital,${axesTypeString}@0,${axesRangeString};1,${axesRangeString}`;
    } else {
      defaultSuffix = `:${axesTypeString}@${axesRangeString}`;
    }
  } else {
    // not a variable font? For example Poppins

    // Javascript objects are in fact ordered
    // https://stackoverflow.com/a/31102605/1922857
    if (variants.length > 1) {
      if (hasItalic) {
        defaultSuffix = ':ital,wght@' + variants.map((v) => {
          if (v.endsWith('i')) {
            return '1,' + v.substring(0, v.length - 1);
          }

          return '0,' + v;
        }).join(';');
      }
    }
  }

  return {
    defaultSuffix,
    variants,
    axes: metadata.axes,
    designers: metadata.designers,
  } as FontMetadataReduced;
}

export async function loadMetadataRecord(): Promise<Record<string, FontMetadataReduced>> {
  if (typeof window === 'undefined') {
    if (_serverCache) {
      return _serverCache;
    }

    const mod = await import(`../../../public/data/${FONT_DATA_FOLDER}/metadataRecord.json`);
    const record = mod.default as unknown as Record<string, FontMetadataReduced>;

    if (ENABLE_CACHE) {
      _serverCache = record;
    }

    return record;
  }

  if (_clientCache) {
    return _clientCache;
  }

  const record = (await fetch(`/data/${FONT_DATA_FOLDER}/metadataRecord.json`).then((res) => {
    return res.json();
  })) as unknown as Record<string, FontMetadataReduced>;

  if (ENABLE_CACHE) {
    _clientCache = record;
  }

  return record;
}

const getMetadata = async (family: string) => {
  const hadClientCache = typeof window !== 'undefined' && !!_clientCache;

  const record = await loadMetadataRecord();

  if (typeof window !== 'undefined' && hadClientCache) {
    // force make this function async
    // otherwise React will combine loading state and the initial list is not refreshed
    await new Promise((resolve) => setTimeout(resolve, 1));
  }

  return record[family];
};

export default getMetadata;
