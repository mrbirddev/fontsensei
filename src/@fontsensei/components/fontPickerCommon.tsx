import React from "react";

export type FontPickerPageContextOpts =  {
  onCreateTagValue?: (tagName: string, msg: string) => void;
  onAddTag?: (family: string) => void;
  onRemoveTag?: (family: string) => void;
} | undefined;

export const FontPickerPageContext = React.createContext<FontPickerPageContextOpts>(undefined);
