import {flattenLocale} from "@nextutils/i18n/flattenLocale";
import {allLoadedForServer, type LocaleStr, narrowLocaleString} from "@nextutils/locales";
import {locales, PREFERENCES_PREFIX, PRODUCT_DOMAIN} from "@nextutils/config";
import {GetStaticProps} from "next";

const getLocaleContent = async (localeStr: string | undefined) => {
  const localeKey = narrowLocaleString(localeStr) ?? "en";
  return flattenLocale((await allLoadedForServer[localeKey]()).default);
};

export function resolvePathLocaleFromContext(context: {
  params?: { pathLocale?: string | string[] };
  locale?: string;
}): LocaleStr {
  const raw = Array.isArray(context.params?.pathLocale)
    ? context.params.pathLocale[0]
    : context.params?.pathLocale;
  return narrowLocaleString(raw ?? context.locale) ?? "en";
}

export const getStaticPropsLocale = (async (context) => {
  const pathLocale = resolvePathLocaleFromContext(context);
  const localeContent = await getLocaleContent(pathLocale);
  return {
    props: {
      localeNextUtils: localeContent,
      pathLocale,
    }
  };
}) satisfies GetStaticProps<{
  localeNextUtils: Record<string, string>;
  pathLocale: LocaleStr;
}>;

export const langMap = locales.reduce((map, l) => {
  map[l.locale] = l.lang;
  return map;
}, {} as Record<LocaleStr, string>);

export const setPreferredLocaleInBrowser = (preferredLocale: LocaleStr) => {
  localStorage.setItem(`${PREFERENCES_PREFIX}.preferences.locale`, preferredLocale);
};


export const getPreferredLocaleInBrowser = () => {
  return narrowLocaleString(
    localStorage.getItem(`${PREFERENCES_PREFIX}.preferences.locale`) ?? undefined
  );
};

export const fallbackLocale = 'en' as const;

export const buildLocalizedPath = (
  locale: string,
  asPath: string,
  isClient: boolean,
) => {
  const normalizedPath = hackAsPath(asPath, isClient);
  if (locale === fallbackLocale) {
    return normalizedPath;
  }
  return `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
};

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

const FAKE_DOMAIN = 'https://fake.com';
export const hackAsPath = (asPath: string, isClient: boolean) => {
  // Fix this on vercel
  // https://github.com/vercel/next.js/issues/72063
  let finalPath = asPath;
  for (const l of locales) {
    if (asPath.startsWith('/' + l.locale)) {
      finalPath = finalPath.slice(('/' + l.locale).length);
      break;
    }
  }

  const url = new URL(finalPath, FAKE_DOMAIN);

  // remove the parameter nxtPslugList
  if (url.searchParams.has('nxtPslugList')) {
    url.searchParams.delete('nxtPslugList');
  }

  // Fix hydration of hash - remove hash on server
  // https://github.com/vercel/next.js/issues/25202
  if (!isClient) {
    url.hash = '';
  }

  finalPath = url.toString();

  return finalPath.slice(FAKE_DOMAIN.length);
};

export const getCanonicalUrl = (
  locale: string,
  asPath: string, // use router.asPath,
  isClient: boolean,
) => {
  return `https://${
    PRODUCT_DOMAIN
  }${
    locale === fallbackLocale ? '' : '/' + locale
  }${
    hackAsPath(asPath, isClient) === '/' ? '' : hackAsPath(asPath, isClient)
  }`
};
