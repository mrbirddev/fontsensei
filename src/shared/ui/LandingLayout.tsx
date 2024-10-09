import Navbar, {MenuItem} from "../../browser/landing/Navbar";
import React, {type PropsWithChildren} from "react";
import {PRODUCT_DOMAIN, PRODUCT_NAME} from "../../browser/productConstants";
import {useI18n} from "@fontsensei/locales";
import {cx} from "@emotion/css";
import ProductIcon from "../../browser/ProductIcon";

const Footer = () => {
  const PRODUCT_LINK = `https://${PRODUCT_DOMAIN}`;
  return (
    <footer className="bg-white dark:bg-gray-900 mt-[6rem]">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <a href={PRODUCT_LINK} className="flex items-center">
            <img src="/icon.png" className="h-8 me-3" alt="Logo"/>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{PRODUCT_NAME}</span>
          </a>
          {/*<a href={TWITTER_LINK} target="_blank" className="mt-6 hover:underline flex justify-start items-center gap-1">*/}
          {/*  <span>Brewed ☕ </span><span>by {TWITTER_ACCOUNT}</span> 🚧*/}
          {/*</a>*/}
        </div>
      </div>
    </footer>
  );
};

const MinimalFooter = () => {
  const PRODUCT_LINK = `https://${PRODUCT_DOMAIN}`;
  return <div className="h-8">
    <a href={PRODUCT_LINK} className="flex items-center">
      <div style={{ height: '2rem', width: '2rem' }}>
        <ProductIcon />
      </div>
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{PRODUCT_NAME}</span>
    </a>
  </div>
};
const LandingLayout = (props: PropsWithChildren & {
  className?: string,
  fullWidth?: boolean
}) => {
  return (
    <main
      className={
        cx(
          !props.fullWidth && "min-h-screen container mx-auto",
          "px-4 text-grey-700"
        )
      }
      style={{
        background: 'linear-gradient(to right, rgb(104, 136, 53), rgb(89, 138, 135))'
      }}
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
      {props.fullWidth && <MinimalFooter />}
      {!props.fullWidth && <Footer />}
    </main>
  );
};
export default LandingLayout;
