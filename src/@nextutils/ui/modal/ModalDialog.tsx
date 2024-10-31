import React, {PropsWithChildren} from "react";
import {ModalTitle} from "./commonComponents";

const ModalDialog = (props: PropsWithChildren<{
  isOpen: boolean,
  setOpen: (isOpen: boolean) => void,
  disableBackdropClickClose?: boolean,
}>) => {
  const {isOpen, setOpen, children} = props;
  return (
    <dialog id="my_modal_1" className={"modal " + (isOpen ? 'modal-open' : '')} onClick={() => {
      if (!props.disableBackdropClickClose) {
        setOpen(false);
      }
    }}>
      <div className="modal-box text-gray-700 w-11/12 max-w-5xl" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </dialog>
  );
};

export default ModalDialog;
