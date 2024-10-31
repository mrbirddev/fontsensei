import tagValueMsg from "./tagValueMsg";
import landingMsg from "./landingMsg";

const en = {
  "landingMsg": landingMsg,
  "tagValueMsg": tagValueMsg,
} as const;

export default en;

export type RootDictType = typeof en;
