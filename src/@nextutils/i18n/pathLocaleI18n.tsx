import React, {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { type FlatLocale, flattenLocale } from "./flattenLocale";

type I18nContextValue = {
  localeContent: FlatLocale;
  localeKey: string;
  fallbackLocale?: FlatLocale;
};

function createT(context: I18nContextValue, scope: string | undefined) {
  const { localeContent, fallbackLocale } = context;
  const content: FlatLocale = Object.assign(
    {},
    fallbackLocale != null ? fallbackLocale : {},
    localeContent
  );
  const pluralKeys = new Set(
    Object.keys(content)
      .filter((key) => key.includes("#"))
      .map((key) => key.split("#", 1)[0]!)
  );
  const pluralRules = new Intl.PluralRules(context.localeKey);

  function getPluralKey(count: number) {
    if (count === 0) {
      return "zero";
    }
    return pluralRules.select(count);
  }

  function t(key: string, ...params: unknown[]) {
    const paramObject = params[0] as Record<string, unknown> | undefined;
    let resolvedKey = key;
    let isPlural = false;
    if (paramObject && "count" in paramObject) {
      const isPluralKey = scope
        ? pluralKeys.has(`${scope}.${key}`)
        : pluralKeys.has(key);
      if (isPluralKey) {
        resolvedKey = `${key}#${getPluralKey(paramObject.count as number)}`;
        isPlural = true;
      }
    }
    let value = scope
      ? content[`${scope}.${resolvedKey}`]
      : content[resolvedKey];
    if (!value && isPlural) {
      const baseKey = resolvedKey.split("#", 1)[0]!;
      value =
        (content[`${baseKey}#other`] as string | undefined)?.toString() ??
        resolvedKey;
    } else {
      value = (value ?? resolvedKey)?.toString();
    }
    if (!paramObject) {
      return value;
    }
    let isString = true;
    const result = value?.split(/({[^}]*})/).map((part, index) => {
      const match = part.match(/^{(.*)}$/);
      if (match) {
        const param = match[1]!;
        const paramValue = paramObject[param];
        if (isValidElement(paramValue)) {
          isString = false;
          return cloneElement(paramValue, { key: `${String(param)}-${index}` });
        }
        return paramValue as ReactNode;
      }
      return part;
    });
    return isString ? result?.join("") : result;
  }

  return t;
}

export type TranslateString = (key: string, ...params: unknown[]) => string;

export function createPathLocaleI18n<LocaleKey extends string>() {
  const I18nContext = createContext<I18nContextValue | null>(null);

  function I18nProvider(props: {
    locale: FlatLocale;
    localeKey: string;
    fallbackLocale?: Record<string, unknown>;
    fallback?: ReactNode;
    children: ReactNode;
  }) {
    const { locale, localeKey, fallbackLocale, fallback, children } = props;
    const flattenedFallback = useMemo(
      () => (fallbackLocale ? flattenLocale(fallbackLocale) : undefined),
      [fallbackLocale]
    );
    const value = useMemo(
      () => ({
        localeContent: locale,
        localeKey,
        fallbackLocale: flattenedFallback,
      }),
      [locale, localeKey, flattenedFallback]
    );

    if (!locale || Object.keys(locale).length === 0) {
      return <>{fallback ?? null}</>;
    }

    return (
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
  }

  function useCurrentLocale(): LocaleKey {
    const context = useContext(I18nContext);
    if (!context) {
      throw new Error("`useCurrentLocale` must be used inside `I18nProvider`");
    }
    return context.localeKey as LocaleKey;
  }

  function useI18n(): TranslateString {
    const context = useContext(I18nContext);
    if (!context) {
      throw new Error("`useI18n` must be used inside `I18nProvider`");
    }
    return useMemo(
      () => createT(context, undefined) as unknown as TranslateString,
      [context]
    );
  }

  function useScopedI18n(scope: string): TranslateString {
    const context = useContext(I18nContext);
    if (!context) {
      throw new Error("`useScopedI18n` must be used inside `I18nProvider`");
    }
    return useMemo(
      () => createT(context, scope) as unknown as TranslateString,
      [context, scope]
    );
  }

  return {
    I18nProvider,
    useCurrentLocale,
    useI18n,
    useScopedI18n,
  };
}
