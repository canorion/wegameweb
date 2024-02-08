import express from "express";
import { InsertPlayer, InsertGame, GetGameList, StartGame, GetGameById, GetGameStatus, CheckWinner, EndGame, PlayerTimeData } from "../controllers/hotdog.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
    "/player",
    check("block")
        .not()
        .isEmpty()
        .withMessage("Block is required")
        .trim()
        .escape(),
    check("seat")
        .not()
        .isEmpty()
        .withMessage("Seat is required")
        .trim()
        .escape(),
    check("side")
        .not()
        .isEmpty()
        .withMessage("Side is required")
        .trim()
        .escape(),
    Validate,
    InsertPlayer
);

router.post("/game", InsertGame);

router.post("/startgame", StartGame);

router.get("/game", GetGameList);

router.get("/game/:id", GetGameById);

router.get("/gamestatus/:id", GetGameStatus);

router.get("/checkwinner/:id", CheckWinner);

router.get("/endgame/:id", EndGame);

router.post("/playertimedata", PlayerTimeData);

export default router;