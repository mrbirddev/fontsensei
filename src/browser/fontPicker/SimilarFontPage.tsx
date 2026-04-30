import {type GetStaticPaths, type GetStaticProps} from "next";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {
  getStaticPropsLocale,
  type LocaleStr,
  type TagValueMsgLabelType,
  useCurrentLocale,
  useScopedI18n,
} from "@fontsensei/locales";
import {defaultLocale, locales, PRODUCT_NAME} from "@nextutils/config";
import {useI18n as useI18nNextUtils} from "@nextutils/locales";
import listSimilarFonts from "@fontsensei/core/listSimilarFonts";
import {type FSFontItem} from "@fontsensei/core/types";
import VirtualList from "@fontsensei/components/VirtualList";
import {FONT_DATA_FOLDER} from "@fontsensei/data/generated/fontDataFolder";
import {fontFamilyToUrlParam, tagToUrlSlug} from "../../@fontsensei/utils";
import languageSpecificTags from "@fontsensei/data/raw/fontSensei/languageSpecificTags";
import {getTagLabelsForDisplay} from "../../@fontsensei/getTagLabelsForDisplay";
import {LandingLayout} from "../layout/SiteLayout";
import {GoogleFontHeaders} from "@fontsensei/components/GoogleFontHeaders";
import {FontPickerPageContext} from "@fontsensei/components/fontPickerCommon";
import {Toolbar} from "./landingComponents";

const PAGE_SIZE = 10;

interface PageProps {
  initialFontItemList: FSFontItem[];
  fontName: string;
  sourceTags: string[];
  placeholderText: string | null;
}

const decodeFontName = (fontName: string | undefined) => {
  if (!fontName) {
    return "";
  }
  return decodeURIComponent(fontName).replace(/\+/g, " ");
};

const appendPickerQueryParams = (
  path: string,
  opts: { text?: string },
): string => {
  const params = new URLSearchParams();
  if (opts.text) {
    params.set("text", opts.text);
  }
  if (params.toString() === "") {
    return path;
  }
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}${params.toString()}`;
};

const SimilarFontPage = (props: PageProps) => {
  const tLandingMsg = useScopedI18n("landingMsg");
  const tTagValueMsg = useScopedI18n("tagValueMsg");
  const tNextUtils = useI18nNextUtils();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const fontName = decodeFontName(
    typeof router.query.fontName === "string" ? router.query.fontName : props.fontName,
  ) || props.fontName;

  const [initialFontItemList, setInitialFontItemList] = useState(props.initialFontItemList);
  const langTagList = useMemo(
    () => languageSpecificTags[currentLocale].map(tagToUrlSlug),
    [currentLocale],
  );

  useEffect(() => {
    void listSimilarFonts(fontName, {
      filterText: "",
      skip: 0,
      take: PAGE_SIZE,
    }).then((res) => {
      setInitialFontItemList(res);
    });
  }, [fontName]);

  const localizedBasePath = currentLocale === defaultLocale.locale ? "" : `/${currentLocale}`;
  const title = `${tLandingMsg("{fontName} similar fonts", {fontName})} - ${PRODUCT_NAME} - ${tNextUtils("product.slogan")}`;
  const preservedDemoText = useMemo(() => {
    const q = router.query.text;
    if (typeof q === "string") {
      return q;
    }
    if (Array.isArray(q) && typeof q[0] === "string") {
      return q[0];
    }
    return undefined;
  }, [router.query.text]);
  const listSimilarFontsFn = useCallback(
    (opts: { filterText: string; tagValue: string; skip: number; take: number }) =>
      listSimilarFonts(fontName, {
        filterText: opts.filterText,
        skip: opts.skip,
        take: opts.take,
      }),
    [fontName],
  );

  return (
    <FontPickerPageContext.Provider value={{Toolbar}}>
      <LandingLayout title={title} fullWidth={true} className="relative">
        <GoogleFontHeaders
          preConnect={true}
          strategy="block"
          configList={[{name: fontName, text: fontName}]}
        />
        <div className="h-[calc(100dvh-4rem)] py-4 flex flex-col min-h-0">
          <div className="mb-4">
            <div className="rounded-xl border border-black/10 bg-white/60 shadow-sm px-4 py-3 w-full min-w-0">
              <h1
                className="text-xl text-gray-900 mb-2 truncate"
                title={`${tLandingMsg("Free fonts similar to")} ${fontName}`}
              >
                <span className="text-gray-700 mr-2" style={{fontFamily: "inherit"}}>
                  {tLandingMsg("Free fonts similar to")}
                </span>
                <span style={{fontFamily: `"${fontName}"`}}>
                  {fontName}
                </span>
              </h1>
              <div className="flex items-center justify-start gap-2 flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap">
                {props.sourceTags.map((tag) => {
                  const localized = tTagValueMsg(tag as TagValueMsgLabelType);
                  const {primary, secondary} = getTagLabelsForDisplay({
                    tag,
                    currentLocale,
                    localizedLabel: localized,
                    disableTranslation: langTagList.includes(tag),
                  });
                  return (
                    <span key={tag} className="badge badge-outline shrink-0">
                      {primary}
                      {secondary ? ` (${secondary})` : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <VirtualList
              tagValue="all"
              filterText=""
              initialFontItemList={initialFontItemList}
              placeholderText={(router.query.text as string | undefined) ?? props.placeholderText}
              pageSize={PAGE_SIZE}
              tagPageHref={(tag) =>
                appendPickerQueryParams(`${localizedBasePath}/tag/${tag}`, {
                  text: preservedDemoText,
                })
              }
              listFontsFn={listSimilarFontsFn}
            />
          </div>
        </div>
      </LandingLayout>
    </FontPickerPageContext.Provider>
  );
};

const getSimilarPaths = async (includePathLocale: boolean) => {
  const tagsByName = await import(`../../../public/data/${FONT_DATA_FOLDER}/tagsByName.json`)
    .then((res) => res.default as Record<string, string[]>);
  const fontNameList = Object.keys(tagsByName);

  if (includePathLocale) {
    return {
      paths: locales
        .filter((item) => item.locale !== defaultLocale.locale)
        .flatMap((item) =>
          fontNameList.map((fontName) => ({
            params: {
              pathLocale: item.locale,
              fontName: fontFamilyToUrlParam(fontName),
            },
          })),
        ),
      fallback: false,
    };
  }

  return {
    paths: fontNameList.map((fontName) => ({
      params: {
        fontName: fontFamilyToUrlParam(fontName),
      },
    })),
    fallback: false,
  };
};

const makeStaticProps = (includePathLocale: boolean): GetStaticProps<PageProps> => {
  return async (context) => {
    const rawPathLocale = Array.isArray(context.params?.pathLocale)
      ? context.params.pathLocale[0]
      : context.params?.pathLocale;
    const localeForPage = includePathLocale ? rawPathLocale : defaultLocale.locale;
    const locale = (localeForPage ?? defaultLocale.locale) as LocaleStr;
    const rawFontName = Array.isArray(context.params?.fontName)
      ? context.params.fontName[0]
      : context.params?.fontName;
    const fontName = decodeFontName(rawFontName);

    const tagsByName = await import(`../../../public/data/${FONT_DATA_FOLDER}/tagsByName.json`)
      .then((res) => res.default as Record<string, string[]>);
    const sourceTags = tagsByName[fontName] ?? [];

    return {
      props: {
        fontName,
        sourceTags,
        initialFontItemList: await listSimilarFonts(fontName, {
          filterText: "",
          skip: 0,
          take: PAGE_SIZE,
        }),
        placeholderText: null,
        ...(await getStaticPropsLocale({
          ...context,
          params: {
            ...context.params,
            pathLocale: locale,
          },
        })).props,
      },
    };
  };
};

export const getStaticProps = makeStaticProps(false);
export const getStaticPropsWithPathLocale = makeStaticProps(true);
export const getStaticPathsForSimilarPage: GetStaticPaths = async () => getSimilarPaths(false);
export const getStaticPathsForSimilarPageWithPathLocale: GetStaticPaths = async () => getSimilarPaths(true);

export default SimilarFontPage;
