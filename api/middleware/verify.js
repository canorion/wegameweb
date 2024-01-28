import Blacklist from '../models/Blacklist.js';
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';
import User from "../models/User.js";

export async function Verify(req, res, next) {

    const authHeader = req.headers['authorization'];

    //if (!authHeader) return res.sendStatus(204);
    
    if(!authHeader) return res.status(401)
    .json({ message: "You are not authorized!" });
    
    const accessToken = authHeader.split(' ')[1];

    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted

    // if true, send a no content response.
    //if (checkIfBlacklisted) return res.sendStatus(204);
    
    if (checkIfBlacklisted) return res.status(401)
    .json({ message: "You are not authorized!" });

    if (checkIfBlacklisted)
        return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
    // if token has not been blacklisted, verify with jwt to see if it has been tampered with or not.
    // that's like checking the integrity of the accessToken
    jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
            // if token has been altered, return a forbidden error
            return res
                .status(401)
                .json({ message: "This session has expired. Please login" });
        }

        const { id } = decoded; // get user id from the decoded token
        const user = await User.findById(id); // find user by that `id`
        const { password, ...data } = user._doc; // return user object but the password
        req.user = data; // put the data object into req.user
        next();
    });
}

export function VerifyRole(req, res, next) {
    try {
        const user = req.user; // we have access to the user object from the request
        const { role } = user; // extract the user role

        //console.log(user);

        // check if user has no advance privileges
        // return an unathorized response
        if (role !== "0x01") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized to view this page.",
            });
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}