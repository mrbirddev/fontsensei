import product from "./product";
import modal from "./modal";
import form from "./form";
import feedback from "./feedback";
import tagValueMsg from "./tagValueMsg";
import i18nMsg from "./i18nMsg";
import landingMsg from "./landingMsg";

// @ts-expect-error force translation here.
tagValueMsg.fude = '毛筆体';

export default {
  "product": product,
  "modal": modal,
  "form": form,
  "feedback": feedback,
  "i18nMsg": i18nMsg,
  "landingMsg": landingMsg,
  "tagValueMsg": tagValueMsg,
} as const;
