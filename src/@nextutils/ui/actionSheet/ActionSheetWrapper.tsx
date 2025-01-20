import {cx} from "@emotion/css";
import {FaCheck, FaChevronLeft, FaXmark} from "react-icons/fa6";
import React, {ReactNode} from "react";
import useActionSheetStore from "@nextutils/ui/actionSheet/useActionSheetStore";
import {ModalTitle} from "@nextutils/ui/modal/commonComponents";
import {useI18n} from "@nextutils/locales";
import useIsMobileWidth from "@nextutils/ui/useIsMobileWidth";
import rootStackingContext from "@nextutils/ui/rootStackingContext";
import ActionSheetBackdrop from "@nextutils/ui/actionSheet/ActionSheetBackdrop";

export interface ActionSheetProps {
  size?: "normal" | "large" | "fullscreen";
  title?: ReactNode;
  confirmLabel?: ReactNode;
  confirmProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  onConfirm?: () => void;
  cancelLabel?: ReactNode;
  onCancel?: () => void;
  children?: React.ReactNode;
  isHidden?: boolean;
}

const ActionSheetWrapper = (props: ActionSheetProps) => {
  const isMobileWidth = useIsMobileWidth();
  const t = useI18n();
  const stack = useActionSheetStore(s => s.stack);

  const {
    onConfirm,
    size = "normal",
    isHidden,
    onCancel = () => useActionSheetStore.getState().pop(),
  } = props;

  if (!isMobileWidth) {
    if (size === "fullscreen") {
      // in full screen we absolutely position the content
      return (<>
        <ActionSheetBackdrop isOpen={!isHidden} onBackdropClick={onCancel} />
        <div
          className={cx(
            "modal-box",
            "fixed top-0 left-0 max-w-full w-full max-h-full h-full",
            rootStackingContext.actionSheetBox,
            "text-grey-700",
            isHidden && "hidden",
          )}
        >
          {props.title && <ModalTitle>
            {props.title}
          </ModalTitle>}

          <div className={cx(
            "absolute left-0 right-0 bottom-[3rem]",
            props.title ? "top-[4.5rem]": "top-[1.5rem]",
          )}>
            {props.children}
          </div>

          <div className={cx(
            "absolute left-0 right-0 bottom-0 h-[3rem]",
            "px-3",
            "flex items-center justify-end gap-2",
          )}>
            <button className="btn btn-ghost btn-sm" onClick={onCancel}>
              {props.cancelLabel ?? t("modal.Cancel")}
            </button>
            {onConfirm && <button className="btn btn-primary btn-sm" onClick={onConfirm} {...props.confirmProps}>
              {props.confirmLabel ?? t("modal.Confirm")}
            </button>}
          </div>
        </div>
      </>);
    }

    return (<>
      <ActionSheetBackdrop isOpen={!isHidden} onBackdropClick={onCancel} />
      <div
        className={cx(
          "modal-box",
          size === "large" && "w-10/12 max-w-6xl",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          rootStackingContext.actionSheetBox,
          "text-grey-700",
          isHidden && "hidden",
        )}
      >
        {props.title && <ModalTitle>
          {props.title}
        </ModalTitle>}

        {props.children}

        <div className={cx(
          "flex items-center justify-end gap-2",
        )}>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>
            {props.cancelLabel ?? t("modal.Cancel")}
          </button>
          {onConfirm && <button className="btn btn-primary btn-sm" onClick={onConfirm} {...props.confirmProps}>
            {props.confirmLabel ?? t("modal.Confirm")}
          </button>}
        </div>
      </div>
    </>);
  }

  return (<>
    <ActionSheetBackdrop isOpen={!isHidden} onBackdropClick={onCancel} />
    <div
      className={cx(
        "fixed bottom-0 left-0 right-0",
        size === "fullscreen" && "top-0",
        size === "large" && "top-0",
        size === "normal" && "top-[12rem]",
        "bg-slate-100",
        "text-grey-700",
        "overflow-hidden",
        rootStackingContext.actionSheetBox,
        isHidden && "hidden",
      )}
    >
      <div className={cx("bg-slate-200")}>
        <div className={cx(
          "absolute top-0 left-0 right-0 h-[3rem]",
          "flex items-center justify-start",
        )}>
          <button className="h-[3rem] min-w-[3rem] flex items-center justify-center" onClick={onCancel}>
            {props.cancelLabel ?? (stack.length > 1 ? <FaChevronLeft /> : <FaXmark />)}
          </button>
          <div className="flex-1 font-bold text-center truncate">
            {props.title}
          </div>
          {onConfirm && <button className="max-h-[3rem] min-w-[3rem] btn btn-primary btn-sm mx-3 flex items-center justify-center" onClick={onConfirm} {...props.confirmProps}>
            {(props.confirmLabel ?? <FaCheck />)}
          </button>}
          {!onConfirm && <div className="min-w-[3rem] aspect-[1/1]" />}
        </div>
        <div className={cx(
          "absolute top-[3rem] left-0 right-0 bottom-0",
          "overflow-x-hidden overflow-y-auto",
          size !== "fullscreen" && "px-3"
        )}>
          {props.children}
        </div>
      </div>
    </div>
    </>
  );
};

export default ActionSheetWrapper;
