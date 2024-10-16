import {FontMetadata} from "@fontsensei/data/raw/googleFonts";

const ENABLE_CACHE = process.env.NODE_ENV !== 'production';
let _serverCache = undefined as Record<string, FontMetadata> | undefined;
let _clientCache = undefined as Record<string, FontMetadata> | undefined;

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
