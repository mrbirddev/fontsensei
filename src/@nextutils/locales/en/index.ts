import product from "./product";
import modal from "./modal";
import form from "./form";
import feedback from "./feedback";
import tagValueMsg from "./tagValueMsg";
import i18nMsg from "./i18nMsg";
import landingMsg from "./landingMsg";

const en = {
  "product": product,
  "modal": modal,
  "form": form,
  "feedback": feedback,
  "i18nMsg": i18nMsg,
} as const;

export default en;

export type RootDictType = typeof en;
