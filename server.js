import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import App from "./routes/index.js";
import { DB_URI } from "./api/config/index.js";

const server = express();

server.use(cors());
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

App.use(function(req, res, next) {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });

App.set("view engine", "ejs");
App.use(express.static("public"));
App.use(express.static("node_modules"));
App.use('/football', express.static('public/games/game1/'));

// Set up mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(DB_URI, {})
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

server.use(App);

export default server;