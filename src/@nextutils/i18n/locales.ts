import {allLoadedForServer, type LocaleStr, narrowLocaleString} from "@nextutils/locales";
import {locales, PRODUCT_DOMAIN} from "@nextutils/config";
import {BaseLocale, flattenLocale} from "next-international";
import {GetStaticProps} from "next";

const getLocaleContent = async (localeStr: string | undefined) => {
  const localeKey = narrowLocaleString(localeStr) ?? "en";
  return flattenLocale((await allLoadedForServer[localeKey]()).default);
};

export const getStaticPropsLocale = (async (context) => {
  const localeContent = await getLocaleContent(context.locale);
  return {
    props: {
      localeNextUtils: localeContent,
    }
  };
}) satisfies GetStaticProps<{
  // locale: any
  localeNextUtils: BaseLocale
}>;

export const langMap = locales.reduce((map, l) => {
  map[l.locale] = l.lang;
  return map;
}, {} as Record<LocaleStr, string>);

const PREF_PREFIX = 'fontsensei'

export const setPreferredLocaleInBrowser = (preferredLocale: LocaleStr) => {
  localStorage.setItem(`${PREF_PREFIX}.preferences.locale`, preferredLocale);
};


export const getPreferredLocaleInBrowser = () => {
  return narrowLocaleString(
    localStorage.getItem(`${PREF_PREFIX}.preferences.locale`) ?? undefined
  );
};

export const fallbackLocale = 'en' as const;

export const getCanonicalPath = (
  locale: string,
  asPath: string // use router.asPath
) => {
  return `${
    locale === fallbackLocale ? '' : '/' + locale
  }${
    asPath === '/' ? '' : asPath
  }`
}

// Fix this on vercel
// https://github.com/vercel/next.js/issues/72063
export const hackAsPath = (asPath: string) => {
  let finalPath = asPath;
  for (const l of locales) {
    if (asPath.startsWith('/' + l.locale)) {
      finalPath = finalPath.slice(('/' + l.locale).length);
      break;
    }
  }

  // remove the parameter nxtPslugList
  finalPath = finalPath.split('?')[0]!;

  return finalPath;
};

export const getCanonicalUrl = (
  locale: string,
  asPath: string // use router.asPath
) => {
  return `https://${
    PRODUCT_DOMAIN
  }${
    locale === fallbackLocale ? '' : '/' + locale
  }${
    hackAsPath(asPath) === '/' ? '' : hackAsPath(asPath)
  }`
};
