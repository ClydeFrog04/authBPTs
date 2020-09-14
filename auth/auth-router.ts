const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import * as usersModel from "../models/users";
import {v4 as uuidv4} from "uuid";
import {Request, Response, NextFunction} from "express";

const validateBodyUsername = require("../middleware/validateBodyUsername");
const validateBodyPassword = require("../middleware/validateBodyPassword");
const validateToken = require("./validateToken");


export const authRouter = require("express").Router();


/******************************************************************************
 *                      Register User - "POST /api/auth/register"
 ******************************************************************************/

authRouter.post("/register", validateBodyPassword(), validateBodyUsername(), async (req:Request, res:Response) => {
    const username = req.body.username;
    const duplicateUser = await usersModel.getBy({username});
    if (duplicateUser.length > 0) {
        res.status(400).json({message: "username already taken"});
    } else {
        const user = req.body;
        user.password = bcrypt.hashSync(user.password, 10);
        user.id = uuidv4();
        try {
            await usersModel.create(user);
            res.status(201).json({message: "User successfully created"});
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
});

/******************************************************************************
 *                      Login User - "POST /auth/login"
 ******************************************************************************/


authRouter.post("/login", validateBodyPassword(), validateBodyUsername(), async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {username, password} = req.body;
        const user = await usersModel.getBy({username});
        if (user.length === 0) {
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }
        // hash the password again and see if it matches what we have in the database
        const passwordValid = bcrypt.compareSync(password, user[0].password);
        if (!passwordValid) {
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }
        // generate a new JSON web token
        if(!process.env.JWT_SECRET) throw Error("Please ensure all necessary env variables are defined");
        const token = jwt.sign({
            userID: user[0].id,
            userAdmin: user[0].admin
        }, process.env.JWT_SECRET);
        // send the token back as a cookie
        res.cookie("token", token);
        res.json({
            token,
            message: `Welcome ${user[0].username}!`,
        });
    } catch (err) {
        next(err);
    }
});

/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

authRouter.get("/logout", validateToken(), async (req:Request, res:Response) => {
    await res.clearCookie("token").end();
    // return res.status(OK).end();
});