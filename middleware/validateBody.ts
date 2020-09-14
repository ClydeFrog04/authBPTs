import usersModel from "../models/users";
import {Request, Response, NextFunction} from "express";

export const validateBody = () => (req:Request, res:Response, next:NextFunction) => {
    console.log("validating body");
    const {password, username} = req.body;
    console.log(password, username);
    if (password || username) {
        next();
    } else {
        res.status(400).json({message: "Bad Request, no data sent"});
    }
};
