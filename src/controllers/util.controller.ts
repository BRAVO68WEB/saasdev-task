import UserService from "../services/user.service";
import UtilService from "../services/utils.service";

export default class UtilsController {
    public static getHealth(_req: any, res: any) {
        return res.status(200).send("OK");
    }

    public static async userInfo(req: any, res: any) {
        try {
            const userInfo = req.oidc.user;

            if (!userInfo) {
                return res.redirect("/login");
            }

            const checkIfUserExists = await new UserService().getByEmail(userInfo.email);

            if (checkIfUserExists) {
                return res.json(checkIfUserExists);
            } else {
                const user = await new UserService().create({
                    email: userInfo.email,
                    firstname: userInfo.given_name,
                    username: userInfo.nickname,
                    lastname: userInfo.family_name,
                    source: "oidc",
                });

                return res.json(user);
            }
        } catch (error) {
            console.log(error);
        }
    }

    public static async checkUserToAppConn(req: any, res: any) {
        try {
            const check = await new UtilService().checkIfUserHasAppAccess(
                req.body.email,
                req.body.app_name,
            );
            return res.json({
                access: check,
            });
        } catch (error: any) {
            res.status(500).json({
                error: error.message,
            });
        }
    }
}
