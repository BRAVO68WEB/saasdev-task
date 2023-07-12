import App from "../models/app.model";
import Group from "../models/group.model";
import User from "../models/user.model";

export default class GroupService {
    async getGroups() {
        let groups : any = await Group.find()
            .populate("source")
            .select("-createdAt -updatedAt")
            .then(groups => groups.map(group => {
                return {
                    ...group.view(true),
                    source: group.source.name
                }
            })
        );

        groups = await Promise.all(
            groups.map(async (group: any) => {
                const usersInGroup = await User.find({ _id: { $in: group.emps } }).select("-source -createdAt -updatedAt").then(users => users.map(user => user.view(true)));
                return {
                    ...group,
                    emps: usersInGroup
                }
            })
        );

        return groups;
    }

    async getGroupById(id: string) {
        const groupInfo = await Group.findById(id)
            .populate("source")
            .select("-createdAt -updatedAt")
        if (!groupInfo) {
            throw new Error("Group not found");
        }
        const authorizedApps = await App.find({ authorizedGroups: id }).select("id name");
        const usersInGroup = await User.find({ _id: { $in: groupInfo.users } }).select("-source -createdAt -updatedAt").then(users => users.map(user => user.view(true)));
        return {
            ...groupInfo.view(true),
            apps: authorizedApps.map(app => app.view(true)),
            source: groupInfo.source.name,
            emps: usersInGroup
        };
    }

    async removeGroup(id: string) {
        const group = await Group.findByIdAndDelete(id);
        if (!group) {
            throw new Error("Group not found");
        }
        return group.view(true);
    }

    async create(group: any, source: string) {
        const { name, users } = group;

        const newGroup = new Group({
            name,
            users,
            source,
        });
        await newGroup.save();
        return newGroup.view(true);
    }

    async addUsersToGroup(groupId: string, userIds: string[]) {
        try {
            const checkIfGroupExists = await Group.findById(groupId).exec();

            if (!checkIfGroupExists) {
                throw new Error("Group not found");
            }

            const users = await User.find({ _id: { $in: userIds } }).exec();

            if (users.length !== userIds.length) {
                throw new Error("Some users were not found");
            }

            const usersToAdd = users.filter(user => !checkIfGroupExists.users.includes(user.id));

            if (usersToAdd.length === 0) {
                throw new Error("All users are already in the group");
            }

            checkIfGroupExists.users = [...checkIfGroupExists.users, ...userIds];

            await checkIfGroupExists.save();

            return checkIfGroupExists.view(true);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async removeUsersFromGroup(groupId: string, userIds: string[]) {
        try {
            const checkIfGroupExists = await Group.findById(groupId).exec();

            if (!checkIfGroupExists) {
                throw new Error("Group not found");
            }

            const users = await User.find({ _id: { $in: userIds } }).exec();

            if (users.length !== userIds.length) {
                throw new Error("Some users were not found");
            }

            const usersToRemove = users.filter(user => checkIfGroupExists.users.includes(user.id));

            if (usersToRemove.length === 0) {
                throw new Error("None of the users are in the group");
            }

            checkIfGroupExists.users = checkIfGroupExists.users.filter(
                userId => !userIds.includes(userId),
            );

            await checkIfGroupExists.save();

            return checkIfGroupExists.view(true);
        } catch (error: any) {
            throw new Error(error);
        }
    }
}
