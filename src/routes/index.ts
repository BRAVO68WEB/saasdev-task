import { Request, Response, Router } from "express";

import UtilsController from "../controllers/util.controller";
import app from "./app.routes";
import group from "./group.routes";
import user from "./user.routes";

export const route = Router();

route.get("/login", (_req: Request, res: Response) => {
    res.oidc.login({
        returnTo: "/user",
    });
});

route.get("/user", UtilsController.userInfo);

route.get("/", (req: Request, res: Response) => {
    res.render("index", {
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
        token: req.oidc.idToken,
    });
});

route.get("/health", UtilsController.getHealth);

route.post("/checkUserToAppConn", UtilsController.checkUserToAppConn);

route.use("/apps", app);
route.use("/users", user);
route.use("/group", group);
