import vercel from "@nextutils/_app/vercel";
import loadingBar from "@nextutils/_app/loadingBar";
import i18nProvider from "@nextutils/_app/i18nProvider";
import {api} from "@nextutils/trpc/api";
import {AppFC, AppMiddleware} from "@nextutils/_app/AppMiddleware";
import {I18nProvider} from "@fontsensei/locales";

const i18nProviderMain: AppMiddleware = (App) => {
  const Augmented: AppFC = (props) => {
    return <I18nProvider locale={props.pageProps.locale}>
      <App {...props}/>
    </I18nProvider>;
  };

  return Augmented;
};

const _appMiddlewares = [
  vercel,
  loadingBar,
  i18nProviderMain,
  i18nProvider,
  api.withTRPC,
] as AppMiddleware[];

export default _appMiddlewares;
