import express from "express";
import { Insert, List } from "../controllers/category.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";
import { Verify, VerifyRole } from "../middleware/verify.js";

const router = express.Router();

router.get("/", Verify, VerifyRole, List);

router.post(
    "/", Verify, VerifyRole,
    check("name")
        .not()
        .isEmpty()
        .withMessage("Name is required")
        .trim()
        .escape(),
    check("imageUrl")
        .not()
        .isEmpty()
        .withMessage("ImageUrl is required")
        .trim()
        .escape(),
    check("description")
        .not()
        .isEmpty()
        .withMessage("Description is required")
        .trim()
        .escape(),
    Validate,
    Insert
);

export default router;