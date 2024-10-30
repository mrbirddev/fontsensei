import React from "react";
import {hackAsPath} from "./locales";
import {useScopedI18n} from "@nextutils/locales";
import {useRouter} from "next/router";
import Link from "next/link";
import useUserPreferencesStore from "@nextutils/useUserPreferencesStore";
import MobileOnlyModal from "@nextutils/ui/modal/MobileOnlyModal";
import {ModalTitle} from "@nextutils/ui/modal/commonComponents";
import {locales} from "@nextutils/config";

const ChooseLocaleModal = (props: {
  isOpen: boolean,
  setOpen: (o: boolean) => void,
}) => {
  const tI18nMsg = useScopedI18n('i18nMsg');
  const router = useRouter();

  return (
    <MobileOnlyModal isOpen={props.isOpen} setOpen={props.setOpen}>
      <ModalTitle>
        {tI18nMsg('Choose language')}
      </ModalTitle>
      <div className="flex flex-wrap justify-start items-start gap-6">
        {locales.map(item => {
          return <Link key={item.locale} className="link link-ghost" href={hackAsPath(router.asPath)} locale={item.locale} onClick={() => {
            useUserPreferencesStore.getState().setLocale(item.locale);
            props.setOpen(false);
          }}>
            {item.lang}
          </Link>
        })}
      </div>
    </MobileOnlyModal>
  );
}

export default ChooseLocaleModal;
