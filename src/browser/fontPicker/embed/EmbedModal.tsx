import React, { useEffect, useRef} from "react";
import {useI18n, useScopedI18n} from "@fontsensei/locales";
import {
  ModalButtons,
  ModalTextarea,
  ModalTitle
} from "@fontsensei/components/modal/commonComponents";
import copyToClipboard from "copy-to-clipboard";
import {FaCheck, FaCopy} from "react-icons/fa6";

const EmbedModal = (props: {
  content: string;
  isOpen: boolean,
  setOpen: (o: boolean) => void,
}) => {
  const tLandingMsg = useScopedI18n('landingMsg');

  const contentInputRef = useRef(null as HTMLTextAreaElement | null);
  useEffect(() => {
    if (!props.isOpen) {
      return;
    }

    if (contentInputRef.current) {
      contentInputRef.current.focus();
      return;
    }
  }, [props.isOpen]);

  const [isCopied, setIsCopied] = React.useState(false);
  useEffect(() => {
    let id: number | undefined;
    if (isCopied) {
      id = window.setTimeout(() => setIsCopied(false), 1000);
    }
    return () => clearTimeout(id);
  }, [isCopied]);

  return (
    <dialog id="my_modal_1" className={"modal " + (props.isOpen ? 'modal-open' : '')}>
      <div className="modal-box text-grey-700">
        {/*<ModalTitle>{props.title}</ModalTitle>*/}
        <ModalTextarea
          label={tLandingMsg("Embed code in the <head> of your html")}
          textareaProps={{
            ref: (el) => {
              contentInputRef.current = el;
            },
            value: props.content,
            placeholder: "",
            rows: 5,
            className: "outline-none text-lg block flex-1 border-0 bg-transparent p-2 text-grey-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6",
          }}
        />

        <ModalButtons
          confirmChildren={isCopied ? <>
            <FaCheck className="text-success" />
            <span>{tLandingMsg("Copied")}</span>
          </> : <>
            <FaCopy />
            <span>{tLandingMsg("Copy")}</span>
          </>}
          onConfirm={() => {
            copyToClipboard(props.content);
            setIsCopied(true);
          }}
          onCancel={() => {
            props.setOpen(false);
          }}/>
      </div>
    </dialog>
  );
}

export default EmbedModal;
