import * as usersModel from "../models/users";
import {IUser} from "../routes/users";
import {Request, Response, NextFunction} from "express";

export const validateUserId = () => (req:Request, res:Response, next:NextFunction) => {
    try {
        console.log("validating user id");
        const {id} = req.params;
        usersModel.getById(id)
            .then((user: IUser) => {
                if (user) {
                    next();
                } else {
                    res.status(400).json({message: "Invalid user ID"});
                }
            });
    } catch (err) {
        next(err);
    }
};
