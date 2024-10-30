import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {mountStoreDevtool} from "simple-zustand-devtools";
import {type LocaleStr} from "@nextutils/locales";
import {getPreferredLocaleInBrowser, setPreferredLocaleInBrowser} from "../i18n/locales";
interface State {
  locale: LocaleStr | undefined,
  setLocale: (locale: LocaleStr) => void
}

const useUserPreferencesStore = create<
  State,
  [["zustand/immer", never]]
>(immer(
  (set, getState) => ({
    locale: undefined,
    setLocale: (locale: LocaleStr) => {
      set({locale});
      if (locale) {
        setPreferredLocaleInBrowser(locale);
      }
    }
  })
));

if (typeof window !== 'undefined') {
  const l = getPreferredLocaleInBrowser();
  if (l) {
    useUserPreferencesStore.getState().setLocale(l);
  }
}

if (process.env.NODE_ENV !== 'production') {
  mountStoreDevtool('userPreferencesStore', useUserPreferencesStore)
}

export default useUserPreferencesStore;
