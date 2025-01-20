import React, { useEffect, useRef} from "react";
import {useScopedI18n} from "@fontsensei/locales";
import copyToClipboard from "copy-to-clipboard";
import {FaCheck, FaCopy} from "react-icons/fa6";
import {ModalTextarea} from "@nextutils/ui/modal/commonComponents";
import ActionSheetWrapper from "@nextutils/ui/actionSheet/ActionSheetWrapper";

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
    <ActionSheetWrapper
      confirmLabel={isCopied ? <>
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
      }}
    >
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
    </ActionSheetWrapper>
  );
}

export default EmbedModal;
