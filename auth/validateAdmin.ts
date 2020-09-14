import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

module.exports = () => (req: Request, res: Response, next: NextFunction) => {
    console.log("validating admin");
    try {
        const token = req.cookies.token || req.body.token;
        if (!token) {
            return res.status(401).json({
                message: "missing required token"
            });
        }

        if (!process.env.JWT_SECRET) throw Error("Please ensure all env vars are defined");

        jwt.verify(token, process.env.JWT_SECRET, (err: jwt.JsonWebTokenError | jwt.NotBeforeError | jwt.TokenExpiredError | null, decoded: any) => {
            if (err) {
                return res.status(401).json({
                    message: "invalid token"
                });
            }
            console.log(decoded.userAdmin);
            // checking that the user is an admin
            // todo: no user role in users table yet, need to add
            if (decoded.userAdmin !== 1) {
                return res.status(403).json({
                    message: "Unauthorized",
                });
            }
            req.body.token = decoded;
            req.body.id = decoded.userID;
            next();
        });
    } catch (err) {
        next(err);
    }
};
