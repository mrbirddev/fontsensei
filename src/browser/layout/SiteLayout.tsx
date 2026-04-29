import React, {PropsWithChildren, ReactNode, useContext, useMemo, useState} from "react";
import {cx} from "@emotion/css";
import {FontPickerPageContext} from "@fontsensei/components/fontPickerCommon";
import {useCurrentLocale, useI18n} from "@fontsensei/locales";
import {defaultLocale, locales, PRODUCT_NAME} from "@nextutils/config";
import ChooseLocaleModal from "@nextutils/i18n/ChooseLocaleModal";
import {getCanonicalPath} from "@nextutils/i18n/locales";
import {langMap} from "@nextutils/i18n/locales";
import SwitchLocaleHint from "@nextutils/i18n/SwitchLocaleHint";
import NextUtilsSeo from "@nextutils/seo/NextUtilsSeo";
import ModalDialog from "@nextutils/ui/modal/ModalDialog";
import {ModalTitle} from "@nextutils/ui/modal/commonComponents";
import useUserPreferencesStore from "@nextutils/useUserPreferencesStore";
import Link from "next/link";
import {useRouter} from "next/router";
import {FaBars} from "react-icons/fa";
import {FaCircleInfo, FaGithub} from "react-icons/fa6";
import {IoLanguage} from "react-icons/io5";
import {MdOutlineFeedback} from "react-icons/md";
import ProductIcon from "../ProductIcon";

export type MenuItem = {
  icon: ReactNode,
  label: string,
  className?: string,
  href?: Parameters<typeof Link>[0]["href"],
  target?: Parameters<typeof Link>[0]["target"],
  onClick?: () => void,
};

export type NavbarContextOpts = {
  shouldHide?: boolean;
  noSwitchLocaleHint?: boolean;
  extraMenuItems?: MenuItem[];
} | undefined;

export const NavbarContext = React.createContext<NavbarContextOpts>(undefined);

const GITHUB_LINK = "https://github.com/mrbirddev/fontsensei";

export const Navbar = (props: {fullWidth?: boolean, style?: React.CSSProperties }) => {
  const [localeModalOpen, setLocaleModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const lang = useMemo(() => (locales.filter(l => l.locale === currentLocale)[0])?.lang, [currentLocale]);
  const router = useRouter();

  const preferredLocale = useUserPreferencesStore(s => s.locale);
  const navbarContext = useContext(NavbarContext);
  const feedbackMsg = t("landingMsg.Feedback");
  const aboutMsg = t("landingMsg.About");
  const pickerBasePath = useContext(FontPickerPageContext)?.basePath ?? "";
  const localizedPickerBasePath = `${currentLocale === defaultLocale.locale ? "" : `/${currentLocale}`}${pickerBasePath}`;

  const menuItems = useMemo(() => {
    return [
      ...(navbarContext?.extraMenuItems ?? [
        {
          icon: <FaCircleInfo />,
          label: aboutMsg,
          href: getCanonicalPath(currentLocale, "/about"),
        },
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
    ];
  }, [aboutMsg, feedbackMsg, localizedPickerBasePath, navbarContext?.extraMenuItems, router.pathname]);

  if (navbarContext?.shouldHide) {
    return false;
  }

  return <>
    <div className="h-16" />
    <div className="fixed left-0 top-0 right-0 z-10 bg-white" style={props.style}>
      <div className={"container mx-auto px-4" + (props.fullWidth ? " max-w-full" : "")}>
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="flex-1 flex items-center justify-start gap-1">
            <Link className="btn btn-ghost px-0 text-xl" href={localizedPickerBasePath || "/"}>
              <div style={{height: "3rem", width: "3rem"}}>
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
                  </Link>;
                }
                return <div key={label} className={className ?? "btn btn-ghost"} onClick={onClick} >
                  {icon}
                  <span>{label}</span>
                </div>;
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
                  </Link>;
                }
                return <div key={label} className={className ?? "btn btn-ghost"} onClick={onClick} >
                  {icon}
                  <span>{label}</span>
                </div>;
              })}
            </ModalDialog>
          </div>
        </div>
      </div>
    </div>
    <ChooseLocaleModal isOpen={localeModalOpen} setOpen={setLocaleModalOpen} />
    {navbarContext?.noSwitchLocaleHint && <SwitchLocaleHint />}
  </>;
};

export const LandingLayout = (props: PropsWithChildren<{
  title?: string,
  className?: string,
  fullWidth?: boolean
}>) => {
  return <>
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
  </>;
};
