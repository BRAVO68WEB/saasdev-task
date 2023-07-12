import App from "../models/app.model";
import Group from "../models/group.model";
import User from "../models/user.model";

export default class UtilService {
    async checkIfUserHasAppAccess(user: string, app: string) {
        const cheeckUser = await User.findOne({
            email: user,
        });
        if (!cheeckUser) {
            throw new Error("User not found");
        }
        const checkApp = await App.findOne({
            name: app,
        });
        if (!checkApp) {
            throw new Error("App not found");
        }

        const authorizedAppsAsUser = await App.find({
            authorizedUsers: cheeckUser.id,
            name: app,
        }).exec();

        const userGroups = await Group.find({ users: cheeckUser.id }).exec();
        const authorizedAppsAsGroup = await App.find({
            authorizedGroups: { $in: userGroups.map(group => group.id) },
            name: app,
        }).exec();
        const authorizedApps = [...authorizedAppsAsUser, ...authorizedAppsAsGroup];

        return authorizedApps.length === 0 ? false : true;
    }
}
