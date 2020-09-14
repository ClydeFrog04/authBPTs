import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import validateAdmin from "./auth/validateAdmin";
import {validateToken} from "./auth/validateToken";


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./auth/auth-router");
const adminRouter = require("./routes/admin");

const server = express();

server.use(logger("dev"));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, "public")));

server.use("/", indexRouter);
server.use("/auth", authRouter);
server.use("/users", validateToken(), usersRouter);
server.use("/admin", validateAdmin(), adminRouter);

module.exports = server;
