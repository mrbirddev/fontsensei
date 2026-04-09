import React from "react";
import {buildLocalizedPath} from "./locales";
import {useScopedI18n} from "@nextutils/locales";
import {useRouter} from "next/router";
import Link from "next/link";
import useUserPreferencesStore from "@nextutils/useUserPreferencesStore";
import {locales} from "@nextutils/config";
import ActionSheetWrapper from "@nextutils/ui/actionSheet/ActionSheetWrapper";
import {cx} from "@emotion/css";

const ChooseLocaleModal = (props: {
  isOpen: boolean,
  setOpen: (o: boolean) => void,
}) => {
  const tI18nMsg = useScopedI18n('i18nMsg');
  const router = useRouter();

  return (
    <ActionSheetWrapper
      title={tI18nMsg('Choose language')}
      onCancel={() => props.setOpen(false)}
      isHidden={!props.isOpen}
    >
      <div className="flex flex-wrap justify-start items-start gap-6">
        {locales.map(item => {
          return <Link key={item.locale} className="link link-ghost" href={buildLocalizedPath(item.locale, router.asPath, true)} onClick={() => {
            useUserPreferencesStore.getState().setLocale(item.locale);
            props.setOpen(false);
          }}>
            {item.lang}
          </Link>
        })}
      </div>
    </ActionSheetWrapper>
  );
}

export default ChooseLocaleModal;
