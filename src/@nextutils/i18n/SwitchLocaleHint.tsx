import React, {useEffect, useRef, useState} from "react";
import {
  type LocaleStr,
  matchClosestLocale,
  useChangeLocale,
  useCurrentLocale
} from "@nextutils/locales";
import {PRODUCT_NAME} from "@nextutils/config";
import {getPreferredLocaleInBrowser, langMap} from "./locales";
import {tClient} from "@nextutils/trpc/api";
import {type Id, toast} from "react-toastify";
import useUserPreferencesStore from "@nextutils/useUserPreferencesStore";

const SwitchLocaleHint = () => {
  const changeLocale = useChangeLocale();
  const sourceLocale = useCurrentLocale();

  const [isOpen, setOpen] = useState(false);
  const [targetLocale, setTargetLocale] = useState(undefined as LocaleStr | undefined);

  useEffect(() => {
    const preferredLocale = matchClosestLocale(
       getPreferredLocaleInBrowser() ?? ""
    );
    if (preferredLocale) {
      /*
      if it's already there
      it means this user know where to set the language
      no need to open this modal at all

      This modal is for first time visitors. Let them know there's
      a localized version (and possibly share) is enough
       */
      return;
    }

    const browserLocale = matchClosestLocale(
      navigator.language.split('-')[0]?.toLowerCase()
    );
    if (browserLocale) {
      if (browserLocale !== sourceLocale) {
        setTargetLocale(browserLocale);
        setOpen(true);
      } else {
        // do nothing
      }
      return;
    }

  }, []);

  const dismissRef = useRef<Id | null>(null);
  useEffect(() => {
    if (!isOpen || !targetLocale) {
      return;
    }

    if (dismissRef.current) {
      return;
    }

    void tClient.profile.loadLocaleRootDict.query({
      targetLocale
    }).then((rootDict) => {
      const msg = rootDict.i18nMsg["{productName} is available in the {targetLang} language"]
        .replace('{targetLang}', langMap[targetLocale])
        .replace('{productName}', PRODUCT_NAME);
      const cta = rootDict.i18nMsg["Switch to {targetLang}"]
        .replace('{targetLang}', langMap[targetLocale]);

      dismissRef.current = toast(<div>
        {msg}
        <div
          className="ml-2 btn btn-sm btn-outline"
          onClick={() => {
            changeLocale(targetLocale);
            useUserPreferencesStore.getState().setLocale(targetLocale);
            setOpen(false);
            dismissRef.current && toast.dismiss(dismissRef.current);
          }}
        >
          {cta}
        </div>
      </div>, {
        onClose: () => {
          setOpen(false);
          useUserPreferencesStore.getState().setLocale(sourceLocale);
        },
        autoClose: false,
      });
    });
  }, [isOpen, targetLocale]);

  return false;
}

export default SwitchLocaleHint;
