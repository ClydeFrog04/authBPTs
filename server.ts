import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import {validateAdmin} from "./auth/validateAdmin";
import {validateToken} from "./auth/validateToken";


import {indexRouter} from "./routes";
import {usersRouter} from "./routes/users";
import {authRouter} from "./auth/auth-router";
import {adminRouter} from "./routes/admin";

export const server = express();

server.use(logger("dev"));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, "public")));

server.use("/", indexRouter);
server.use("/auth", authRouter);
server.use("/users", validateToken(), usersRouter);
server.use("/admin", validateAdmin(), adminRouter);
