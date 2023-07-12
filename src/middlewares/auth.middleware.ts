import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface ModRequest extends Request {
    user?: any;
}

const authMiddleware = (req: ModRequest, res: Response, next: NextFunction) => {
    try {
        if (req.oidc.isAuthenticated()) {
            return next();
        } else if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const tokendata = jwt.decode(token);
            if (tokendata) {
                req.user = tokendata;
                return next();
            } else {
                throw new Error("Unauthorized");
            }
        } else {
            throw new Error("Unauthorized");
        }
    } catch {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
    }
};

export default authMiddleware;
