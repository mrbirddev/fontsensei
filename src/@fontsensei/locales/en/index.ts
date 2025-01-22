import tagValueMsg from "./tagValueMsg";
import tagDescMsg from "./tagDescMsg";
import landingMsg from "./landingMsg";
import indexFaq from "!!raw-loader!./indexFaq.md";

const en = {
  "landingMsg": landingMsg,
  "indexFaq": indexFaq,
  "tagValueMsg": tagValueMsg,
  "tagDescMsg": tagDescMsg,
} as const;

export default en;

export type RootDictType = typeof en;
