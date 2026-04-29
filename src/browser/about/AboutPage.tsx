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
  // README-style markdown uses `./public/...`; under `/about` it's a relative URL and breaks.
  // Normalize to Next.js static root (`public/` is served at `/`).
  const indexFaqContent = t("indexFaq").replaceAll("./public/", "/");

  return (
    <LandingLayout title={metaTitle}>
      <div className="py-8 max-w-3xl">
        <h1 className="text-2xl text-gray-900 mb-4">{aboutTitle}</h1>

        <div className="mb-6">
          <Link className="link mr-4" href="/privacy-policy.html">
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
          li: (props: PropsWithChildren) => <li className="mb-3 font-normal text-gray-500"> - {props.children}</li>,
          p: (props: PropsWithChildren) => <p className="mb-3 font-normal text-gray-500">{props.children}</p>,
          a: (props: PropsWithChildren<{href: string}>) => <Link className="link" href={props.href}>{props.children}</Link>
        }}>
          {indexFaqContent}
        </MDX>

      </div>
    </LandingLayout>
  );
};

export default AboutPage;
