import React, {PropsWithChildren} from "react";
import {ModalTitle} from "@fontsensei/components/modal/commonComponents";

const MobileOnlyModal = (props: PropsWithChildren<{
  isOpen: boolean,
  setOpen: (isOpen: boolean) => void
}>) => {
  const {isOpen, setOpen, children} = props;
  return (
    <dialog id="my_modal_1" className={"modal " + (isOpen ? 'modal-open' : '')} onClick={() => setOpen(false)}>
      <div className="modal-box text-gray-700 w-11/12 max-w-5xl" onClick={e => e.stopPropagation()}>
        <ModalTitle onCancel={() => setOpen(false)}>
        </ModalTitle>

        <div className="flex flex-wrap justify-start items-start gap-6">
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default MobileOnlyModal;
