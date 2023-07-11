import { z } from "zod";

declare global {
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface ProcessEnv extends z.infer<typeof envSchema> {}
    }
}

const envSchema = z.object({
    PORT: z.string(),
    CLIENT_ID: z.string(),
    CLIENT_SECRET: z.string(),
    REDIRECT_URI: z.string(),
    MONGO_URI: z.string(),
    ISSUER_URL: z.string(),
    BASEURL: z.string(),
});

envSchema.parse(process.env);

console.log("✅ Environment variables are valid.");
