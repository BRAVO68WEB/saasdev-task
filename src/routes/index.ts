import { Request, Response, Router } from "express";

import UtilsController from "../controllers/util.controller";
import app from "./app.routes";
import group from "./group.routes";
import user from "./user.routes";

import authMiddleware from "../middlewares/auth.middleware";
import validate from "../validations";
import { checkAccessInput } from "../validations/utils.validation";

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

route.post("/checkUserToAppConn", validate(checkAccessInput), UtilsController.checkUserToAppConn);

route.use("/apps", authMiddleware, app);
route.use("/users", authMiddleware, user);
route.use("/group", authMiddleware, group);
