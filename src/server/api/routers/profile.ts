import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "../trpc";
import {zLocaleStr, allLoadedForServer, type RootDictType} from "@fontsensei/locales";

export const profileRouter = createTRPCRouter({
  loadLocaleRootDict: publicProcedure
    .input(z.object({
      targetLocale: zLocaleStr,
    })).query(async ({ctx, input}) => {
      return (
        await allLoadedForServer[input.targetLocale]()
      ).default as unknown as Promise<RootDictType>
    }),
});
