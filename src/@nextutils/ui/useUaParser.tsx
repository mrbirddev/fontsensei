import {IResult, UAParser} from 'ua-parser-js';
import {useEffect, useState} from "react";

export const useUaParserClient = () => {
  const [result, setResult] = useState<IResult | undefined>(undefined);
  useEffect(() => {
    const uaParser = new UAParser();
    uaParser.setUA(navigator.userAgent);
    setResult(uaParser.getResult());
  }, []);

  return result;
}
