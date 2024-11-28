import {z} from "zod";
import invariant from "tiny-invariant";
import {isEqual} from "lodash-es";
import {BaseLocale, flattenLocale} from "next-international";
import {GetStaticProps} from "next";
type DictFile<LocaleDict extends Record<string, unknown>> = {default: LocaleDict};

const createLocaleHelpers = <TLocaleKey extends string, T2 extends Record<TLocaleKey, unknown>, T3 extends DictFile<T2>>(
  allLocaleStrList: readonly [TLocaleKey, ...TLocaleKey[]],
  allLoadedForServer: Record<TLocaleKey, () => Promise<T3>>
) => {
  const zLocaleStr = z.enum(allLocaleStrList);
  type LocaleStr = z.infer<typeof zLocaleStr>;
  type DefaultLocaleStr = "en";
  const defaultLocaleStr = "en" as DefaultLocaleStr;

  if (process.env.NODE_ENV !== "production") {
    invariant(
      isEqual(Object.keys(allLoadedForServer), allLocaleStrList),
    )
  }

  const narrowLocaleString = (str: string | undefined) => {
    // @ts-expect-error narrowing
    if (allLocaleStrList.indexOf(str) >= 0) {
      return str as LocaleStr;
    }

    return undefined;
  };

  const matchClosestLocale = (str: string | undefined) => {
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
  }

  const getLocaleOutsideReact = (() => {
    if (typeof window === 'undefined') {
      return "en";
    }

    const url = window.location.href;
    const urlPathname = new URL(url).pathname;
    const firstSegment = urlPathname.split('/')[1];

    return narrowLocaleString(firstSegment) ?? "en";
  });

  const getLocaleContent = async (localeStr: LocaleStr) => {
    return flattenLocale((await allLoadedForServer[localeStr]!()).default);
  };

  const getStaticPropsLocale = (async (context) => {
    const narrowed = narrowLocaleString(context.locale);
    invariant(narrowed);
    const localeContent = await getLocaleContent(narrowed);
    return {
      props: {
        locale: localeContent,
      }
    };
  }) satisfies GetStaticProps<{
    // locale: any
    locale: BaseLocale
  }>;

  return {
    zLocaleStr,
    defaultLocaleStr,
    narrowLocaleString,
    matchClosestLocale,
    getLocaleOutsideReact,
    getStaticPropsLocale,
  };
};

export default createLocaleHelpers;


