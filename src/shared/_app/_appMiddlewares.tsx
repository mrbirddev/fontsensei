import vercel from "@nextutils/_app/vercel";
import loadingBar from "@nextutils/_app/loadingBar";
import i18nLangAltHead from "@nextutils/_app/i18nLangAltHead";
import i18nProvider from "@nextutils/_app/i18nProvider";
import {api} from "../api";
import {AppMiddleware} from "@nextutils/_app/AppMiddleware";

const _appMiddlewares = [
  vercel,
  loadingBar,
  i18nLangAltHead,
  i18nProvider,
  api.withTRPC,
] as AppMiddleware[];

export default _appMiddlewares;
