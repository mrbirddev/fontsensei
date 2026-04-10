// templates/[[...slugList]].tsx

import {type GetStaticPaths, type GetStaticProps} from 'next';
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  type PropsWithChildren, useContext, type ReactNode
} from 'react';
import {
  getStaticPropsLocale,
  type LocaleStr,
  type TagValueMsgLabelType,
  type TagDescMsgLabelType,
  isNonLatinLocale,
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
import ProductIcon from "../ProductIcon";
import {IoLanguage} from "react-icons/io5";
import {FaBars, FaSearch} from "react-icons/fa";
import {FaGithub, FaTag} from "react-icons/fa6";
import {FontPickerPageContext} from "@fontsensei/components/fontPickerCommon";
import {langMap} from "@nextutils/i18n/locales";
import {defaultLocale, locales, PRODUCT_ICON, PRODUCT_NAME} from "@nextutils/config";
import ChooseLocaleModal from "@nextutils/i18n/ChooseLocaleModal";
import SwitchLocaleHint from "@nextutils/i18n/SwitchLocaleHint";
import useUserPreferencesStore from "@nextutils/useUserPreferencesStore";
import ModalDialog from "@nextutils/ui/modal/ModalDialog";
import {ModalTitle} from "@nextutils/ui/modal/commonComponents";
import ActionSheetWrapper from "@nextutils/ui/actionSheet/ActionSheetWrapper";
import {MdOutlineFeedback} from "react-icons/md";
import MDX from "@mdx-js/runtime";
import NextUtilsSeo from "@nextutils/seo/NextUtilsSeo";
import enTagValueMsg from "../../@fontsensei/locales/en/tagValueMsg";

const PAGE_SIZE = 10;

interface PageProps {
  initialFontItemList: FSFontItem[];
  countByTags: Record<string, number>;
  firstFontByTags: Record<string, string>;
  placeholderText: string | null;
}

export type MenuItem = {
  icon: ReactNode,
  label: string,
  className?: string,
  href?: Parameters<typeof Link>[0]['href'],
  target?: Parameters<typeof Link>[0]['target'],
  onClick?: () => void,
};
export type NavbarContextOpts = {
  shouldHide?: boolean;
  noSwitchLocaleHint?: boolean;
  extraMenuItems?: MenuItem[];
} | undefined;

export const NavbarContext = React.createContext<NavbarContextOpts>(undefined);

const GITHUB_LINK = "https://github.com/mrbirddev/fontsensei";
const Navbar = (props: {fullWidth?: boolean, style?: React.CSSProperties }) => {
  const [localeModalOpen, setLocaleModalOpen] = useState(false);

  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const lang = useMemo(() => (locales.filter(l => l.locale === currentLocale)[0])?.lang, [currentLocale]);

  const router = useRouter();

  const preferredLocale = useUserPreferencesStore(s => s.locale);

  const navbarContext = useContext(NavbarContext);

  const feedbackMsg = t("landingMsg.Feedback");

  const menuItems = useMemo(() => {
    return [
      ...(navbarContext?.extraMenuItems ?? [
        {
          icon: <MdOutlineFeedback />,
          label: feedbackMsg,
          href: GITHUB_LINK + "/issues/new",
          target: "_blank",
        },
        {
          icon: <FaGithub />,
          label: "GitHub",
          href: GITHUB_LINK,
          target: "_blank",
        }
      ] as MenuItem[]),
      // {
      //   icon: <IoLanguage />,
      //   label: preferredLocale && (preferredLocale !== currentLocale)
      //     ? lang + " | " + langMap[preferredLocale]
      //     : lang,
      //   href: "",
      //   onClick: () => {
      //     setLocaleModalOpen(true);
      //   },
      // } as MenuItem,
    ];
  }, [lang, router.pathname, navbarContext?.extraMenuItems, preferredLocale, feedbackMsg]);

  const pickerBasePath = useContext(FontPickerPageContext)?.basePath ?? "";
  const localizedPickerBasePath = `${currentLocale === defaultLocale.locale ? '' : `/${currentLocale}`}${pickerBasePath}`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (navbarContext?.shouldHide) {
    return false;
  }

  return <>
    <div className="h-16" />
    <div className="fixed left-0 top-0 right-0 z-10" style={props.style}>
      <div className={"container mx-auto px-4" + (props.fullWidth ? ' max-w-full' : '')}>
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="flex-1 flex items-center justify-start gap-1">
            <Link className="btn btn-ghost px-0 text-xl" href={localizedPickerBasePath || '/'}>
              <div style={{height: '3rem', width: '3rem'}}>
                <ProductIcon />
              </div>
            </Link>
            <div className="font-bold truncate hidden md:block">{PRODUCT_NAME}</div>
            <div className="btn btn-ghost" onClick={() => {
              setLocaleModalOpen(true);
            }} >
              <IoLanguage />
              <span>{preferredLocale && (preferredLocale !== currentLocale)
                ? lang + " | " + langMap[preferredLocale]
                : lang}</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1">
            <div className="hidden md:inline-flex items-center">
              {menuItems.map((item) => {
                const {icon, label, className, href, target, onClick} = item;
                if (href) {
                  return <Link key={label} className={className ?? "btn btn-ghost"} href={href} target={target} onClick={onClick}>
                    {icon}
                    <span>{label}</span>
                  </Link>
                } else {
                  return <div key={label} className={className ?? "btn btn-ghost"} onClick={onClick} >
                    {icon}
                    <span>{label}</span>
                  </div>
                }
              })}
            </div>
            <div className="block md:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost" onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}><FaBars /></div>
            </div>

            <ModalDialog isOpen={isMenuOpen} setOpen={setIsMenuOpen}>
              <ModalTitle onCancel={() => setIsMenuOpen(false)}>
              </ModalTitle>
              {menuItems.map(item => {
                const {icon, label, className, href, target, onClick} = item;
                if (href) {
                  return <Link key={label} className={className ?? "btn btn-ghost"} href={href} target={target} onClick={onClick}>
                    {icon}
                    <span>{label}</span>
                  </Link>
                } else {
                  return <div key={label} className={className ?? "btn btn-ghost"} onClick={onClick} >
                    {icon}
                    <span>{label}</span>
                  </div>
                }
              })}
            </ModalDialog>
            {/*<div className="dropdown dropdown-end">*/}
            {/*  <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">*/}
            {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>*/}
            {/*  </div>*/}
            {/*  <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">*/}
            {/*    <li><a>Item 1</a></li>*/}
            {/*    <li>*/}
            {/*      <a>Parent</a>*/}
            {/*      <ul className="p-2">*/}
            {/*        <li><a>Submenu 1</a></li>*/}
            {/*        <li><a>Submenu 2</a></li>*/}
            {/*      </ul>*/}
            {/*    </li>*/}
            {/*    <li><a>Item 3</a></li>*/}
            {/*  </ul>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </div>
    <ChooseLocaleModal isOpen={localeModalOpen} setOpen={setLocaleModalOpen} />
    {navbarContext?.noSwitchLocaleHint && <SwitchLocaleHint />}
  </>
};
const LandingLayout = (props: PropsWithChildren & {
  title?: string,
  className?: string,
  fullWidth?: boolean
}) => {
  return (<>
    <NextUtilsSeo title={props.title} />
    <main
      className={
        cx(
          !props.fullWidth && "min-h-screen container mx-auto",
          "px-4 text-grey-700"
        )
      }
    >
      <Navbar fullWidth={props.fullWidth} />
      {props.fullWidth && <div className={cx(
        "w-full",
        props.className
      )}>
        {props.children}
      </div>}
      {!props.fullWidth && <div className={"container mx-auto " + (props.className ?? "")}>
        {props.children}
      </div>}
    </main>
  </>);
};

const getDefaultTag = (currentLocale: LocaleStr) => {
  switch (currentLocale) {
    case "ja":
      return "lang_ja";
    case "zh-cn":
      return "lang_zh-hans";
    case "zh-tw":
      return "lang_zh-hant";
    case "ko":
      return "lang_ko";
    default:
      return "all";
  }
}

const getTagValue = (raw_tagValue: string | undefined, currentLocale: LocaleStr) => {
  if (raw_tagValue) {
    return raw_tagValue;
  }

  return getDefaultTag(currentLocale);
};

/** Keeps demo `text` in the URL when navigating (static export: normal href + client Link). */
const appendUrlTextParam = (path: string, text: string | undefined): string => {
  if (!text) {
    return path;
  }
  const params = new URLSearchParams({text});
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}${params.toString()}`;
};

const getEnTagLabel = (tag: string): string => {
  return (enTagValueMsg as Record<string, string>)[tag] ?? tag;
};

const getTagLabelsForDisplay = (opts: {
  tag: string;
  currentLocale: LocaleStr;
  localizedLabel: string;
  disableTranslation?: boolean;
}) => {
  const {tag, currentLocale, localizedLabel, disableTranslation} = opts;

  if (tag === "all") {
    return {primary: localizedLabel, secondary: undefined as string | undefined};
  }

  if (!isNonLatinLocale(currentLocale) || disableTranslation) {
    return {primary: localizedLabel, secondary: undefined as string | undefined};
  }

  const enLabel = getEnTagLabel(tag);
  if (!enLabel || enLabel === localizedLabel) {
    return {primary: localizedLabel, secondary: undefined as string | undefined};
  }

  return {primary: enLabel, secondary: localizedLabel};
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
  const defaultTag = useMemo(() => getDefaultTag(currentLocale), [currentLocale]);
  const tagValue = useMemo(() => getTagValue(raw_tagValue, currentLocale), [raw_tagValue, currentLocale]);

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
              href={appendUrlTextParam(
                (t === defaultTag || t === "all")
                  ? (localizedPickerBasePath || "/")
                  : `${localizedPickerBasePath}/tag/${t}`,
                preservedDemoText,
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
          href={appendUrlTextParam(
            (t === defaultTag || t === "all")
              ? (localizedPickerBasePath || "/")
              : `${localizedPickerBasePath}/tag/${t}`,
            preservedDemoText,
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
          <h1 className="text-lg text-gray-900 mb-2">{tLandingMsg('Free font tagged {tagValue} provided by Google fonts', { tagValue: tagDisplayLabel })}</h1>
          {(tTagDescMsg(tagValue as TagDescMsgLabelType) !== tagValue) && <p className="text-gray-600 ">{tTagDescMsg(tagValue as TagDescMsgLabelType)}</p>}

          <div className="h-4" />

          {tagSelectorContent}

          <div className="h-4" />

          <MDX components={{
            h2: (props: PropsWithChildren) => <h2
              className="mb-3 font-bold tracking-tight text-gray-900"
            >{props.children}</h2>,
            li: (props: PropsWithChildren) => <li className="mb-3 font-normal text-gray-500"> - {props.children}</li>,
            p: (props: PropsWithChildren) => <p className="mb-3 font-normal text-gray-500">{props.children}</p>,
            a: (props: PropsWithChildren<{href: string}>) => <Link className="link" href={props.href}>{props.children}</Link>
          }}>
            {t('indexFaq')}
          </MDX>
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
              "w-full",
            )}>
              <div className="flex items-center justify-center">
                {(filterText !== debouncedFilterText) && <span className="inline-block h-4 w-4 text-black/50 loading loading-sm"/>}
                {(filterText === debouncedFilterText) && <FaSearch  className="inline-block h-4 w-4 text-black/50 flex items-center justify-start" /> }
              </div>
              <input
                className="flex-1 h-12 w-full bg-transparent placeholder-black/50"
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
  const allTags = Object.keys(countByTags);

  const paths = includePathLocale
    ? locales
      .filter((item) => item.locale !== defaultLocale.locale)
      .flatMap((item) => {
        const localeDefaultTag = getDefaultTag(item.locale as LocaleStr);
        return allTags
          .filter((tag) => tag !== localeDefaultTag)
          .map((tag) => ({
            params: {
              pathLocale: item.locale,
              slugList: [tag],
            }
          }));
      })
    : allTags
      .filter((tag) => tag !== getDefaultTag(defaultLocale.locale as LocaleStr))
      .map((tag) => ({
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
      locale
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
