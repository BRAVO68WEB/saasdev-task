import { Request, Router, Response } from "express";

export const app = Router();

app.get('/', (req, res) => {
    console.log(req.oidc.isAuthenticated());
    res.render("index", {isAuthenticated: req.oidc.isAuthenticated()});
});

app.get("/health", (_req: Request, res: Response) => {
    return res.json({
        status: "OK",
    });
});