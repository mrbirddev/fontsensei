import {Menu, MenuDivider, MenuItem, SubMenu} from "@szhsin/react-menu";
import React, {ReactNode} from "react";
import useIsMobileWidth from "@nextutils/ui/useIsMobileWidth";
import useActionSheetStore from "@nextutils/ui/actionSheet/useActionSheetStore";
import ActionSheetWrapper from "@nextutils/ui/actionSheet/ActionSheetWrapper";
import MobileStackRow from "@slidde/editor2/MobileStackRow";

export type ActionSheetMenuItem = {
  custom: ReactNode;
} | {
  label?: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;

  items?: ActionSheetMenuItem[];
} | 'divider';

const ActionSheetMenuItem = (props: {item: ActionSheetMenuItem, depth: number}) => {
  const {item, depth} = props;
  if (item === 'divider') {
    return <div className="my-2 h-[1px] bg-slate-300" />;
  }
  if ('custom' in item) {
    return <div className="my-2">{item.custom}</div>;
  }

  const {items} = item;
  if (items) {
    return <MobileStackRow
      {...item}
      onClick={() => {
        useActionSheetStore.getState().push(
          <ActionSheetWrapper>
            {items.map((item, index) => {
              return <ActionSheetMenuItem key={index} item={item} depth={depth + 1} />;
            })}
          </ActionSheetWrapper>
        )
      }}
    />;
  }

  return <MobileStackRow
    {...item}
    onClick={() => {
      // leaf level, do close
      // do it before onClick, since the onClick may trigger a new action sheet
      useActionSheetStore.getState().pop(depth);

      item.onClick?.();
    }}
  />;
}

const ActionSheetMenu = (props: {
  button: ReactNode,
  buttonClassName?: string,
  items: ActionSheetMenuItem[],
}) => {
  const isMobileWidth = useIsMobileWidth();

  if (isMobileWidth) {
    return <div className={props.buttonClassName} onClick={() => {
      useActionSheetStore.getState().push(
        <ActionSheetWrapper>
          {props.items.map((item, index) => {
            return <ActionSheetMenuItem key={index} item={item} depth={1} />;
          })}
        </ActionSheetWrapper>
      );
    }}>
      {props.button}
    </div>
  }

  return <Menu menuButton={(modifiers) => <div className={props.buttonClassName}>{props.button}</div>}>
    {props.items.map((item, index) => {
      if (item === 'divider') {
        return <MenuDivider key={index} />;
      }
      if ('custom' in item) {
        return <div key={index} className="max-w-[20rem] px-2">{item.custom}</div>;
      }

      if (item.items) {
        return <SubMenu key={index} label={<>{item.icon} {item.label}</>}>
          {item.items.map((item, index) => {
            if (item === 'divider') {
              return <MenuDivider key={index} />;
            }

            if ('custom' in item) {
              return <div key={index} className="max-w-[20rem] px-2">{item.custom}</div>;
            }

            return <MenuItem
              key={index}
              href={item.href}
              onClick={item.onClick}
            >
              {item.icon}
              {item.label}
            </MenuItem>;
          })}
        </SubMenu>
      }

      return <MenuItem
        key={index}
        href={item.href}
        onClick={item.onClick}
      >
        {item.icon}
        {item.label}
      </MenuItem>;
    })}
  </Menu>;
};

export default ActionSheetMenu;
