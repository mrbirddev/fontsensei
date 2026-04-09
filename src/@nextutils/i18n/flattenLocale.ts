export type FlatLocale = Record<string, string>;

export function flattenLocale(
  locale: Record<string, unknown>,
  prefix = ""
): FlatLocale {
  return Object.entries(locale).reduce<FlatLocale>((prev, [name, value]) => {
    if (typeof value === "string") {
      return { ...prev, [prefix + name]: value };
    }
    return {
      ...prev,
      ...flattenLocale(value as Record<string, unknown>, `${prefix}${name}.`),
    };
  }, {});
}
