import React, {ReactNode, useMemo, useState} from "react";
import ProductIcon from "../ProductIcon";
import Link from "next/link";
import ChooseLocaleModal from "../i18n/ChooseLocaleModal";
import { useCurrentLocale, useI18n} from "@fontsensei/locales";
import {IoLanguage} from "react-icons/io5";
import {PRODUCT_NAME} from "../productConstants";
import locales, {langMap} from "../i18n/locales";
import {FaBars} from "react-icons/fa";
import {useRouter} from "next/router";
import {compact} from "lodash-es";
import SwitchLocaleHint from "../i18n/SwitchLocaleHint";
import useUserPreferencesStore from "../page/useUserPreferencesStore";

export type MenuItem = {
  icon: ReactNode,
  label: string,
  className?: string,
  href?: Parameters<typeof Link>[0]['href'],
  onClick?: () => void,
};

const Navbar = (props: {fullWidth?: boolean, style?: React.CSSProperties, extraMenuItems?: MenuItem[] }) => {
  const [localeModalOpen, setLocaleModalOpen] = useState(false);

  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const lang = useMemo(() => (locales.filter(l => l.locale === currentLocale)[0])?.lang, [currentLocale]);

  const router = useRouter();

  const preferredLocale = useUserPreferencesStore(s => s.locale);
  // console.log({preferredLocale});

  // switch language dynamically
  // 1. is buggy for SSG pages
  // 2. blogs are not completely i18n, some of them are missing
  // so let's disable it for blogs
  const shouldProvideLocaleSwitch = !router.pathname.startsWith('/blogs');

  const menuItems = useMemo(() => {
    return compact([
      ...(props.extraMenuItems ?? []),
      shouldProvideLocaleSwitch ? {
        icon: <IoLanguage />,
        label: preferredLocale && (preferredLocale !== currentLocale)
          ? lang + " | " + langMap[preferredLocale]
          : lang,
        href: "",
        onClick: () => {
          setLocaleModalOpen(true);
        },
      } as MenuItem : undefined,
    ]);
  }, [lang, router.pathname, props.extraMenuItems, preferredLocale]);

  return <>
    <div className="h-16" />
    <div className="fixed left-0 top-0 right-0 z-10" style={props.style}>
      <div className={"container mx-auto px-4" + (props.fullWidth ? ' max-w-full' : '')}>
        <div className="navbar px-0">
          <div className="navbar-start gap-2">
            <Link className="btn btn-ghost px-0 text-xl" href="/">
              <div style={{height: '3rem', width: '3rem'}}>
                <ProductIcon />
              </div>
            </Link>
            <h1 className="font-bold truncate">{PRODUCT_NAME}</h1>
          </div>
          <div className="navbar-center hidden md:flex">
            {/*<ul className="menu menu-horizontal px-1">*/}
            {/*  <li><a>Item 1</a></li>*/}
            {/*  <li>*/}
            {/*    <details>*/}
            {/*      <summary>Parent</summary>*/}
            {/*      <ul className="p-2">*/}
            {/*        <li><a>Submenu 1</a></li>*/}
            {/*        <li><a>Submenu 2</a></li>*/}
            {/*      </ul>*/}
            {/*    </details>*/}
            {/*  </li>*/}
            {/*  <li><a>Item 3</a></li>*/}
            {/*</ul>*/}
          </div>
          <div className="navbar-end">
            <div className="hidden md:inline-flex items-center">
              {menuItems.map((item) => {
                const {icon, label, className, href, onClick} = item;
                if (href) {
                  return <Link key={label} className={className ?? "btn btn-ghost"} href={href} onClick={onClick}>
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
            <div className="dropdown dropdown-end block md:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost"><FaBars /></div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {menuItems.map(item => {
                  const {icon, label, className, href, onClick} = item;
                  if (href) {
                    return <Link key={label} className={className ?? "btn btn-ghost"} href={href} onClick={onClick}>
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
              </ul>
            </div>
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
    {shouldProvideLocaleSwitch && <ChooseLocaleModal isOpen={localeModalOpen} setOpen={setLocaleModalOpen} />}
    {shouldProvideLocaleSwitch && <SwitchLocaleHint />}
    </>
};

export default Navbar;
