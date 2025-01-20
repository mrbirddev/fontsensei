import {createPortal} from "react-dom";
import {PropsWithChildren} from "react";
const Portal = (props: PropsWithChildren<{id: string}>) => {
  return createPortal(
    props.children,
    document.getElementById(props.id)!
  );
};

export default Portal;
