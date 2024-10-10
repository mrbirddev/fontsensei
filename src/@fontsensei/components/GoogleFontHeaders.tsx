import React from "react";
import Head from "next/head";
import {fontFamilyToUrlParam, textToUrlParam} from "../utils";

export const GoogleFontHeaders = (props: {
  preConnect: boolean,
  configList: { name: string, text?: string }[],
  strategy: 'swap' | 'block',
}) => {
  const {preConnect, configList, strategy} = props;
  return <Head>
    {preConnect && <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    </>}
    {configList.map(config => {
      const family = fontFamilyToUrlParam(config.name);
      const text = textToUrlParam(config.text);

      if (family.startsWith('LXGW')) {
        console.log('family', family, 'text', text);
      }

      if (text) {
        return <link
          key={family + '&t=' + text}
          href={`https://fonts.googleapis.com/css2?family=${family}&text=${text}&display=${strategy}`}
          rel="stylesheet"
        />
      };

      return <link
        key={family}
        href={`https://fonts.googleapis.com/css2?family=${family}&display=${strategy}`}
        rel="stylesheet"
      />
    })}
  </Head>;
};



export const checkFontExists = async (fontName: string) => {
  if (!fontName) {
    return Promise.reject();
  }

  const WebFont = await import('webfontloader');

  return new Promise((resolve, reject) => {
    WebFont.load({
      google: {
        families: [fontName]
      },
      active() {
        console.log('the font is loaded');
        resolve(true);
      },
      inactive() {
        console.log('inactive');
        reject();
      }
    });
  });
};

export const toCssFontFamily = (googleFontName: string) => {
  // eg. Fira+Code:wght@300..700
  const variableStripped = googleFontName.split(':')[0]!;
  const plusReplaced = variableStripped.split('+').join(' ');
  return `"${plusReplaced}"`;
};
