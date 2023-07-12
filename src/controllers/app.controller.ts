import { Request, Response } from "express";

import { ModRequest } from "../middlewares/auth.middleware";
import AppService from "../services/app.service";
import UserService from "../services/user.service";

export default class AppController extends AppService {
    public getApps = async (req: Request, res: Response) => {
        try {
            const { limit, skip } = req.query as {
                limit: string;
                skip: string;
            };
            const apps = await this.listApps(limit, skip);
            return res.json(apps);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public getAppInfo = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const app = await this.getApp(id);
            return res.json(app);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public addNewApp = async (req: ModRequest, res: Response) => {
        try {
            const currentUser = await new UserService().getByEmail(req.user.email);
            if (!currentUser) throw new Error("User not found");
            const app = await this.addApp(req.body.name, currentUser.source);
            return res.json(app);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public addUserToApp = async (req: ModRequest, res: Response) => {
        try {
            const app = await this.addUsersToApp(req.body.app_id, req.body.users);
            return res.json(app);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public removeUserFromApp = async (req: ModRequest, res: Response) => {
        try {
            const app = await this.removeUsersFromApp(req.body.app_id, req.body.users);
            return res.json(app);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public addGroupToApp = async (req: ModRequest, res: Response) => {
        try {
            const app = await this.addGroupsToApp(req.body.app_id, req.body.groups);
            return res.json(app);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public removeGroupFromApp = async (req: ModRequest, res: Response) => {
        try {
            const app = await this.removeGroupsFromApp(req.body.app_id, req.body.groups);
            return res.json(app);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public delete = async (req: ModRequest, res: Response) => {
        try {
            const app = await this.deleteApp(req.body.app_id);
            return res.json(app);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
}
