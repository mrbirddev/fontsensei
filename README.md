# Font sensei - Google fonts categorized by tag names

Font sensei is a Google fonts picker categorized by tag names.

![screenshot](./public/screenshot.png)

## Features
- Tags for non-Latin languages, eg CJK(Chinese, Japanese, Korean).
- Readable tags on the left.
- Easy on the eye coloring for day & night.

## Structure
- src/@fontsensei contains the core code of this repo.
  - src/@fontsensei/data is the source data
  - src/@fontsensei/locales is the translation data
- for everything outside src/@fontsensei, it's the demo application with i18n tuned.

## Contribute
- Create a ticket
- Or you can directly edit files on github if u know how to `src/@fontsensei/data`, `src/@fontsensei/locales`

## Run

```
# .env
NEXT_PUBLIC_DOMAIN_NAME=localhost:3000
```

```bash
yarn dev
```

## Tribution

Font source => [Google fonts](https://fonts.google.com)

Latin tag data => [Font Library](https://github.com/katydecorah/font-library)

The logo => [SyntheOtaku](https://syntheotaku.itch.io/anime-teacher-sprite)


