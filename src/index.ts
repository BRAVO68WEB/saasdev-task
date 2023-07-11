import "dotenv/config";

import path from "node:path";

import cors from "cors";
import express from "express";
import { auth } from "express-openid-connect";
import morgan from "morgan";

import "./config/env";
import "./helpers/connectDb";

import { config } from "./config/authConfig";
import { route } from "./routes";

const server = express();

const __dirname = path.resolve();

server.set("view engine", "ejs");
server.set("views", path.join(__dirname + "/src/", "views"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"));

server.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        maxAge: 86_400,
    }),
);

server.use(
    auth({
        ...config,
        routes: {
            login: false,
            postLogoutRedirect: "/",
        },
        clientSecret: process.env.CLIENT_SECRET,
        // idTokenSigningAlg: "",
    }),
);

server.use("/", route);

server.listen(3000);

console.log("🚀 Server is running on port 3000.");
