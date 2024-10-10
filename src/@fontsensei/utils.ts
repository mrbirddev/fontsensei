import {uniq} from "lodash-es";

export const tagToUrlSlug = (tag: string) => {
  return tag.toLowerCase().split(' ').join('-');
};
export const fontFamilyToUrlParam = (name: string) => name.replace(/ /g, '+');
export const textToUrlParam = (text?: string) => text ? uniq(
  text.replace(/ /g, '').split('')
).join('') : undefined;
