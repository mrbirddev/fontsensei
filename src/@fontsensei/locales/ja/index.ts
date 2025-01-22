import tagValueMsg from "./tagValueMsg";
import tagDescMsg from "./tagDescMsg";
import landingMsg from "./landingMsg";
import indexFaq from "!!raw-loader!./indexFaq.md";

// @ts-expect-error force translation here.
tagValueMsg.fude = '毛筆体';

export default {
  "landingMsg": landingMsg,
  "indexFaq": indexFaq,
  "tagValueMsg": tagValueMsg,
  "tagDescMsg": tagDescMsg,
} as const;
