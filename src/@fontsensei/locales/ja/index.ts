import tagValueMsg from "./tagValueMsg";
import landingMsg from "./landingMsg";

// @ts-expect-error force translation here.
tagValueMsg.fude = '毛筆体';

export default {
  "landingMsg": landingMsg,
  "tagValueMsg": tagValueMsg,
} as const;
