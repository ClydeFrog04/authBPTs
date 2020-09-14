import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";


export const validateToken = () => (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.cookies.token || req.body.token;
        if (!token) {
            return res.status(401).json({
                message: "missing required token"
            });
        }
        //todo: What is the best way to type this?
        jwt.verify(token, process.env.JWT_SECRET!, (err: jwt.JsonWebTokenError | jwt.NotBeforeError | jwt.TokenExpiredError | null, decoded: any) => {
            if (err) {
                return res.status(401).json({
                    message: "invalid token"
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
