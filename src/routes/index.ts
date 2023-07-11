import { Request, Router, Response } from "express";
import UserServer from "../services/user.service";

import app from "./app.routes";
import user from "./user.routes";
import group from "./group.routes";

export const route = Router();

route.get('/login', (_req: Request, res: Response) => {
    res.oidc.login({
        returnTo: '/user',
    })
});

route.get('/user', async (req: Request, res: Response) => {
    try{
        const userInfo = req.oidc.user;

        if(!userInfo) {
            return res.redirect('/login');
        }
    
        const checkIfUserExists = await new UserServer().getByEmail(userInfo.email);
    
        if(checkIfUserExists) {
            return res.json(checkIfUserExists)
        }
        else {
            const user = await new UserServer().create({
                email: userInfo.email,
                firstname: userInfo.given_name,
                username: userInfo.nickname,
                lastname: userInfo.family_name,
                source: "oidc"
            });

            return res.json(user);
        }
    }
    catch(err) {
        console.log(err);
    }
})

route.get('/', (req: Request, res: Response) => {
    console.log(req.oidc.isAuthenticated());
    res.render("index", {isAuthenticated: req.oidc.isAuthenticated(), user: req.oidc.user, token: req.oidc.idToken});
});

route.get("/health", (_req: Request, res: Response) => {
    return res.json({
        status: "OK",
    });
});

route.use("/apps", app);
route.use("/users", user);
route.use("/group", group);