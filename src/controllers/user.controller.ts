import { Request, Response } from "express";

import UserService from "../services/user.service";

export default class UserController extends UserService {
    public getUsers = async (req: Request, res: Response) => {
        try {
            const { limit, skip } = req.query as {
                limit: string;
                skip: string;
            };
            const users = await this.list(limit, skip);
            return res.json(users);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public getUserInfo = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await this.get(id);
        return res.json(user);
    };

    public addNewUser = async (req: Request, res: Response) => {
        const user = await this.create(req.body);
        return res.json(user);
    };

    public remove = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await this.delete(id);
        return res.json(user);
    }
}
