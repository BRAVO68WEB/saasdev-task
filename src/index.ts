import 'dotenv/config'
import express from 'express'

import "./config/env";
import { app } from "./routes";
import cors from 'cors';
import { config } from './config/authConfig';
import { auth } from 'express-openid-connect';
import path from 'path';

const server = express();

const __dirname = path.resolve();

server.set('view engine', 'ejs');
server.set("views", path.join(__dirname + '/src/', "views"));
server.use(express.urlencoded({ extended: true }));

server.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        maxAge: 86400,
    })
);

server.use(auth(config));

server.use("/", app);

server.listen(3000);

console.log("🚀 Server is running on port 3000.");