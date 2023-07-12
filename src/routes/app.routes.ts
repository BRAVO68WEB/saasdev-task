import { Router } from "express";

import AppController from "../controllers/app.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userController = new AppController();
const app = Router();

app.get("/", authMiddleware, userController.getApps);
app.get("/:id", authMiddleware, userController.getAppInfo);
app.post("/", authMiddleware, userController.addNewApp);

app.post("/addUser", authMiddleware, userController.addUserToApp);
app.post("/removeUser", authMiddleware, userController.removeUserFromApp);
app.post("/addGroup", authMiddleware, userController.addGroupToApp);
app.post("/removeGroup", authMiddleware, userController.removeGroupFromApp);

app.delete("/", authMiddleware, userController.delete);

export default app;
