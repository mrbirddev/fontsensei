import {cx} from "@emotion/css";
import React, {ReactNode} from "react";

const ActionSheetRenderStack = (props: {stack: ReactNode[]}) => {
  const actionSheetStack = props.stack;

  return actionSheetStack.map((node, i) => {
    return <React.Fragment key={i}>
      {node}
    </React.Fragment>;
  });
};

export default ActionSheetRenderStack;
