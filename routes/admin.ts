import express from "express";
export const adminRouter = express.Router();
import * as usersModel from "../models/users";
import {validateUserId} from "../middleware/validateUserId";

/******************************************************************************
 *                      Get all users - "GET /admin/users"
 ******************************************************************************/

adminRouter.get("/users", async (req, res, next) => {
    try {
        const users = await usersModel.get();
        if (users) {
            res.status(200).json(users);
        } else {
            res.status(404).json({error: `Error fetching users`});
        }
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
});

/******************************************************************************
 *                      Get user by id - "GET /admin/users/:id"
 ******************************************************************************/

adminRouter.get("/users/:id", validateUserId(), async (req, res, next) => {
    try {
        const user = await usersModel.getById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({error: `Error fetching user, try again later`});
        }
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
});

/******************************************************************************
 *                      Delete user - "DELETE /admin/users/:id"
 ******************************************************************************/
adminRouter.delete("/users/:id", validateUserId(), async (req, res, next) => {
    try {
        const result = await usersModel.remove(req.params.id);
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({error: "Error deleting user, try again later"});
        }

    } catch (err) {
        console.log(err.stack);
        next(err);
    }
});
