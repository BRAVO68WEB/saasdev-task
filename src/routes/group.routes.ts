import { Router } from "express";

import GroupController from "../controllers/group.controller";
import authMiddleware from "../middlewares/auth.middleware";

const groupController = new GroupController();
const group = Router();

group.get("/", authMiddleware, groupController.listGroups);
group.get("/:id", authMiddleware, groupController.getGroupInfo);
group.post("/", authMiddleware, groupController.addGroup);
group.post("/addUser", authMiddleware, groupController.addUserToGroup);

export default group;