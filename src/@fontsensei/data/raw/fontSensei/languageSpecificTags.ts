import {type LocaleStr} from "@fontsensei/locales";

const languageSpecificTags: Record<LocaleStr, string[]> = {
  "en": [],
  "es": [],
  "pt-br": [],
  "de": [],
  "fr": [],
  "he": [],
  "ja": ["lang_ja", "mincho", "kaku gothic", "maru gothic", "tegaki", "fude", "poppu", "kawaii", "manga"],
  "it": [],
  "nl": [],
  "ru": [],
  "tr": [],
  "id": [],
  "zh-cn": ["lang_zh-hans", "lang_zh-hant", "songti", "heiti", "kaiti", "shouxie", "maobi", "meishuti"],
  "zh-tw": ["lang_zh-hant", "lang_zh-hans", "songti", "heiti", "kaiti", "shouxie", "maobi", "meishuti"],
  "ko": [
    "lang_ko",
    "dotum",
    "batang",
    "songeulssi",
    "jangsikche",
    "piksellche",
    "gojeonche",
    "talnemo",
    "kaelriponteu",
    "kodingche",
    "gungsuhche"
  ],
  "ar": [],
  "sv": []
};

export default languageSpecificTags;
