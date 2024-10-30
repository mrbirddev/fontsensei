import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import LoadingBar from "react-top-loading-bar";
import {AppFC, AppMiddleware} from "./AppMiddleware";

const loadingBar: AppMiddleware = (App) => {
  const Augmented: AppFC = (props) => {
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
      // START VALUE - WHEN LOADING WILL START
      router.events.on("routeChangeStart", () => {
        setProgress(40);
      });

      // COMPLETE VALUE - WHEN LOADING IS FINISHED
      router.events.on("routeChangeComplete", () => {
        setProgress(100);
      });

      router.events.on("routeChangeError", () => {
        setProgress(0);
      });
    }, []);
    return <>
      <LoadingBar
        color="oklch(0.4912 0.3096 275.75)"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => {
          setProgress(0);
        }}
      />
      <App {...props}/>
    </>;
  };

  return Augmented;
}

export default loadingBar;
