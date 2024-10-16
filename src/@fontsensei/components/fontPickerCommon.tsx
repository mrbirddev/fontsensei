import React, {ReactNode} from "react";
import {FSFontItem} from "@fontsensei/core/types";

export type FontPickerPageContextOpts =  {
  onCreateTagValue?: (tagName: string, msg: string) => void;
  onAddTag?: (family: string) => void;
  onRemoveTag?: (family: string) => void;
  Toolbar?: (props: {fontItem: FSFontItem}) => ReactNode;
  basePath?: string;
} | undefined;

export const FontPickerPageContext = React.createContext<FontPickerPageContextOpts>(undefined);
