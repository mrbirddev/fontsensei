import {noIndexPathList, noLangAltList, PRODUCT_DOMAIN, PRODUCT_NAME} from "@nextutils/config";
import {allLocaleStrList, useCurrentLocale, useI18n} from "@nextutils/locales";
import {getCanonicalUrl, hackAsPath} from "@nextutils/i18n/locales";
import {useRouter} from "next/router";
import {useIsClient} from "usehooks-ts";
import React from "react";
import {NextSeo} from "next-seo";

const NextUtilsSeo = (props: {
  title?: string
}) => {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const isClient = useIsClient();
  const canonical = getCanonicalUrl(currentLocale, router.asPath, isClient);

  const noIndex = !!noIndexPathList.find(prefix => hackAsPath(router.asPath, isClient).startsWith(prefix));
  const noLangAlt = !!noLangAltList.find(prefix => hackAsPath(router.asPath, isClient).startsWith(prefix));

  return  (
    <NextSeo
      noindex={noIndex}
      title={props.title ?? `${PRODUCT_NAME} - ${t('product.slogan')}`}
      description={`${PRODUCT_NAME} - ${t('product.slogan')}`}
      canonical={canonical}
      openGraph={{
        type: 'website',
        title: props.title ?? `${PRODUCT_NAME} - ${t('product.slogan')}`,
        locale: currentLocale,
        url: canonical,
        siteName: `${PRODUCT_NAME} - ${t('product.slogan')}`,
        images: [{ url: `https://${PRODUCT_DOMAIN}/icon.png` }]
      }}
      languageAlternates={
        noLangAlt ? [] : [
          ...allLocaleStrList.filter(localeStr => localeStr !== currentLocale).map(localeStr => {
            return {
              hrefLang: localeStr,
              href: getCanonicalUrl(localeStr, router.asPath, isClient),
            };
          }),

          // Use the x-default value for unmatched languages.
          // The reserved x-default value is used when no other language/region matches the user's browser setting.
          {hrefLang: 'x-default', href: canonical}
        ]
      }
    />
  );
};

export default NextUtilsSeo;
