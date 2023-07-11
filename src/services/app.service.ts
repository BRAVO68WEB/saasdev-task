import User from "../models/user.model";
import Source from "../models/source.model";
import Group from "../models/group.model";
import App from "../models/app.model";

export default class AppService {
    public addApp = async (name: string, source: string) => {
        try {
            const sourceExists = await Source.findById(source).exec();

            if (!sourceExists) {
                const newSource = await Source.create({
                    name: source,
                });
                source = newSource.view(true).id;
            }
            else {
                source = sourceExists.view(true).id;
            }

            const newApp = new App({
                name,
                source,
            });
            await newApp.save();
            return newApp.view(true);
        }
        catch (err: any) {
            throw new Error(err);
        }
    }

    public listApps = async (limit = "10", skip = "0") => {
        const apps = await App.find()
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
        return apps.map((app) => app.view(true));
    }

    public getApp = async (id: string) => {
        const app = await App.findById(id)
            .populate("authorizedUsers")
            .populate("authorizedGroups")
            .exec();
        if (!app) {
            throw new Error("App not found");
        }
        return app.view(true);
    }

    public addUsersToApp = async (appId: string, userIds: string[]) => {
        // Check if app exists
        const appExists = await App.findById(appId).exec();

        if (!appExists) {
            throw new Error("App not found");
        }

        // Check if users exist
        const users = await User.find({ _id: { $in: userIds } }).exec();

        if (users.length !== userIds.length) {
            throw new Error("Some users were not found");
        }

        // Check if users are already authorized
        const usersToAdd = users.filter((user) => !appExists.authorizedUsers.includes(user.id));

        if (usersToAdd.length === 0) {
            throw new Error("All users are already authorized");
        }

        // Add users to app
        appExists.authorizedUsers = [...appExists.authorizedUsers, ...userIds];

        await appExists.save();

        return appExists.view(true);
    }

    public addGroupsToApp = async (appId: string, groupIds: string[]) => {
        // Check if app exists
        const appExists = await App.findById(appId).exec();

        if (!appExists) {
            throw new Error("App not found");
        }

        // Check if groups exist
        const groups = await Group.find({ _id: { $in: groupIds } }).exec();

        if (groups.length !== groupIds.length) {
            throw new Error("Some groups were not found");
        }

        // Check if groups are already authorized
        const groupsToAdd = groups.filter((group) => !appExists.authorizedGroups.includes(group.id));

        if (groupsToAdd.length === 0) {
            throw new Error("All groups are already authorized");
        }

        // Add groups to app
        appExists.authorizedGroups = [...appExists.authorizedGroups, ...groupIds];

        await appExists.save();

        return appExists.view(true);
    }

    public removeUsersFromApp = async (appId: string, userIds: string[]) => {
        // Check if app exists
        const appExists = await App.findById(appId).exec();

        if (!appExists) {
            throw new Error("App not found");
        }

        // Check if users exist
        const users = await User.find({ _id: { $in: userIds } }).exec();

        if (users.length !== userIds.length) {
            throw new Error("Some users were not found");
        }

        // Check if users are already authorized
        const usersToRemove = users.filter((user) => appExists.authorizedUsers.includes(user.id));

        if (usersToRemove.length === 0) {
            throw new Error("All users are already unauthorized");
        }

        // Remove users from app 
        const newList = appExists.authorizedUsers.map((user) => {
            if (userIds.includes(user.toString())) {
                return undefined;
            }
            return user;
        });

        appExists.authorizedUsers = newList.filter((user) => user !== undefined) as string[];
        
        await appExists.save();

        return appExists.view(true);
    }

    public removeGroupsFromApp = async (appId: string, groupIds: string[]) => {
        // Check if app exists
        const appExists = await App.findById(appId).exec();

        if (!appExists) {
            throw new Error("App not found");
        }

        // Check if groups exist
        const groups = await Group.find({ _id: { $in: groupIds } }).exec();

        if (groups.length !== groupIds.length) {
            throw new Error("Some groups were not found");
        }

        // Check if groups are already authorized
        const groupsToRemove = groups.filter((group) => appExists.authorizedGroups.includes(group.id));

        if (groupsToRemove.length === 0) {
            throw new Error("All groups are already unauthorized");
        }

         // Remove groups from app 
        const newList = appExists.authorizedGroups.map((group) => {
            if (groupIds.includes(group.toString())) {
                return undefined;
            }
            return group;
        });

        appExists.authorizedGroups = newList.filter((group) => group !== undefined) as string[];

        await appExists.save();

        return appExists.view(true);
    }
}