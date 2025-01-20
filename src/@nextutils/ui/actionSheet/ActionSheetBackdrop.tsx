import {cx} from "@emotion/css";
import rootStackingContext from "@nextutils/ui/rootStackingContext";
import React from "react";

const ActionSheetBackdrop = (props: {
  isOpen: boolean,
  onBackdropClick?: () => void,
  children?: React.ReactNode;
}) => {
  return (<div className={cx(
    "fixed inset-0",
    rootStackingContext.actionSheetBackdrop,
    "flex items-center justify-center",
    "transition overflow-hidden",
    props.isOpen ? "bg-black/60" : "bg-black/0",
    props.isOpen ? "" : "hidden",
  )} onClick={(e) => {
    // only when clicking on the backdrop itself
    // https://stackoverflow.com/a/47406614/1922857
    if (e.target === e.currentTarget) {
      props.onBackdropClick?.();
    }
  }}>
    {props.children}
  </div>);
};

export default ActionSheetBackdrop;
