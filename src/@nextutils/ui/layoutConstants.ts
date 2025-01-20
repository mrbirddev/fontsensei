export const TABLET_MAX_WIDTH = 767; // https://getbootstrap.com/docs/5.0/layout/containers/
export const DESKTOP_MIN_WIDTH = 768; // https://getbootstrap.com/docs/5.0/layout/containers/

// https://stackoverflow.com/a/1038781/1922857
export function getWindowWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}
