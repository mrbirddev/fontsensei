import {useLayoutEffect, useState} from "react";
import {getWindowWidth, TABLET_MAX_WIDTH} from "@nextutils/ui/layoutConstants";

const useIsMobileWidth = () => {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    function update() {
      if (getWindowWidth() <= TABLET_MAX_WIDTH) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  return isMobile;
};
export default useIsMobileWidth;
