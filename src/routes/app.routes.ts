import { Router } from "express";

import AppController from "../controllers/app.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userController = new AppController();
const app = Router();

app.get("/", userController.getApps);
app.get("/:id", userController.getAppInfo);
app.post("/", userController.addNewApp);

app.post("/addUser", userController.addUserToApp);
app.post("/removeUser", userController.removeUserFromApp);
app.post("/addGroup", userController.addGroupToApp);
app.post("/removeGroup", userController.removeGroupFromApp);

app.delete("/", userController.delete);

export default app;
