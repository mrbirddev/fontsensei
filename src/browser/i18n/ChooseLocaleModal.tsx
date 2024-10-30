import React from "react";
import locales, {getCanonicalPath} from "./locales";
import {useChangeLocale, useScopedI18n} from "@fontsensei/locales";
import {ModalTitle} from "@fontsensei/components/modal/commonComponents";
import {useRouter} from "next/router";
import useUserPreferencesStore from "../page/useUserPreferencesStore";
import MobileOnlyModal from "@fontsensei/components/modal/MobileOnlyModal";

const ChooseLocaleModal = (props: {
  isOpen: boolean,
  setOpen: (o: boolean) => void,
}) => {
  const tI18nMsg = useScopedI18n('i18nMsg');
  const router = useRouter();

  console.log("ChooseLocaleModal", {asPath: router.asPath});

  return (
    <MobileOnlyModal isOpen={props.isOpen} setOpen={props.setOpen}>
      <ModalTitle>
        {tI18nMsg('Choose language')}
      </ModalTitle>
      <div className="flex flex-wrap justify-start items-start gap-6">
        {locales.map(item => {
          /*
            TODO WHY???
            use <a> not next/link because of this bug
            https://github.com/vercel/next.js/issues/72063
          */
          return <a key={item.locale} className="link link-ghost" href={getCanonicalPath(item.locale, router.asPath)} onClick={() => {
            useUserPreferencesStore.getState().setLocale(item.locale);
            props.setOpen(false);
          }}>
            {item.lang}
          </a>
        })}
      </div>
    </MobileOnlyModal>
  );
}

export default ChooseLocaleModal;
