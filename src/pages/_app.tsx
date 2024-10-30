/* eslint-disable no-restricted-imports */

import {type AppProps} from "next/app";

import "../styles/globals.css";
import '@szhsin/react-menu/dist/index.css';

import React, {useEffect, useState} from "react";
// import nightwind from "nightwind/helper";
import Head from "next/head";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _appMiddlewares from "../shared/_app/_appMiddlewares";
import {AppFC} from "../shared/_app/AppMiddleware";

const originalToastError = toast.error;
// do not auto close error toasts by default
toast.error = (...args) => originalToastError(args[0], {
  autoClose: false,
  ...args[1],
});

const MyApp: AppFC = ({
                 Component,
                 pageProps,
               }: AppProps) => {
  const {session, ...restPageProps} = pageProps;
  // console.log('_app.tsx ', typeof window === 'undefined' ? 'backend' : 'frontend');
  // console.log({ pageProps });
  // console.log( appRouter, (appRouter as NextRouter).locale);

  return (
    <>
      <Head>
        <link rel="icon" href="/icon.png"/>
      </Head>
      <Component {...restPageProps} />
      <ToastContainer/>
    </>
  );
};

const reduced = _appMiddlewares.reduce((acc, fn) => {
  return fn(acc);
}, MyApp);

export default reduced;
