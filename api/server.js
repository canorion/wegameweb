import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import App from "./routes/index.js";
import { DB_URI } from "./config/index.js";

const server = express();

// CONFIGURE HEADER INFORMATION
// Allow request from any source. In real production, this should be limited to allowed origins only
server.use(cors());
server.disable("x-powered-by"); //Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Set up mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(DB_URI, {})
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

server.use(App);

export default server;