import React, {PropsWithChildren} from "react";
import {useI18n} from "@fontsensei/locales";
import Link from "next/link";
import MDX from "@mdx-js/runtime";
import {LandingLayout} from "../layout/SiteLayout";
import {useI18n as useI18nNextUtils} from "@nextutils/locales";
import {PRODUCT_NAME} from "@nextutils/config";

const AboutPage = () => {
  const t = useI18n();
  const aboutTitle = t("landingMsg.About");
  const tNextUtils = useI18nNextUtils();
  const metaTitle = `${aboutTitle} - ${PRODUCT_NAME} - ${tNextUtils("product.slogan")}`;

  return (
    <LandingLayout title={metaTitle}>
      <div className="py-8 max-w-3xl">
        <h1 className="text-2xl text-gray-900 mb-4">{aboutTitle}</h1>

        <div className="mb-6 flex items-center gap-4">
          <Link className="link" href="/privacy-policy.html">
            Privacy Policy
          </Link>
          <Link className="link" href="/terms.html">
            Terms of Service
          </Link>
        </div>
        <MDX components={{
          h2: (props: PropsWithChildren) => <h2
            className="mb-3 font-bold tracking-tight text-gray-900"
          >{props.children}</h2>,
          h3: (props: PropsWithChildren) => <h3 className="mb-3 font-semibold tracking-tight text-gray-900">{props.children}</h3>,
          li: (props: PropsWithChildren) => <li className="mb-3 font-normal text-gray-500"> - {props.children}</li>,
          p: (props: PropsWithChildren) => <p className="mb-3 font-normal text-gray-500">{props.children}</p>,
          a: (props: PropsWithChildren<{href: string}>) => <Link className="link" href={props.href}>{props.children}</Link>
        }}>
          {t("indexFaq")}
        </MDX>

      </div>
    </LandingLayout>
  );
};

export default AboutPage;
