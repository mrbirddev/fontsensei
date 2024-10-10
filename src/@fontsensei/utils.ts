export const tagToUrlSlug = (tag: string) => {
  return tag.toLowerCase().split(' ').join('-');
};
