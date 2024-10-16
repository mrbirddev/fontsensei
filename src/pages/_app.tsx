/* eslint-disable no-restricted-imports */

import {type AppProps} from "next/app";

import "../styles/globals.css";
import '@szhsin/react-menu/dist/index.css';

import React, {useEffect, useState} from "react";
// import nightwind from "nightwind/helper";
import Head from "next/head";
import {PRODUCT_DOMAIN, PRODUCT_NAME} from "../browser/productConstants";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {allLocaleStrList, I18nProvider, useCurrentLocale, useI18n} from "@fontsensei/locales";
import {useRouter} from "next/router";
import LoadingBar from "react-top-loading-bar";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react"
import {NextSeo} from "next-seo";
import {api} from "../shared/api";
import invariant from "tiny-invariant";
import {getLocaleUrlPrefix} from "../browser/i18n/locales";

const originalToastError = toast.error;
// do not auto close error toasts by default
toast.error = (...args) => originalToastError(args[0], {
  autoClose: false,
  ...args[1],
});

const HeadElements = (props: {isStaticPage: boolean}) => {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  // console.log(router);

    // https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
    // a guard to prevent that I make such mistakes again.
    invariant(!(props.isStaticPage && router.pathname.indexOf('[') < 0));

    const canonical = `https://${PRODUCT_DOMAIN}${getLocaleUrlPrefix(currentLocale)}${
      router.pathname === '/'
       ? ''
      : router.pathname
    }`;

  const seo = <NextSeo
    title={`${PRODUCT_NAME} - ${t('product.slogan')}`}
    description={`${PRODUCT_NAME} - ${t('product.slogan')}`}
    canonical={canonical}
    openGraph={{
      type: 'website',
      locale: currentLocale,
      url: canonical,
      siteName: `${PRODUCT_NAME} - ${t('product.slogan')}`,
      images: [{ url: `https://${PRODUCT_DOMAIN}/icon.png` }]
    }}
    languageAlternates={
      [
        ...allLocaleStrList.filter(localeStr => localeStr !== currentLocale).map(localeStr => {
          return {
            hrefLang: localeStr,
            href: `https://${
              PRODUCT_DOMAIN
            }${
              getLocaleUrlPrefix(localeStr)
            }${
              router.pathname === '/' ? '' : router.pathname
            }`
          };
        }),

        // Use the x-default value for unmatched languages.
        // The reserved x-default value is used when no other language/region matches the user's browser setting.
        {hrefLang: 'x-default', href: canonical}
      ]
    }
  />;

  return <>
    {seo}
    <Head>
      <link rel="icon" href="/icon.png"/>
      {/*<script dangerouslySetInnerHTML={{__html: nightwind.init()}}/>*/}
    </Head>
  </>;
};

function MyApp({
                 Component,
                 pageProps,
               }: AppProps) {
  const {session, ...restPageProps} = pageProps;
  // console.log('_app.tsx ', typeof window === 'undefined' ? 'backend' : 'frontend');
  // console.log({ pageProps });
  // console.log( appRouter, (appRouter as NextRouter).locale);

  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // START VALUE - WHEN LOADING WILL START
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });

    // COMPLETE VALUE - WHEN LOADING IS FINISHED
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });

    router.events.on("routeChangeError", () => {
      setProgress(0);
    });
  }, []);

  return (
    <>
      <I18nProvider locale={pageProps.locale}>
        <HeadElements isStaticPage={
          // @ts-expect-error - Component is NextPage
          !!Component.getStaticProps
        } />
        <LoadingBar
          color="oklch(0.4912 0.3096 275.75)"
          progress={progress}
          waitingTime={400}
          onLoaderFinished={() => {
            setProgress(0);
          }}
        />
        <Component {...restPageProps} />
        <ToastContainer/>
      </I18nProvider>
      <SpeedInsights/>
      <Analytics/>
    </>
  );
};

export default api.withTRPC(MyApp);
