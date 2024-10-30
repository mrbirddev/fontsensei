import {api} from "../api";
import App, {AppProps} from "next/app";
import {ReactNode} from "react";

export type AppMiddleware = (app: AppFC) => AppFC;
export type AppFC = (props: AppProps) => ReactNode;

const _appMiddlewares = [
  api.withTRPC,
] as AppMiddleware[];

export default _appMiddlewares;
