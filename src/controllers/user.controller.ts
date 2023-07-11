import { Request, Response } from "express";
import UserService from "../services/user.service";

export default class UserController extends UserService {
    public getUsers = async (req: Request, res: Response) => {
        let { limit, skip } = req.query as {
            limit: string;
            skip: string;
        }
        const users = await this.list(limit, skip);
        return res.json(users);
    }

    public getUserInfo = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await this.get(id);
        return res.json(user);
    }

    public addNewUser = async (req: Request, res: Response) => {
        const user = await this.create(req.body);
        return res.json(user);
    }
}