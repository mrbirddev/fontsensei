import tagValueMsg from "./tagValueMsg";
import tagDescMsg from "./tagDescMsg";
import landingMsg from "./landingMsg";

const en = {
  "landingMsg": landingMsg,
  "tagValueMsg": tagValueMsg,
  "tagDescMsg": tagDescMsg,
} as const;

export default en;

export type RootDictType = typeof en;
