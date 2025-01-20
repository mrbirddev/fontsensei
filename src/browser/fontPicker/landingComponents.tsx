import {FaCode, FaGithub, FaUser} from "react-icons/fa6";
import React from "react";
import {FaExternalLinkAlt} from "react-icons/fa";
import {FontPickerPageContextOpts} from "@fontsensei/components/fontPickerCommon";
import EmbedModal from "./embed/EmbedModal";
import {fontFamilyToUrlParam} from "../../@fontsensei/utils";
import useActionSheetStore from "@nextutils/ui/actionSheet/useActionSheetStore";

/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;

export const Toolbar: NonNullable<FontPickerPageContextOpts>['Toolbar'] = ({fontItem}) => <div className="flex items-center justify-start gap-2 mt-2">
    <div className="btn btn-sm btn-outline animate-none transition-none" onClick={(e) => {
      e.stopPropagation();
      useActionSheetStore.getState().push(<EmbedModal
        content={`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${
          fontFamilyToUrlParam(fontItem.family)
        }${
          fontItem.metadata.defaultSuffix
        }&display=swap" rel="stylesheet">`}
        isOpen={true}
        setOpen={() => {
          useActionSheetStore.getState().pop();
        }}
      />);
    }}>
      <FaCode/> Embed
    </div>
    <a
      className="btn btn-sm btn-ghost animate-none transition-none"
      href={'https://fonts.google.com/specimen/' + fontItem.family.split(' ').join('+')}
      target="_blank"
    ><FaExternalLinkAlt /> Google</a>
    <a
      className="btn btn-sm btn-ghost animate-none transition-none"
      href={'https://fonts.google.com/specimen/' + fontItem.family.split(' ').join('+') + '/about'}
      target="_blank"
    >
      <FaUser />
      {fontItem.metadata.designers.join(',')}
    </a>
  </div>;
