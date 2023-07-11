import App from "../models/app.model";
import Group from "../models/group.model";
import User from "../models/user.model";
import SourceService from "./source.service";

const Source = new SourceService();

export default class UserService {
    public async create(user: any) {
        const { email, firstname, username, lastname, source } = user;

        const sourceID = await Source.createOrUseSource(source);

        const newUser = new User({
            email,
            firstname,
            username,
            lastname,
            source: sourceID,
        });
        await newUser.save();
        return newUser.view(true);
    }

    public async list(limit = "10", skip = "0") {
        const users = await User.find().limit(Number(limit)).skip(Number(skip)).exec();
        return users.map(user => user.view(true));
    }

    public async get(id: string) {
        const user = await User.findById(id).exec();
        if (!user) {
            throw new Error("User not found");
        }
        const authorizedAppsAsUser = await App.find({ authorizedUsers: id });
        const userGroups = await Group.find({ users: id }).exec();
        const authorizedAppsAsGroup = await App.find({
            authorizedGroups: { $in: userGroups.map(group => group.id) },
        }).exec();
        const authorizedApps = [...authorizedAppsAsUser, ...authorizedAppsAsGroup];
        if (!user) {
            throw new Error("User not found");
        }
        return {
            ...user.view(true),
            apps: authorizedApps.map(app => app.view(true)),
        };
    }

    public async getByEmail(email: string) {
        const user = await User.findOne({
            email,
        }).exec();

        return user ? user.view(true) : null;
    }

    public async update(id: string, user: any) {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true }).exec();
        if (!updatedUser) throw new Error("User not found");
        return updatedUser.view(true);
    }

    public async delete(id: string) {
        const deletedUser = await User.findByIdAndDelete(id).exec();
        if (!deletedUser) throw new Error("User not found");
        return deletedUser.view(true);
    }
}
