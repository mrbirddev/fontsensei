import product from "./product";
import modal from "./modal";
import form from "./form";
import feedback from "./feedback";
import i18nMsg from "./i18nMsg";

// @ts-expect-error force translation here.
tagValueMsg.fude = '毛筆体';

export default {
  "product": product,
  "modal": modal,
  "form": form,
  "feedback": feedback,
  "i18nMsg": i18nMsg,
} as const;
