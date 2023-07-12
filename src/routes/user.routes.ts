import { Router } from "express";

import UserController from "../controllers/user.controller";
import validate from "../validations";
import { createUserInput } from "../validations/user.validation";

const userController = new UserController();
const user = Router();

user.get("/", userController.getUsers);
user.get("/:id", userController.getUserInfo);
user.post("/", validate(createUserInput), userController.addNewUser);
user.delete("/:id", userController.remove);

export default user;
