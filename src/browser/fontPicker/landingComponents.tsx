import {FaCode, FaGithub, FaUser} from "react-icons/fa6";
import {GITHUB_LINK} from "../productConstants";
import React from "react";
import {FaExternalLinkAlt} from "react-icons/fa";
import {FontPickerPageContextOpts} from "@fontsensei/components/fontPickerCommon";

export const extraMenuItems = [
  {
    icon: <FaGithub />,
    label: "GitHub",
    href: GITHUB_LINK,
    target: "_blank",
  }
];

/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;

export const Toolbar: NonNullable<FontPickerPageContextOpts>['Toolbar'] = ({fontItem}) => <div className="flex items-center justify-start gap-2 mt-2">
    <div className="btn btn-sm btn-outline animate-none transition-none" onClick={(e) => {
      e.stopPropagation();
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
