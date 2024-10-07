import React, {
  type ButtonHTMLAttributes, type ClassAttributes,
  type FC,
  type InputHTMLAttributes,
  type PropsWithChildren,
  type ReactNode, type TextareaHTMLAttributes
} from "react";
import {useI18n} from "@fontsensei/locales";
import {Controller, type FieldError, type FieldValues} from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import {RxCross1} from "react-icons/rx";

export const AlertWarning: FC<PropsWithChildren> = (props) => {
  return <div role="alert" className="rounded bg-amber-200 p-4">
    {props.children}
  </div>;
};

export const ModalTitle:React.FC<PropsWithChildren<{onCancel?: () => void}>> = (props) => {
  return <div className="font-bold text-2xl mb-6 flex items-center justify-start">
    <span className="flex-1">{props.children}</span>
    {props.onCancel && <span className="btn btn-ghost btn-sm" onClick={() => {
      props.onCancel?.();
    }} ><RxCross1 /></span>}
  </div>
}

export const ModalSubTitle: React.FC<PropsWithChildren> = (props) => {
  return <div className="font-bold text-lg mb-2">{props.children}</div>
}

export const Modal2Columns: React.FC<PropsWithChildren> = (props) => {
  return <div className="grid grid-cols-2 gap-4">{props.children}</div>
}

export const ModalInputLabel:React.FC<PropsWithChildren> = (props) => {
  return <div className="flex justify-start items-center gap-2 mb-2 font-bold">
    {props.children}
  </div>
};

export const ModalInput: React.FC<PropsWithChildren<{
  label?: ReactNode,
  inputProps: Partial<InputHTMLAttributes<HTMLInputElement>> & ClassAttributes<HTMLInputElement>,
  inputPrefix?: ReactNode,
  inputSuffix?: ReactNode,
  error?: FieldError,
}>> = (props) => {
  return (<div className="mb-4">
    {props.label && <ModalInputLabel>
      {props.label}
    </ModalInputLabel>}
    {props.inputProps.type === 'checkbox' && <div>
      <input
        {...props.inputProps}
      />
    </div>}
    {props.inputProps.type !== 'checkbox' && <div
      className="flex rounded-md shadow-sm ring-1 ring-inset ring-grey-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
    >
      {props.inputPrefix}
      <input
          className="outline-none block flex-1 border-0 bg-transparent py-1.5 px-2 text-grey-900 placeholder:text-gray-400 focus:ring-0"
          {...props.inputProps}
      />
      {props.inputSuffix}
    </div>}
    {/*TODO i18n*/}
    {props.error && <div role="alert" className="rounded bg-amber-200 p-1 mt-1">
      <span>{props.error.message}</span>
    </div>}
  </div>)
}

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const isValidEmail = (e: string) => {
  return e.match(emailRegex);
}

export const ModalTextarea: React.FC<PropsWithChildren<{
  label?: ReactNode,
  textareaProps: Partial<TextareaHTMLAttributes<HTMLTextAreaElement>> & ClassAttributes<HTMLTextAreaElement>,
  error?: FieldError,
}>> = (props) => {
  return <div className="mb-4">
    {props.label && <ModalInputLabel>
      {props.label}
    </ModalInputLabel>}
    <div
        className="flex rounded-md shadow-sm ring-1 ring-inset ring-grey-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
    >
        <textarea
          className="outline-none block flex-1 border-0 bg-transparent p-2 text-grey-900 placeholder:text-gray-400 focus:ring-0"
          {...props.textareaProps}
        />
    </div>
    {props.error && <div role="alert" className="rounded bg-amber-200 p-1 mt-1">
        <span>{props.error.message}</span>
    </div>}
  </div>
}
export const ModalSelect = <T extends FieldValues, >(props: PropsWithChildren<{
  label?: ReactNode,
  controllerProps: Omit<Parameters<typeof Controller<T>>[0], 'render'>,
  inputProps: Partial<Parameters<typeof CreatableSelect>[0]>,
  error?: FieldError,
  creatable?: boolean,
}>) => {
  // @ts-expect-error Fix function component cannot be given refs, this "ref" is brought by register(...)
  const {ref, ..._controllerProps} = props.controllerProps;
  return (<div className="mb-4">

    {props.label && <ModalInputLabel>
      {props.label}
    </ModalInputLabel>}

    <Controller
      render={({ field: { onChange, value, ref, name } }) => (
        props.creatable ? <CreatableSelect
          name={name}
          value={value}
          styles={{
            // menuPortal: (base) => ({ ...base, zIndex: VIEWPORT_STACKING_CONTEXT.POPUP_IN_MODAL }),
          }}
          classNames={{
            container: () => "flex rounded-md shadow-sm ring-1 ring-inset ring-grey-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600",
            control: () => "outline-none block flex-1 border-0 bg-transparent p-0 text-grey-900 placeholder:text-gray-400 focus:ring-0",
          }}
          onChange={onChange}
          isClearable
          menuPortalTarget={document.body}
          {...props.inputProps}
        /> : <Select
          name={name}
          value={value}
          styles={{
            // menuPortal: (base) => ({ ...base, zIndex: VIEWPORT_STACKING_CONTEXT.POPUP_IN_MODAL }),
          }}
          classNames={{
            container: () => "flex rounded-md shadow-sm ring-1 ring-inset ring-grey-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600",
            control: () => "outline-none block flex-1 border-0 bg-transparent p-0 text-grey-900 placeholder:text-gray-400 focus:ring-0",
          }}
          onChange={onChange}
          isClearable
          menuPortalTarget={document.body}
          {...props.inputProps}
        />
      )}
      {..._controllerProps}
    />

    {/*TODO i18n*/}
    {props.error && <div role="alert" className="rounded bg-amber-200 p-1 mt-1">
      <span>{props.error.message}</span>
    </div>}
  </div>)
}
export const ModalInlineRadio = <T extends string, T2 extends FieldValues >(props: PropsWithChildren<{
  options: {label: ReactNode, value: T}[],
  controllerProps: Omit<Parameters<typeof Controller<T2>>[0], 'render'>,
}>) => {
  return (
    <Controller
      {...props.controllerProps}
      render={({ field: { onChange, value, ref, name } }) => (
        <div className="flex items-center justify-start" ref={ref}>
          {props.options.map(o => <div key={o.value} className={[
            "btn btn-ghost rounded-full",
            value === o.value && "btn-active",
          ].join(' ')} onClick={() => {
            if (value === o.value) {
              onChange({
                target: {
                  value: undefined
                }
              });
              return;
            }

            onChange({
              target: {
                value: o.value
              }
            });
          }}>{o.label}</div>)}
          {/*TODO i18n*/}
        </div>
    )} />
  )
}

export const ModalButtons: React.FC<PropsWithChildren<{
  onConfirm?: () => void,
  confirmChildren?: ReactNode,
  confirmProps?: Partial<ButtonHTMLAttributes<HTMLButtonElement>>,
  onCancel?: () => void,
  cancelProps?: Partial<ButtonHTMLAttributes<HTMLButtonElement>>,

  linePrefix?: ReactNode,
}>> = (props) => {
  const t = useI18n();
  return (
    <div className="modal-action">
      {props.linePrefix ?? false}
      <div className="flex items-center justify-center gap-3">
        {props.onConfirm && <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            props.onConfirm?.()
          }}
          {...props.confirmProps}
        >
          {props.confirmChildren ?? t('modal.Confirm')}
        </button>}
        {props.onCancel && <button
          className="btn btn-sm"
          onClick={() => props.onCancel?.()}
          {...props.cancelProps}
        >
          {t('modal.Cancel')}
        </button>}
      </div>
    </div>
  );
}
