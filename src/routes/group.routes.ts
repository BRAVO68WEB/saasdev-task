import { Router } from "express";

import GroupController from "../controllers/group.controller";
import authMiddleware from "../middlewares/auth.middleware";

const groupController = new GroupController();
const group = Router();

group.get("/", groupController.listGroups);
group.get("/:id", groupController.getGroupInfo);
group.post("/", groupController.addGroup);
group.post("/addUser", groupController.addUserToGroup);
group.post("/removeUser", groupController.removeUserFromGroup);
group.delete("/", groupController.remove);

export default group;
