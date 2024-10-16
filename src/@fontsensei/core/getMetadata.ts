import {FontMetadata, FontMetadataReduced} from "@fontsensei/data/raw/googleFonts";
import {compact} from "lodash-es";

const ENABLE_CACHE = process.env.NODE_ENV === 'production';
let _serverCache = undefined as Record<string, FontMetadata> | undefined;
let _clientCache = undefined as Record<string, FontMetadata> | undefined;

export const reduceMetadata = (metadata: FontMetadata) => {
  const hasItalic = Object.keys(metadata.fonts).some(font => font.indexOf('i') >= 0);
  const opticalSize = metadata.axes.find(v => v.tag === "opsz");
  const weight = metadata.axes.find(v => v.tag === "wght");

  let defaultSuffix = '';
  const axesRawData = compact([opticalSize, weight]);
  const axesTypeString = axesRawData.map(v => v.tag).join(',');
  const axesRangeString = axesRawData.map(v => v.min + '..' + v.max).join(',');
  if (hasItalic) {
    const commaOptional = axesRawData.length ? ',' : '';
    defaultSuffix = `:ital${commaOptional}${axesTypeString}@0${commaOptional}${axesRangeString};1${commaOptional}${axesRangeString}`;
  } else {
    if (axesRawData.length) {
      defaultSuffix = `:${axesTypeString}@${axesRangeString}`;
    } else {
      // do nothing. no suffix
    }
  }

  return {
    defaultSuffix,
    designers: metadata.designers,
  } as FontMetadataReduced;
}

const getMetadata = async (family: string) => {
  if (typeof window === 'undefined') {
    if (_serverCache) {
      return _serverCache[family];
    }

    // reading the file from public/merged.json on server side,
    const mod = await import(`../../../public/data/metadataRecord.json`);
    const record = mod.default as unknown as Record<string, FontMetadata>;

    if (ENABLE_CACHE) {
      _serverCache = record;
    }

    return record[family];
  }

  if (_clientCache) {
    // force make this function async
    // otherwise React will combine loading state and the initial list is not refreshed
    await new Promise((resolve) => setTimeout(resolve, 1));

    return _clientCache[family];
  }

  const record = (await fetch(`/data/metadataRecord.json`).then((res) => {
    return res.json();
  })) as unknown as Record<string, FontMetadata>;

  if (ENABLE_CACHE) {
    _clientCache = record;
  }

  return record[family];
};

export default getMetadata;
