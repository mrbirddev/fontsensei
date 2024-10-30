export const PRODUCT_NAME = 'Font sensei';
export const PRODUCT_ICON = '/icon.png';
export const PRODUCT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_NAME;

export const defaultLocale = {"locale": "en", "lang": "English"} as const;

// extracted wordpress.com
export const locales = [
  defaultLocale,
  {"locale": "es", "lang": "Español"},
  {"locale": "pt-br", "lang": "Português do Brasil"},
  {"locale": "de", "lang": "Deutsch"},
  {"locale": "fr", "lang": "Français"},
  {"locale": "he", "lang": "עִבְרִית"},
  {"locale": "ja", "lang": "日本語"},
  {"locale": "it", "lang": "Italiano"},
  {"locale": "nl", "lang": "Nederlands"},
  {"locale": "ru", "lang": "Русский"},
  {"locale": "tr", "lang": "Türkçe"},
  {"locale": "id", "lang": "Bahasa Indonesia"},
  {"locale": "zh-cn", "lang": "简体中文"},
  {"locale": "zh-tw", "lang": "繁體中文"},
  {"locale": "ko", "lang": "한국어"},
  {"locale": "ar", "lang": "العربية"},
  {"locale": "sv", "lang": "Svenska"}
] as const;


