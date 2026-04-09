import React, {useEffect, useRef, useState} from "react";
import {
  allLoadedForServer,
  type LocaleStr,
  matchClosestLocale,
  useCurrentLocale
} from "@nextutils/locales";
import {PRODUCT_NAME} from "@nextutils/config";
import {buildLocalizedPath, getPreferredLocaleInBrowser, langMap} from "./locales";
import {type Id, toast} from "react-toastify";
import useUserPreferencesStore from "@nextutils/useUserPreferencesStore";
import {useRouter} from "next/router";

const SwitchLocaleHint = () => {
  const sourceLocale = useCurrentLocale();
  const router = useRouter();

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

    void allLoadedForServer[targetLocale]().then((dictModule) => {
      const rootDict = dictModule.default;
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
            void router.push(buildLocalizedPath(targetLocale, router.asPath, true));
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
