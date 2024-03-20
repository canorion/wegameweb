import User from "../models/User.js";
import bcrypt from "bcrypt";
import Blacklist from '../models/Blacklist.js';

/**
 * @route POST api/auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Register(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { first_name, last_name, email, pass } = req.body;
    try {
        // create an instance of a user
        const newUser = new User({
            first_name,
            last_name,
            email
        });
        newUser.password = pass;

        //console.log(newUser);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });

        await newUser.save(); // save new user into the database

        res.status(200).json({
            status: "success",
            data: [],
            message:
                "Thank you for registering with us. Your account has been successfully created.",
        });
    } catch (err) {
        //console.log(err);

        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}

/**
 * @route POST api/auth/login
 * @desc logs in a user
 * @access Public
 */
export async function Login(req, res) {
    // Get variables for the login process
    const { email } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });

        // if user exists
        // validate password
        const isPasswordValid = bcrypt.compareSync(
            `${req.body.pass}`,
            user.password
        );

        //console.log(isPasswordValid);

        // if not valid, return unathorized response
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });

        // update all old games
        await Game.updateMany(
            {},
            {
                $set: {
                    isStarted : true,
                    isFinished : true
                },
            },
            { upsert: false }
        );
            
        let options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        const token = user.generateAccessJWT(); // generate session token for user
        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
        res.status(200).json({
            token: token,
            status: "success",
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Public
 */
export async function Logout(req, res) {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) return res.sendStatus(204);

        const accessToken = authHeader.split(' ')[1];

        const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted

        // if true, send a no content response.
        if (checkIfBlacklisted) return res.sendStatus(204);
        // otherwise blacklist token
        const newBlacklist = new Blacklist({
            token: accessToken,
        });

        await newBlacklist.save();

        res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
    res.end();
}