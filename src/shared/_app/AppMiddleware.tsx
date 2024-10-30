import {AppProps} from "next/app";
import {ReactNode} from "react";
export type AppMiddleware = (App: AppFC) => AppFC;
export type AppFC = (props: AppProps) => ReactNode;
