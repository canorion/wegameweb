import express from "express";
import { InsertPlayer, InsertGame, GetGameList } from "../controllers/hotdog.js";
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
        .withMessage("Description is required")
        .trim()
        .escape(),
    Validate,
    InsertPlayer
);

router.post(
    "/game",
    InsertGame
);

router.get(
    "/game",
    GetGameList
);

export default router;