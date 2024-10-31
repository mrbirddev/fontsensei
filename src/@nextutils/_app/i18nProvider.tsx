import React from "react";
import {I18nProvider} from "@nextutils/locales";
import {AppFC, AppMiddleware} from "./AppMiddleware";

const i18nProvider: AppMiddleware = (App) => {
  const Augmented: AppFC = (props) => {
    return <I18nProvider locale={props.pageProps.localeNextUtils}>
      <App {...props}/>
    </I18nProvider>;
  };

  return Augmented;
};

export default i18nProvider;
