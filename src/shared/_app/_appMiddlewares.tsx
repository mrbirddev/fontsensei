import {api} from "../api";
import i18nProvider from "./i18nProvider";
import i18nLangAltHead from "./i18nLangAltHead";
import loadingBar from "./loadingBar";
import {AppMiddleware} from "./AppMiddleware";
import vercel from "./vercel";

const _appMiddlewares = [
  vercel,
  loadingBar,
  i18nLangAltHead,
  i18nProvider,
  api.withTRPC,
] as AppMiddleware[];

export default _appMiddlewares;
