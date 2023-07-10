import { Hono, Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { loginUrl, client } from "../config/authClient";

export const app = new Hono();

app.use("*", logger());

app.use("*", cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
}));

app.get("/", (ctx: Context) => {
    return ctx.text("Hello World!");
});

app.get("/health", (ctx: Context) => {
    return ctx.json({
        status: "OK",
    });
});

app.get("/callback", async (ctx: Context) => {
    const { code } = ctx.req.query();
    if (!code) {
        return ctx.json({
            error: "code is required",
        }, 400);
    }
    const tokenSet = await client.callback("http://localhost:3000/callback", {
        state: "12345",
        code,
        token_type: "Bearer",
    }, {
        state: "12345",
        max_age: 84600,
    },)

    return ctx.json(tokenSet);
})

app.get("/login", (ctx: Context) => {
    const url = loginUrl
    return ctx.redirect(url);
})