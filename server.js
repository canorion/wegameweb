import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import App from "./routes/index.js";

const server = express();

server.use(cors());
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

App.set("view engine", "ejs");
App.use(express.static("public"));
App.use(express.static("node_modules"));

server.use(App);

export default server;