import {AppFC, AppMiddleware} from "./AppMiddleware";
import React from "react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react";

const vercel: AppMiddleware = (App) => {
  const Augmented: AppFC = (props) => {
    return <>
      <App {...props}/>
      <SpeedInsights/>
      <Analytics/>
    </>;
  };

  return Augmented;
};

export default vercel;
