import product from "./product";
import modal from "./modal";
import form from "./form";
import feedback from "./feedback";
import tagValueMsg from "./tagValueMsg";
import i18nMsg from "./i18nMsg";
import landingMsg from "./landingMsg";

const en = {
  "landingMsg": landingMsg,
  "tagValueMsg": tagValueMsg,
} as const;

export default en;

export type RootDictType = typeof en;
