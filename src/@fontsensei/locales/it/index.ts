import tagValueMsg from "./tagValueMsg";
import tagDescMsg from "./tagDescMsg";
import landingMsg from "./landingMsg";
import indexFaq from "!!raw-loader!./indexFaq.md";

export default {
  "landingMsg": landingMsg,
  "indexFaq": indexFaq,
  "tagValueMsg": tagValueMsg,
  "tagDescMsg": tagDescMsg,
} as const;
