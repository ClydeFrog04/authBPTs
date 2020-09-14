import express from "express";
import * as usersModel from "../models/users";
import {validateToken} from "../auth/validateToken";
import {validateUserId} from "../middleware/validateUserId";
import {validateAdmin} from "../auth/validateAdmin";
import {validateBody} from "../middleware/validateBody";

export const usersRouter = express.Router();

export interface IUser {
    username: string;
    password: string;
    id: string | number;
}


/******************************************************************************
 *                      Get current user - "GET /users/current-user"
 ******************************************************************************/

usersRouter.get("/current-user", validateToken(), async (req, res, next) => {
    try {
        const user = await usersModel.getById(req.body.id);//todo: confirm that the id is on the body
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: `No user found with that id`});
        }
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
});

/******************************************************************************
 *                      Update current user - "PUT /users/current-user"
 ******************************************************************************/

usersRouter.put("/current-user", validateToken(), validateBody(), async (req, res, next) => {
    console.log(req.body);
    const user = {
        username: req.body.username,
        password: req.body.password,
        id: req.body.id,
    };
    try {
        const result = await usersModel.update(user);
        if (result) {
            res.status(204).end();
        } else {
            res.status(400).json({message: "Error updating user"});
        }
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
});

/******************************************************************************
 *                      Delete current user - "DELETE /users/current-user"
 ******************************************************************************/

usersRouter.delete("/current-user", validateToken(), async (req, res, next) => {
    try {
        const result = await usersModel.remove(req.body.id);
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({message: "Error deleting user"});
        }
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
});