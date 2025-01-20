import React, {HTMLAttributes, ReactNode} from "react";
import {cx} from "@emotion/css";
import Link from "next/link";

export type MobileStackRowProps = {
  label?: ReactNode,
  image?: string;
  icon?: ReactNode,
  iconRight?: ReactNode,
  href?: string,
  onClick?: HTMLAttributes<Element>['onClick'],
  isChecked?: boolean,
  isDivider?: boolean,
  disabled?: boolean,
  subRows?: MobileStackRowProps[],
}

const MobileStackRow = (props: MobileStackRowProps) => {
  if (props.image) {
    return <div className={cx(
      "focus:bg-slate-300",
      props.disabled ? "opacity-60" : "",
    )} onClick={(e) => {
      if (props.disabled) {
        return;
      }
      return props.onClick?.(e);
    }}>
      <div className="flex items-center justify-center flex-col">
        <div className={cx(
          "w-full aspect-[16/9] rounded-md overflow-hidden relative",
          "bg-slate-200 transition",
          // hover && "bg-slate-300 shadow-xl"
        )}>
          <img className="absolute top-0 left-0 right-0 h-[auto]" src={props.image} />
        </div>
        <div className="max-w-[150px]">
          <div className="text-sm text-bold">{props.label}</div>
          {/*{props.description && <div className="text-xs">{props.description}</div>}*/}
        </div>
      </div>
    </div>;
  }

  const Tag = props.href ? Link : 'div';

  return <Tag
    className={cx(
      "h-[3rem]",
      "flex items-center justify-start",
      "focus:bg-slate-300",
      props.disabled ? "opacity-60" : "",
    )}
    href={props.href as Parameters<typeof Link>[0]['href']}
    onClick={(e) => {
      if (props.disabled) {
        return;
      }
      return props.onClick?.(e);
    }}
  >
    <div className="h-full aspect-[1/1] flex items-center justify-center">
      {props.icon ?? false}
    </div>
    <div className="flex-1  flex items-center justify-start">
      {props.label}
    </div>
    <div className="h-full aspect-[1/1] flex items-center justify-center">
      {props.iconRight ?? false}
    </div>
  </Tag>;
};

export default MobileStackRow;
