import {BaseLocale, createI18n, flattenLocale} from "next-international";
import type {RootDictType} from "./en";
import {z} from "zod";
import invariant from "tiny-invariant";
import {isEqual} from "lodash-es";
import {GetStaticProps} from "next";
import {getStaticPropsLocale as getStaticPropsLocaleNextUtils} from '@nextutils/i18n/locales';

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

export const zLocaleStr = z.enum(allLocaleStrList);

export type LocaleStr = z.infer<typeof zLocaleStr>;

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

if (process.env.NODE_ENV !== "production") {
  invariant(
    isEqual(Object.keys(allLoadedForServer), allLocaleStrList),
  )
}

export const narrowLocaleString = (str: string | undefined) => {
  // @ts-expect-error narrowing
  if (allLocaleStrList.indexOf(str) >= 0) {
    return str as LocaleStr;
  }

  return undefined;
};

export const matchClosestLocale = (str: string | undefined) => {
  const narrowed = narrowLocaleString(str);
  if (narrowed) {
    return narrowed;
  }

  // language match without location
  const strWithoutLocation = str?.split('-')[0];
  for (const locale of allLocaleStrList) {
    if (locale.split('-')[0] === strWithoutLocation) {
      return locale;
    }
  }

  return undefined;
};

export const {defineLocale, useI18n, useScopedI18n, I18nProvider, useChangeLocale, useCurrentLocale, getLocaleProps} = createI18n(allLoadedForServer);

export type { RootDictType } from "./en";
export type TagValueMsgLabelType = Exclude<keyof RootDictType["tagValueMsg"], "">;

const getLocaleContent = async (localeStr: string | undefined) => {
  const localeKey = narrowLocaleString(localeStr) ?? "en";
  return flattenLocale((await allLoadedForServer[localeKey]()).default);
};

export const getStaticPropsLocale = (async (context) => {
  const localeContent = await getLocaleContent(context.locale);
  return {
    props: {
      locale: localeContent,
      ...(await getStaticPropsLocaleNextUtils(context)).props,
    }
  };
}) satisfies GetStaticProps<{
  // locale: any
  localeNextUtils: BaseLocale
}>;

