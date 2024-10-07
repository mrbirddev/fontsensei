declare module "nightwind/helper" {
  type NightwindHelperModule = {
    init: () => string;
    beforeTransition: () => void;
    toggle: () => void;
    enable: (dark: boolean) => void;
    checkNightMode: () => boolean;
    watchNightMode: () => void;
    addNightModeSelector: () => void;
    addNightTransitions: () => void;
    initNightwind: () => void;
    toggleNightMode: () => void;
  };

  const nightwindHelper: NightwindHelperModule;

  export default nightwindHelper;
}

declare module '!!raw-loader!*' {
  const contents: string;
  export = contents;
}

type PartialBy<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

declare module "@mdx-js/runtime" {
  export default MDX = React.Component;
}
