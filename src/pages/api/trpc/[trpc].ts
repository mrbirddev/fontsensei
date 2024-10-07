import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter } from "../../../server/api/root";
import {createTRPCContext} from "../../../server/api/trpc";
import {env} from "../../../env";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});

// https://github.com/trpc/trpc/discussions/2590
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
    responseLimit: '4mb'
  },
}
