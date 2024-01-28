import express from "express"; // import the express module
import Auth from './auth.js';
import Game from './game.js';
import Category from './category.js';
import Team from './team.js';
import { Verify, VerifyRole } from "../middleware/verify.js";

const app = express(); // Create an app object

app.get("/api/admin", Verify, VerifyRole, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the Admin portal!",
    });
});

app.get("/api/user", Verify, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the your Dashboard!",
    });
});

// home route with the get method and a handler
app.get("/api", (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            data: [],
            message: "Welcome to our API homepage!",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
});

app.use('/api/auth', Auth);
app.use('/api/game', Game);
app.use('/api/category', Category);
app.use('/api/team', Team);

export default app;