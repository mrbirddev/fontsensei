import React from "react";
import locales from "./locales";
import {useChangeLocale, useScopedI18n} from "@fontsensei/locales";
import {ModalTitle} from "@fontsensei/components/modal/commonComponents";
import Link from "next/link";
import {useRouter} from "next/router";
import useUserPreferencesStore from "../page/useUserPreferencesStore";

const ChooseLocaleModal = (props: {
  isOpen: boolean,
  setOpen: (o: boolean) => void,
}) => {
  const tI18nMsg = useScopedI18n('i18nMsg');
  const changeLocale = useChangeLocale();
  const router = useRouter();

  return (
    <dialog id="my_modal_1" className={"modal " + (props.isOpen ? 'modal-open' : '')}>
      <div className="modal-box text-gray-700 w-11/12 max-w-5xl">
        <ModalTitle onCancel={() => props.setOpen(false)}>
          {tI18nMsg('Choose language')}
        </ModalTitle>

        <div className="flex flex-wrap justify-start items-start gap-6">
          {locales.map(item => {
            // the href is for Google spiders
            return <Link key={item.locale} className="link link-ghost" href={router.asPath} locale={item.locale} onClick={(e) => {
              e.preventDefault();

              // change on the client side instead
              changeLocale(item.locale);
              useUserPreferencesStore.getState().setLocale(item.locale);
              props.setOpen(false);
            }}>{item.lang}</Link>
          })}
        </div>

      </div>
    </dialog>
  );
}

export default ChooseLocaleModal;
