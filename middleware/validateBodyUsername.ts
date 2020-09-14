import * as usersModel from "../models/users";
import {Request, Response, NextFunction} from "express";

module.exports = () => (req:Request, res:Response, next:NextFunction) => {
    console.log("validating username");
    const {username} = req.body;
    if (username) {
        next();
    } else {
        res.status(400).json({message: "no username supplied"});
    }
};
