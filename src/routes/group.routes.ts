import { Router } from "express";

import GroupController from "../controllers/group.controller";
import validate from "../validations";
import { createGroupInput, deleteGroupInput, modifyGroupInput } from "../validations/group.validation";

const groupController = new GroupController();
const group = Router();

group.get("/", groupController.listGroups);
group.get("/:id", groupController.getGroupInfo);
group.post("/", validate(createGroupInput), groupController.addGroup);
group.post("/addUser", validate(modifyGroupInput), groupController.addUserToGroup);
group.post("/removeUser", validate(modifyGroupInput), groupController.removeUserFromGroup);
group.delete("/", validate(deleteGroupInput), groupController.remove);

export default group;
