import {allLoadedForServer, narrowLocaleString} from "@nextutils/locales";
import {type BaseLocale, flattenLocale} from "next-international";
import {type GetStaticProps} from "next";

export const getLocaleContent = async (localeStr: string | undefined) => {
  const localeKey = narrowLocaleString(localeStr) ?? "en";
  return flattenLocale((await allLoadedForServer[localeKey]()).default);
};

const getStaticPropsLocale = (async (context) => {
  const localeContent = await getLocaleContent(context.locale);
  return {
    props: {
      locale: localeContent,
    }
  };
}) satisfies GetStaticProps<{
  // locale: any
  locale: BaseLocale
}>;

export default getStaticPropsLocale;
