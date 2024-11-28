import type {RootDictType} from "./en";
import invariant from "tiny-invariant";
import {isEqual} from "lodash-es";
import {overrideLocales} from "@nextutils/config";
import createLocaleHelpers from "@nextutils/i18n/createLocaleHelpers";
import {createI18n} from "next-international";
import {z} from "zod";

export const allLocaleStrList = [
  "en",
  "es",
  "pt-br",
  "de",
  "fr",
  "he",
  "ja",
  "it",
  "nl",
  "ru",
  "tr",
  "id",
  "zh-cn",
  "zh-tw",
  "ko",
  "ar",
  "sv"
] as const;

export const allLoadedForServer = {
  "en": () => import("./en"),
  "es": () => import("./es"),
  "pt-br": () => import("./pt-br"),
  "de": () => import("./de"),
  "fr": () => import("./fr"),
  "he": () => import("./he"),
  "ja": () => import("./ja"),
  "it": () => import("./it"),
  "nl": () => import("./nl"),
  "ru": () => import("./ru"),
  "tr": () => import("./tr"),
  "id": () => import("./id"),
  "zh-cn": () => import("./zh-cn"),
  "zh-tw": () => import("./zh-tw"),
  "ko": () => import("./ko"),
  "ar": () => import("./ar"),
  "sv": () => import("./sv")
};

overrideLocales(allLoadedForServer);

if (process.env.NODE_ENV !== "production") {
  invariant(
    isEqual(Object.keys(allLoadedForServer), allLocaleStrList),
  )
}

const helpers = createLocaleHelpers(
  allLocaleStrList,
  // @ts-expect-error no need to check here, as we already get the type inference
  allLoadedForServer
);
export const {
  zLocaleStr,
  matchClosestLocale,
  narrowLocaleString,
} = helpers;

export const {defineLocale, useI18n, useScopedI18n, I18nProvider, useChangeLocale, useCurrentLocale} = createI18n(allLoadedForServer);

export type LocaleStr = z.infer<typeof zLocaleStr>;
export type { RootDictType } from "./en";
