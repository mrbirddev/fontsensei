import {FontPickerPageContextOpts} from "@fontsensei/components/fontPickerCommon";
import {FaCode, FaUser} from "react-icons/fa6";
import React from "react";
import {useI18n} from "@fontsensei/locales";


/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;

const EmbeddedToolbar: NonNullable<FontPickerPageContextOpts>['Toolbar'] = ({fontItem}) => {
  const t = useI18n();
  return (<div className="flex items-center justify-start gap-2 mt-2">
    <div className="btn btn-sm btn-outline animate-none transition-none" onClick={(e) => {
      e.stopPropagation();
      (window.parent as Window | undefined)?.postMessage({
        type: 'fontsensei:selectFont',
        fontItem: fontItem,
      }, '*');
    }}>
      <FaCode/> {t('landingMsg.Select')}
    </div>
  </div>);
};

export default EmbeddedToolbar;
