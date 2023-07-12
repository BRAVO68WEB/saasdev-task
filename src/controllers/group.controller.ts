import { Request, Response } from "express";

import { ModRequest } from "../middlewares/auth.middleware";
import GroupService from "../services/group.service";

export default class GroupController extends GroupService {
    public addGroup = async (req: ModRequest, res: Response) => {
        try {
            const group = await this.create(req.body);
            return res.json(group);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public listGroups = async (_req: Request, res: Response) => {
        try {
            const groups = await this.getGroups();
            return res.json(groups);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public getGroupInfo = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const group = await this.getGroupById(id);
            return res.json(group);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public addUserToGroup = async (req: ModRequest, res: Response) => {
        try {
            const group = await this.addUsersToGroup(req.body.group_id, req.body.users);
            return res.json(group);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public removeUserFromGroup = async (req: ModRequest, res: Response) => {
        try {
            const group = await this.removeUsersFromGroup(req.body.group_id, req.body.users);
            return res.json(group);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    };

    public remove = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const group = await this.removeGroup(id);
            return res.json(group);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
}
