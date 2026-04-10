import {type LocaleStr, isNonLatinLocale} from "@fontsensei/locales";
import enTagValueMsg from "./locales/en/tagValueMsg";

const getEnTagLabel = (tag: string): string => {
  return (enTagValueMsg as Record<string, string>)[tag] ?? tag;
};

export const getTagLabelsForDisplay = (opts: {
  tag: string;
  currentLocale: LocaleStr;
  localizedLabel: string;
  disableTranslation?: boolean;
}) => {
  const {tag, currentLocale, localizedLabel, disableTranslation} = opts;

  if (tag === "all") {
    return {primary: localizedLabel, secondary: undefined as string | undefined};
  }

  if (!isNonLatinLocale(currentLocale) || disableTranslation) {
    return {primary: localizedLabel, secondary: undefined as string | undefined};
  }

  const enLabel = getEnTagLabel(tag);
  if (!enLabel || enLabel === localizedLabel) {
    return {primary: localizedLabel, secondary: undefined as string | undefined};
  }

  return {primary: enLabel, secondary: localizedLabel};
};
