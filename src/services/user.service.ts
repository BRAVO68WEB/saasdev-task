import User from "../models/user.model";
import Source from "../models/source.model";
import App from "../models/app.model";

export default class UserService {
    public async create(user: any) {
        const { email, firstname, username, lastname, source } = user;

        const sourceExists = await Source.findOne({
            name: source
        }).exec();

        if (!sourceExists) {
            const newSource = await Source.create({
                name: source,
            });
            user.source = newSource.view(true).id;
        }
        else {
            user.source = sourceExists.view(true).id;
        }

        const newUser = new User({
            email,
            firstname,
            username,
            lastname,
            source: user.source,
        });
        await newUser.save();
        return newUser.view(true);
    }

    public async list(limit = "10", skip = "0") {
        const users = await User.find()
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
        return users.map((user) => user.view(true));
    }

    public async get(id: string) {
        const user = await User.findById(id).exec();
        if (!user) {
            throw new Error("User not found");
        }
        const authorizedAppsAsUser = await App.find({ authorizedUsers: id })
        const authorizedAppsAsGroup = await App.find({ authorizedGroups: { $in: user._id } })
        const authorizedApps = [...authorizedAppsAsUser, ...authorizedAppsAsGroup];
        if (!user) {
            throw new Error("User not found");
        }
        return {
            ...user.view(true),
            apps: authorizedApps.map((app) => app.view(true)),
        };
    }

    public async getByEmail(email: string) {
        const user = await User.findOne({
            email
        }).exec();

        if (!user)
            return null;
        else
            return user.view(true);
    }

    public async update(id: string, user: any) {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true }).exec();
        if (!updatedUser)
            throw new Error("User not found");
        return updatedUser.view(true);
    }

    public async delete(id: string) {
        const deletedUser = await User.findByIdAndDelete(id).exec();
        if (!deletedUser)
            throw new Error("User not found");
        return deletedUser.view(true);
    }
}