import {useUaParserClient} from "@nextutils/ui/useUaParser";
import {useEffect, useRef} from "react";
import {useRouter} from "next/router";
const useEruda = () => {
  const router = useRouter();
  const parserResult = useUaParserClient();
  const erudaLoadedRef = useRef(false);
  useEffect(() => {
    if (erudaLoadedRef.current) {
      return;
    }

    if (parserResult?.os.name !== 'Android' && parserResult?.os.name !== 'iOS') {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      erudaLoadedRef.current = true;
      void import('eruda').then(eruda => eruda.default.init());
      return;
    }

    if (router.isReady && router.query.eruda) {
      erudaLoadedRef.current = true;
      void import('eruda').then(eruda => eruda.default.init());
    }
  }, [router, parserResult]);
};

export default useEruda;
