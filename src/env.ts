import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "production", "test"]),
		LOG_LEVEL: z.enum(["debug", "info", "warning", "error", "silent"]).default("warning"),
		ANALYTICS: z.stringbool().default(true),
	},
	emptyStringAsUndefined: true,
	experimental__runtimeEnv: {},
});
