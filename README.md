# Font sensei - Google fonts categorized by tag names

Font sensei is a Google fonts picker categorized by tag names.

![screenshot](./public/screenshot.png)


Check the data on UI ->

### [Japanese (ja)](https://fontsensei.com/ja)
- [明朝 (Mincho)](https://fontsensei.com/ja/tag/mincho)
- [ゴシック (Gothic)](https://fontsensei.com/ja/tag/gothic)
- [丸 (Maru)](https://fontsensei.com/ja/tag/maru)

### [Chinese Simplified (zh-cn)](https://fontsensei.com/zh-cn)
- [宋体 (Songti)](https://fontsensei.com/zh-cn/tag/songti)
- [黑体 (Heiti)](https://fontsensei.com/zh-cn/tag/heiti)
- [楷体 (Kaiti)](https://fontsensei.com/zh-cn/tag/kaiti)
- [行书 (Xingshu)](https://fontsensei.com/zh-cn/tag/xingshu)
- [美术体 (Meishuti)](https://fontsensei.com/zh-cn/tag/meishuti)

### [Chinese Traditional (zh-tw)](https://fontsensei.com/zh-tw)
- [宋體 (Songti)](https://fontsensei.com/zh-tw/tag/songti)
- [黑體 (Heiti)](https://fontsensei.com/zh-tw/tag/heiti)
- [楷體 (Kaiti)](https://fontsensei.com/zh-tw/tag/kaiti)
- [行書 (Xingshu)](https://fontsensei.com/zh-tw/tag/xingshu)
- [美術體 (Meishuti)](https://fontsensei.com/zh-tw/tag/meishuti)

### [Korean (ko)](https://fontsensei.com/ko)
- [바탕 (Batang)](https://fontsensei.com/ko/tag/batang)
- [돋움 (Dotum)](https://fontsensei.com/ko/tag/dotum)
- [궁서체 (Gungsuhche)](https://fontsensei.com/ko/tag/gungsuhche)

## Features
- Tags for non-Latin languages, eg CJK(Chinese, Japanese, Korean).
- Readable tags on the left.
- Easy on the eye coloring for both day & night.

## Structure
- src/@fontsensei contains the core code of this repo.
  - src/@fontsensei/data is the source data
  - src/@fontsensei/locales is the translation data
- for everything outside src/@fontsensei, it's the demo application with i18n tuned.

## Contribute
- Create a ticket
- Or you can directly edit files on Github if u know how to `src/@fontsensei/data`, `src/@fontsensei/locales`
- Help is needed on all non-Latin fonts!

## Run

```
# .env
NEXT_PUBLIC_DOMAIN_NAME=localhost:3000
```

```bash
yarn dev
```

## Credits

Font source => [Google fonts](https://fonts.google.com)

Latin tag data => [Font Library](https://github.com/katydecorah/font-library)

The logo => [SyntheOtaku](https://syntheotaku.itch.io/anime-teacher-sprite)


