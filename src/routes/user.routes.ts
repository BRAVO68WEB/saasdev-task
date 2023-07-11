import { Router } from "express";

import UserController from "../controllers/user.controller";

const userController = new UserController();
const user = Router();

user.get("/", userController.getUsers);
user.get("/:id", userController.getUserInfo);
user.post("/", userController.addNewUser);

export default user;