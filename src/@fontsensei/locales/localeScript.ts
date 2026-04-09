import type {LocaleStr} from "./index";

export type LocaleScript =
  | "latin"
  | "cyrillic"
  | "arabic"
  | "hebrew"
  | "han"
  | "japanese"
  | "hangul";

const localeToScript: Record<LocaleStr, LocaleScript> = {
  "en": "latin",
  "es": "latin",
  "pt-br": "latin",
  "de": "latin",
  "fr": "latin",
  "he": "hebrew",
  "ja": "japanese",
  "it": "latin",
  "nl": "latin",
  "ru": "cyrillic",
  "tr": "latin",
  "id": "latin",
  "zh-cn": "han",
  "zh-tw": "han",
  "ko": "hangul",
  "ar": "arabic",
  "sv": "latin",
};

export const getLocaleScript = (locale: LocaleStr): LocaleScript => localeToScript[locale];

export const isNonLatinLocale = (locale: LocaleStr): boolean => getLocaleScript(locale) !== "latin";

