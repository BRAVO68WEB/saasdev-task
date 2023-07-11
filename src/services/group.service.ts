import Group from '../models/group.model';
import User from '../models/user.model';

export default class GroupService {
    async getGroups() {
        return Group.find();
    }

    async getGroup(name: string) {
        return Group.findOne({ name });
    }

    async getGroupById(id: string) {
        return Group.findById(id);
    }

    async create(group: any) {
        const { name, users, source } = group;

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

            const usersToAdd = users.filter((user) => !checkIfGroupExists.users.includes(user.id));

            if (usersToAdd.length === 0) {
                throw new Error("All users are already in the group");
            }

            checkIfGroupExists.users = [...checkIfGroupExists.users, ...userIds];

            await checkIfGroupExists.save();

            return checkIfGroupExists.view(true);
        }
        catch (err: any) {
            console.log(err);
            throw new Error(err);
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

            const usersToRemove = users.filter((user) => checkIfGroupExists.users.includes(user.id));

            if (usersToRemove.length === 0) {
                throw new Error("None of the users are in the group");
            }

            checkIfGroupExists.users = checkIfGroupExists.users.filter((userId) => !userIds.includes(userId));

            await checkIfGroupExists.save();

            return checkIfGroupExists.view(true);
        }
        catch (err: any) {
            console.log(err);
            throw new Error(err);
        }
    }
}