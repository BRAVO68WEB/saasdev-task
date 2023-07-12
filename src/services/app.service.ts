import App from "../models/app.model";
import Group from "../models/group.model";
import User from "../models/user.model";
import SourceService from "./source.service";

const Source = new SourceService();

export default class AppService {
    public addApp = async (name: string, source: string) => {
        try {
            const sourceID = await Source.createOrUseSource(source);

            const newApp = new App({
                name,
                source: sourceID,
            });
            await newApp.save();
            return newApp.view(true);
        } catch (error: any) {
            throw new Error(error);
        }
    };

    public deleteApp = async (id: string) => {
        const app = await App.findByIdAndDelete(id).exec();
        if (!app) {
            throw new Error("App not found");
        }
        return app.view(true);
    };

    public listApps = async (limit = "10", skip = "0") => {
        let apps: any = await App.find().limit(Number(limit)).skip(Number(skip))
            .select("-createdAt -updatedAt").populate("source")
            .then(apps => apps.map(app => app.view(true)));
        apps = await Promise.all(
            apps.map(async (app: any) => {
                const source = await Source.getSourceById(app.source);
                let usersInApp = await User.find({ _id: { $in: app.authorizedUsers } })
                    .select("-createdAt -updatedAt").populate("source")
                    .then(users => users.map(user => user.view(true)));
                const groupsInApp = await Group.find({ _id: { $in: app.authorizedGroups } })
                    .select("-createdAt -updatedAt").populate("source")
                    .then(groups => groups.map(group => group.view(true)));

                const usersFromGroups = await Promise.all(
                    groupsInApp.map(async (group: any) => {
                        const usersInGroup = await User.find({ _id: { $in: group.emps } })
                            .select("-createdAt -updatedAt")
                            .populate("source")
                            .then(users => users.map(user => {
                                return {
                                    ...user.view(true),
                                    source: user.source?.name
                                }
                            }));
                        return usersInGroup;
                    })
                )

                usersInApp = [...usersInApp, ...usersFromGroups.flat()];
                
                delete app.authorizedUsers;
                delete app.authorizedGroups;

                return {
                    ...app,
                    source: {
                        id: source?._id,
                        name: source?.name,
                    },
                    emps: usersInApp,
                };
            }),
        );
        return apps;
    };

    public getApp = async (id: string) => {
        let app: any = await App.findById(id)
            .populate("authorizedUsers")
            .populate("authorizedGroups")
            .populate("source")
            .exec();
        if (!app) {
            throw new Error("App not found");
        }
        
        const source = await Source.getSourceById(app.source);

        let usersInApp = await User.find({ _id: { $in: app.authorizedUsers } })
            .select("-createdAt -updatedAt").populate("source")
            .then(users => users.map(user => {
                return {
                    ...user.view(true),
                    source: user.source?.name
                }
            }));
        
        const groupsInApp = await Group.find({ _id: { $in: app.authorizedGroups } })
            .select("-createdAt -updatedAt").populate("source")
            .then(groups => groups.map(group => group.view(true)));

        const usersFromGroups = await Promise.all(
            groupsInApp.map(async (group: any) => {
                const usersInGroup = await User.find({ _id: { $in: group.emps } })
                    .select("-createdAt -updatedAt")
                    .populate("source")
                    .then(users => users.map(user => {
                        return {
                            ...user.view(true),
                            source: user.source?.name
                        }
                    }));
                return usersInGroup;
            })
        )

        usersInApp = [...usersInApp, ...usersFromGroups.flat()];
        
        const originalApp = app.view(true);

        delete originalApp.authorizedUsers;
        delete originalApp.authorizedGroups;
        delete originalApp.id;
        delete originalApp.createdAt;
        delete originalApp.updatedAt;

        return {
            ...originalApp,
            source: {
                id: source?._id,
                name: source?.name,
            },
            emps: usersInApp,
        }
    };

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
        const usersToAdd = users.filter(user => !appExists.authorizedUsers.includes(user.id));

        if (usersToAdd.length === 0) {
            throw new Error("All users are already authorized");
        }

        // Add users to app
        appExists.authorizedUsers = [...appExists.authorizedUsers, ...userIds];

        await appExists.save();

        return appExists.view(true);
    };

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
        const groupsToAdd = groups.filter(group => !appExists.authorizedGroups.includes(group.id));

        if (groupsToAdd.length === 0) {
            throw new Error("All groups are already authorized");
        }

        // Add groups to app
        appExists.authorizedGroups = [...appExists.authorizedGroups, ...groupIds];

        await appExists.save();

        return appExists.view(true);
    };

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
        const usersToRemove = users.filter(user => appExists.authorizedUsers.includes(user.id));

        if (usersToRemove.length === 0) {
            throw new Error("All users are already unauthorized");
        }

        // Remove users from app
        const newList = appExists.authorizedUsers.map(user => {
            if (userIds.includes(user.toString())) {
                return undefined;
            }
            return user;
        });

        appExists.authorizedUsers = newList.filter(user => user !== undefined) as string[];

        await appExists.save();

        return appExists.view(true);
    };

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
        const groupsToRemove = groups.filter(group =>
            appExists.authorizedGroups.includes(group.id),
        );

        if (groupsToRemove.length === 0) {
            throw new Error("All groups are already unauthorized");
        }

        // Remove groups from app
        const newList = appExists.authorizedGroups.map(group => {
            if (groupIds.includes(group.toString())) {
                return undefined;
            }
            return group;
        });

        appExists.authorizedGroups = newList.filter(group => group !== undefined) as string[];

        await appExists.save();

        return appExists.view(true);
    };
}
