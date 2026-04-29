// templates/[[...slugList]].tsx

import {type GetStaticPaths, type GetStaticProps} from 'next';
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  type PropsWithChildren, useContext
} from 'react';
import {
  getStaticPropsLocale,
  type LocaleStr,
  type TagDescMsgLabelType,
  type TagValueMsgLabelType,
  useCurrentLocale,
  useI18n,
  useScopedI18n
} from "@fontsensei/locales";
import {useI18n as useI18nNextUtils} from "@nextutils/locales";
import {useRouter} from "next/router";
import Link from "next/link";
import Head from "next/head";
import {GoogleFontHeaders} from "@fontsensei/components/GoogleFontHeaders";
import {compact, debounce, throttle} from "lodash-es";
import {cx} from "@emotion/css";
import listFonts from "@fontsensei/core/listFonts";
import {FSFontFilterOptions, type FSFontItem} from "@fontsensei/core/types";
import {FONT_DATA_FOLDER} from "@fontsensei/data/generated/fontDataFolder";
import languageSpecificTags from "@fontsensei/data/raw/fontSensei/languageSpecificTags";
import VirtualList from "@fontsensei/components/VirtualList";
import {tagToUrlSlug} from "../../@fontsensei/utils";
import {getTagLabelsForDisplay} from "../../@fontsensei/getTagLabelsForDisplay";
import {IoClose} from "react-icons/io5";
import {FaSearch} from "react-icons/fa";
import {FaTag} from "react-icons/fa6";
import {FontPickerPageContext} from "@fontsensei/components/fontPickerCommon";
import {defaultLocale, locales, PRODUCT_NAME} from "@nextutils/config";
import ActionSheetWrapper from "@nextutils/ui/actionSheet/ActionSheetWrapper";
import {LandingLayout, NavbarContext} from "../layout/SiteLayout";
const PAGE_SIZE = 10;

interface PageProps {
  initialFontItemList: FSFontItem[];
  countByTags: Record<string, number>;
  firstFontByTags: Record<string, string>;
  placeholderText: string | null;
}

const getTagValue = (raw_tagValue: string | undefined) => {
  if (raw_tagValue) {
    return raw_tagValue;
  }
  return "all";
};

/** Keeps demo `text` and family filter in the URL when navigating (static export: normal href + client Link). */
const appendPickerQueryParams = (
  path: string,
  opts: { text?: string; filter?: string },
): string => {
  const params = new URLSearchParams();
  if (opts.text) {
    params.set('text', opts.text);
  }
  const ft = opts.filter?.trim();
  if (ft) {
    params.set('filter', ft);
  }
  if (params.toString() === '') {
    return path;
  }
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}${params.toString()}`;
};

const TagButton = (props: PropsWithChildren<{
  isActive: boolean,
  tag: string,
  font: string | undefined,
  href: Parameters<typeof Link>[0]['href'],
  onClick?: () => void,
  label: { primary: string; secondary?: string },
  count?: number,
}>) => {
  const {isActive, tag, font, href, onClick, label, count} = props;

  return <Link
    type="button"
    key={tag}
    className={cx(
      // "focus:ring-4 focus:ring-gray-300",
      "btn",
      isActive ? "btn-primary" : "btn-outline",
    )}
    href={href}
    onClick={onClick}
  >
    <span
      style={{
        fontFamily: font ? `"${font}"` : undefined,
      }}
    >
      {label.primary}
    </span>
    {label.secondary && <span> ({label.secondary})</span>}
    {(typeof count === "number") && <span>&nbsp;{count}</span>}
  </Link>;
}
const FontPickerPage = (props: PageProps) => {
  const t = useI18n();
  const tNextUtils = useI18nNextUtils();
  const currentLocale = useCurrentLocale();
  const tLandingMsg = useScopedI18n('landingMsg');
  const tTagValueMsg = useScopedI18n('tagValueMsg');
  const tTagDescMsg = useScopedI18n('tagDescMsg');
  const router = useRouter();
  const raw_tagValue = router.query.slugList?.[0];
  const tagValue = useMemo(() => getTagValue(raw_tagValue), [raw_tagValue]);

  const langTagList = useMemo(() => languageSpecificTags[currentLocale].map(tagToUrlSlug), [currentLocale]);

  const tagDisplayLabel = useMemo(() => {
    const localized = tTagValueMsg(tagValue as TagValueMsgLabelType);
    const {primary, secondary} = getTagLabelsForDisplay({
      tag: tagValue,
      currentLocale,
      localizedLabel: localized,
      disableTranslation: langTagList.includes(tagValue),
    });
    return secondary ? `${primary} (${secondary})` : primary;
  }, [tagValue, currentLocale, langTagList, tTagValueMsg]);

  const [initialFontItemList, setInitialFontItemList] = useState<FSFontItem[]>(props.initialFontItemList);
  const lastTagValueRef = useRef(tagValue);
  const [loading, setLoading] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [debouncedFilterText, setDebouncedFilterText] = useState(filterText);
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedFilterText(filterText);
    }, 500);
    return () => clearTimeout(id);
  }, [filterText]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const raw = router.query.filter;
    const f =
      typeof raw === 'string'
        ? raw
        : Array.isArray(raw) && typeof raw[0] === 'string'
          ? raw[0]
          : undefined;
    if (typeof f === 'string') {
      setFilterText(f);
    }
  }, [router.isReady, router.query.filter]);

  useEffect(() => {
    if (lastTagValueRef.current === tagValue) {
      return;
    }
    lastTagValueRef.current = tagValue;

    setInitialFontItemList([]);
    setLoading(true);
    void listFonts({
      tagValue: tagValue,
      filterText: filterText,
      skip: 0,
      take: PAGE_SIZE
    }).then((response) => {
      setInitialFontItemList(response);
      setLoading(false);
    });
  }, [tagValue, filterText]);

  const pickerBasePath = useContext(FontPickerPageContext)?.basePath ?? "";
  const localizedPickerBasePath = `${currentLocale === defaultLocale.locale ? '' : `/${currentLocale}`}${pickerBasePath}`;
  const TagsTop = useContext(FontPickerPageContext)?.TagsTop ?? (() => false);

  const preservedDemoText = useMemo(() => {
    const q = router.query.text;
    if (typeof q === 'string') {
      return q;
    }
    if (Array.isArray(q) && typeof q[0] === 'string') {
      return q[0];
    }
    return undefined;
  }, [router.query.text]);

  const titlePrefix = tagDisplayLabel
    ? (
      tLandingMsg('Google fonts tagged {tagName}', {
        tagName: tagDisplayLabel,
      }) + ' - '
    )
    : '';
  const title = titlePrefix + PRODUCT_NAME + ' - ' + tNextUtils('product.slogan');

  const tagList = useMemo(
    () => compact([
      langTagList.length ? false : 'all',
      ...Object.keys(props.countByTags)
    ])
      .filter(t => !langTagList.includes(t)),
    [props.countByTags, langTagList]
  );

  const allFontConfigList = useMemo(
    () =>
      Object.keys(props.firstFontByTags).reduce(
        (acc, tag) => {
          const localizedLabel = tTagValueMsg(tag as TagValueMsgLabelType);
          const {primary} = getTagLabelsForDisplay({
            tag,
            currentLocale,
            localizedLabel,
            disableTranslation: langTagList.includes(tag),
          });
          return [
            ...acc,
            {
              name: props.firstFontByTags[tag]!,
              // Important: the Google Fonts `text=` subset must include what we actually render,
              // otherwise non-Latin locales show English primary labels with missing glyphs.
              text: primary,
            }
          ];
        },
        [] as { name: string; text: string }[],
      ),
    [props.firstFontByTags, tTagValueMsg, currentLocale, langTagList]
  );

  const tagSelectorContent = <>
    <TagsTop />
    {!!langTagList.length && <>
        <div className="flex items-center justify-start flex-wrap gap-2">
          {
            [
              'all',
              ...langTagList
            ].map((t) => <TagButton
              key={t}
              isActive={(tagValue === t)}
              tag={t}
              font={props.firstFontByTags[t]}
              label={getTagLabelsForDisplay({
                tag: t,
                currentLocale,
                localizedLabel: tTagValueMsg(t as TagValueMsgLabelType),
                disableTranslation: langTagList.includes(t),
              })}
              count={props.countByTags[t]}
              onClick={() => {
                setSelectorOpen(false);
              }}
              href={appendPickerQueryParams(
                t === "all"
                  ? (localizedPickerBasePath || "/")
                  : `${localizedPickerBasePath}/tag/${t}`,
                {text: preservedDemoText, filter: filterText},
              )}
            >
            </TagButton>)
          }
        </div>
        <div className="my-4">
          {t('landingMsg.More tags')}
        </div>
    </>
    }
    <div className="flex items-center justify-start flex-wrap gap-2">
      {
        [
          ...tagList
        ].map((t) => <TagButton
          key={t}
          isActive={(tagValue === t)}
          tag={t}
          font={props.firstFontByTags[t]}
          label={getTagLabelsForDisplay({
            tag: t,
            currentLocale,
            localizedLabel: tTagValueMsg(t as TagValueMsgLabelType),
          })}
          count={props.countByTags[t]}
          onClick={() => {
            setSelectorOpen(false);
          }}
          href={appendPickerQueryParams(
            t === "all"
              ? (localizedPickerBasePath || "/")
              : `${localizedPickerBasePath}/tag/${t}`,
            {text: preservedDemoText, filter: filterText},
          )}
        >
        </TagButton>)
      }
    </div>
  </>;

  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const selectorModalButton = <div className={cx(
    "btn btn-outline shadow-md",
    "flex md:hidden items-center justify-center gap-1"
  )} onClick={() => {
    setSelectorOpen(true);
  }} >
    <FaTag />
    <span>{tagValue ? tagDisplayLabel : ''}</span>
  </div>;

  const navbarContextOutside = useContext(NavbarContext);

  return (
    <LandingLayout title={title} fullWidth={true} className="relative">
      <GoogleFontHeaders preConnect={true} configList={allFontConfigList} strategy="block"/>

      <div className={cx(
        "flex gap-4",
        navbarContextOutside?.shouldHide ? "h-[100dvh]" : false,
        !navbarContextOutside?.shouldHide ? "h-[calc(100dvh-4rem)]" : false,
      )}>
        <div className={cx(
          "hidden md:block",
          "py-4 flex-0 w-[40%] min-w-[200px] h-full overflow-y-scroll",
        )}>
          <h1 className="text-lg text-gray-900 mb-2">{tLandingMsg('Free font tagged {tagValue} provided by Google fonts', {tagValue: tagDisplayLabel})}</h1>
          {(tTagDescMsg(tagValue as TagDescMsgLabelType) !== tagValue) && <p className="text-gray-600 ">{tTagDescMsg(tagValue as TagDescMsgLabelType)}</p>}

          <div className="h-4" />

          {tagSelectorContent}
        </div>
        <div className={cx(
          "py-4 flex-1 h-full w-full"
        )}>
          <div className="flex items-center justify-start gap-2 mb-4">
            {selectorModalButton}
            <div className={cx(
              "relative",
              "flex items-center justify-start gap-2",
              "input input-bordered bg-white/20 shadow-md focus:outline-none focus:shadow-lg",
              "w-full min-w-0",
            )}>
              <div className="flex items-center justify-center shrink-0">
                {(filterText !== debouncedFilterText) && <span className="inline-block h-4 w-4 text-black/50 loading loading-sm"/>}
                {(filterText === debouncedFilterText) && <FaSearch  className="inline-block h-4 w-4 text-black/50 flex items-center justify-start" /> }
              </div>
              {tagValue !== "all" && (
                <Link
                  className={cx(
                    "hidden md:inline-flex",
                    "items-center gap-0.5 shrink-0 max-w-[min(38vw,11rem)]",
                    "rounded-full border border-black/[0.08] bg-black/[0.05]",
                    "px-2.5 py-1 text-base font-medium leading-none text-black/65",
                    "hover:bg-black/[0.09] hover:text-black/80 transition-colors",
                  )}
                  href={appendPickerQueryParams(localizedPickerBasePath || "/", {
                    text: preservedDemoText,
                    filter: filterText,
                  })}
                >
                  <span className="truncate">{tagDisplayLabel}</span>
                  <IoClose className="h-4 w-4 shrink-0 opacity-55" aria-hidden />
                </Link>
              )}
              <input
                className="flex-1 min-w-0 h-12 w-full bg-transparent text-base placeholder-black/50"
                value={filterText}
                onChange={e => {
                  setFilterText(e.target.value);
                }}
                placeholder={t("landingMsg.Filter by font family")}
              />
            </div>
          </div>
          <div className="h-[calc(100%-4rem)]">
            {!loading && <VirtualList
                tagValue={tagValue}
                filterText={debouncedFilterText}
                initialFontItemList={initialFontItemList}
                placeholderText={(router.query.text as string | undefined) ?? props.placeholderText}
                pageSize={PAGE_SIZE}
                tagPageHref={(tag) =>
                  appendPickerQueryParams(
                    `${localizedPickerBasePath}/tag/${tag}`,
                    {text: preservedDemoText, filter: filterText},
                  )}
            />}
            {loading && <span className="loading loading-bars loading-sm"/>}
          </div>
        </div>
      </div>

      <ActionSheetWrapper size="fullscreen" isHidden={!isSelectorOpen} onCancel={() => {
        setSelectorOpen(false);
      }}>
        <div className="flex flex-wrap justify-start items-start gap-6 px-3">
          {tagSelectorContent}
        </div>
      </ActionSheetWrapper>
    </LandingLayout>
  );
};

const getTagStaticPaths = async (includePathLocale: boolean) => {
  const countByTags = await import(`../../../public/data/${FONT_DATA_FOLDER}/countByTags.json`)
    .then(res => res.default as Record<string, number>);
  const allTags = Object.keys(countByTags).filter((tag) => tag !== "all");

  const paths = includePathLocale
    ? locales
      .filter((item) => item.locale !== defaultLocale.locale)
      .flatMap((item) =>
        allTags.map((tag) => ({
          params: {
            pathLocale: item.locale,
            slugList: [tag],
          }
        }))
      )
    : allTags.map((tag) => ({
        params: {
          slugList: [tag],
        }
      }));

  return {
    paths,
    fallback: false,
  };
};

const makeStaticProps = (includePathLocale: boolean): GetStaticProps<PageProps> => {
  return async (context) => {
    const slugList = context.params?.slugList ?? [];
    const rawPathLocale = Array.isArray(context.params?.pathLocale)
      ? context.params.pathLocale[0]
      : context.params?.pathLocale;
    const localeForPage = includePathLocale ? rawPathLocale : defaultLocale.locale;
    const locale = (localeForPage ?? defaultLocale.locale) as LocaleStr;
    const tagValue = getTagValue(
      Array.isArray(slugList) ? slugList[0] : undefined,
    );

    const initialFontItemList = await listFonts({
      tagValue: tagValue,
      filterText: '',
      skip: 0,
      take: PAGE_SIZE
    });

    return {
      props: {
        initialFontItemList,
        countByTags: await import(`../../../public/data/${FONT_DATA_FOLDER}/countByTags.json`).then(res => res.default as Record<string, number>),
        firstFontByTags: await import(`../../../public/data/${FONT_DATA_FOLDER}/firstFontByTags.json`).then(res => res.default as Record<string, string>),
        placeholderText: null,
        ...(await getStaticPropsLocale(context)).props,
      } as PageProps
    };
  };
};

export const getStaticProps = makeStaticProps(false);
export const getStaticPropsWithPathLocale = makeStaticProps(true);
export const getStaticPathsForTagPage: GetStaticPaths = async () => getTagStaticPaths(false);
export const getStaticPathsForTagPageWithPathLocale: GetStaticPaths = async () => getTagStaticPaths(true);

export const getStaticPathsForPathLocaleIndexPage: GetStaticPaths = async () => {
  return {
    paths: locales
      .filter((item) => item.locale !== defaultLocale.locale)
      .map((item) => ({
        params: {
          pathLocale: item.locale
        }
      })),
    fallback: false,
  };
};

export default FontPickerPage;
