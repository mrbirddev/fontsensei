import {allLocaleStrList, useCurrentLocale, useI18n} from "@fontsensei/locales";
import {useRouter} from "next/router";
import {getCanonicalUrl} from "../../browser/i18n/locales";
import {NextSeo} from "next-seo";
import {PRODUCT_DOMAIN, PRODUCT_NAME} from "../../browser/productConstants";
import React from "react";
import {AppFC, AppMiddleware} from "./AppMiddleware";

const i18nLangAltHead: AppMiddleware = (App) => {
  const Augmented: AppFC = (props) => {
    const t = useI18n();
    const currentLocale = useCurrentLocale();
    const router = useRouter();
    const canonical = getCanonicalUrl(currentLocale, router.asPath);

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
              href: getCanonicalUrl(localeStr, router.asPath),
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
      <App {...props}/>
    </>;
  };

  return Augmented;
};

export default i18nLangAltHead;
