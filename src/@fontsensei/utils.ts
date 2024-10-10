export const tagToUrlSlug = (tag: string) => {
  return tag.toLowerCase().split(' ').join('-');
};
export const fontFamilyToUrlParam = (name: string) => name.replace(/ /g, '+');
export const textToUrlParam = (text?: string) => text ? [
  ...new Set([...text.replace(/ /g, ' ')])
].join('') : undefined;
