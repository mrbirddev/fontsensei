import {FaCode, FaGithub, FaUser} from "react-icons/fa6";
import React from "react";
import {FaExternalLinkAlt} from "react-icons/fa";
import {FontPickerPageContextOpts} from "@fontsensei/components/fontPickerCommon";
import EmbedModal from "./embed/EmbedModal";
import {fontFamilyToUrlParam} from "../../@fontsensei/utils";
import useActionSheetStore from "@nextutils/ui/actionSheet/useActionSheetStore";
import {useCurrentLocale, useI18n} from "@fontsensei/locales";
import {defaultLocale} from "@nextutils/config";
import {useRouter} from "next/router";

/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;

export const Toolbar: NonNullable<FontPickerPageContextOpts>['Toolbar'] = ({fontItem}) => {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const pathPrefix = currentLocale === defaultLocale.locale ? "" : `/${currentLocale}`;
  const similarParams = new URLSearchParams();
  if (typeof router.query.text === "string") {
    similarParams.set("text", router.query.text);
  }
  if (typeof router.query.filter === "string") {
    similarParams.set("filter", router.query.filter);
  }
  const similarPath = `${pathPrefix}/similar/${fontFamilyToUrlParam(fontItem.family)}`;
  const similarHref = similarParams.toString()
    ? `${similarPath}?${similarParams.toString()}`
    : similarPath;
  return (<div className="flex items-center justify-start gap-2 mt-2">
    <div className="btn btn-sm btn-outline animate-none transition-none" onClick={(e) => {
      e.stopPropagation();
      useActionSheetStore.getState().push(<EmbedModal
        content={`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${
          fontFamilyToUrlParam(fontItem.family)
        }${
          fontItem.metadata.defaultSuffix
        }&display=swap" rel="stylesheet">`}
        isOpen={true}
        setOpen={() => {
          useActionSheetStore.getState().pop();
        }}
      />);
    }}>
      <FaCode/> {t("landingMsg.Embed")}
    </div>
    <a
      className="btn btn-sm btn-ghost animate-none transition-none"
      href={similarHref}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      Similar fonts
    </a>
    <a
      className="btn btn-sm btn-ghost animate-none transition-none"
      href={'https://fonts.google.com/specimen/' + fontItem.family.split(' ').join('+')}
      target="_blank"
      onClick={(e) => {
        e.stopPropagation();
      }}
    ><FaExternalLinkAlt /> Google</a>
    <a
      className="btn btn-sm btn-ghost animate-none transition-none"
      href={'https://fonts.google.com/specimen/' + fontItem.family.split(' ').join('+') + '/about'}
      target="_blank"
    >
      <FaUser />
      {fontItem.metadata.designers.join(',')}
    </a>
  </div>);
}
