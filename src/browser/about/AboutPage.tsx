import React, {PropsWithChildren} from "react";
import {useI18n} from "@fontsensei/locales";
import Link from "next/link";
import MDX from "@mdx-js/runtime";
import {LandingLayout} from "../layout/SiteLayout";

const AboutPage = () => {
  const t = useI18n();

  return (
    <LandingLayout title="About">
      <div className="py-8 max-w-3xl">
        <MDX components={{
          h2: (props: PropsWithChildren) => <h2
            className="mb-3 font-bold tracking-tight text-gray-900"
          >{props.children}</h2>,
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
