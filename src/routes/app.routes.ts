import { Router } from "express";

import AppController from "../controllers/app.controller";
import validate from "../validations";
import { createAppInput, deleteAppInput, modifyAppInput } from "../validations/app.validation";

const userController = new AppController();
const app = Router();

app.get("/", userController.getApps);
app.get("/:id", userController.getAppInfo);
app.post("/", validate(createAppInput), userController.addNewApp);

app.post("/addUser", validate(modifyAppInput), userController.addUserToApp);
app.post("/removeUser", validate(modifyAppInput), userController.removeUserFromApp);
app.post("/addGroup", validate(modifyAppInput), userController.addGroupToApp);
app.post("/removeGroup", validate(modifyAppInput), userController.removeGroupFromApp);

app.delete("/", validate(deleteAppInput), userController.delete);

export default app;
