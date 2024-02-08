import HotDogGame from '../models/HotDogGame.js';
import HotDogPlayer from '../models/HotDogPlayer.js';
import mongoose from "mongoose";

/**
 * @route POST api/hotdog/player
 * @desc Creates a new player
 * @access Public
*/
export async function InsertPlayer(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { block, seat, hotdoggame, side } = req.body;
    try {
        // create an instance of a hotdogplayer
        const newPlayer = new HotDogPlayer({
            block,
            seat,
            hotdoggame,
            side
        });

        const savedPlayer = await newPlayer.save(); // save new hotdogplayer into the database

        res.status(200).json({
            status: "success",
            data: { id: savedPlayer._id },
            message:
                "HotDogPlayer saved successfully",
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

/**
 * @route POST api/hotdog/game
 * @desc Creates a new player
 * @access Public
*/
export async function InsertGame(req, res) {
    // get required variables from request body
    // using es6 object destructing
    try {
        // create an instance of a hotdoggame
        const newGame = new HotDogGame({
            isStarted: false,
            isActive: true
        });

        const savedGame = await newGame.save(); // save new hotdoggame into the database

        res.status(200).json({
            status: "success",
            data: { id: savedGame._id },
            message:
                "HotDogGame saved successfully",
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

/**
 * @route POST api/hotdog/game
 * @desc List active games
 * @access Public
*/
export async function GetGameList(req, res) {
    try {

        const games = await HotDogGame.find({ isActive: true }).exec();

        res.status(200).json({
            status: "success",
            data: games,
            message:
                "Hot Dog Game returned successfully",
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

/**
 * @route POST api/hotdog/startgame
 * @desc List active games
 * @access Public
*/
export async function StartGame(req, res) {
    try {

        const { gameId, timeData } = req.body;

        const hotDogGame = await HotDogGame.findOne({ _id: gameId })

        if (!hotDogGame) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Record not found!",
            });
        }
        else 
        {
            await HotDogGame.updateOne(
                { _id: gameId },
                {
                    $set: {
                        timeData: timeData,
                        isStarted: true
                    },
                },
                { upsert: false }
            );
        }

        res.status(200).json({
            status: "success",
            data: [],
            message:
                "Game started successfully",
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

/**
 * @route POST api/hotdog/game/id
 * @desc Get game by id
 * @access Public
*/
export async function GetGameById(req, res) {
    try {

        const games = await HotDogGame.find({ _id: req.params.id }).exec();

        res.status(200).json({
            status: "success",
            data: games,
            message:
                "Hot Dog Game returned successfully",
        });

    } catch (err) {
        console.log(err);

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
 * @route GET api/hotdog/game/id
 * @desc Get game by id
 * @access Public
*/
export async function GetGameStatus(req, res) {
    try {

        const homePlayerCount = await HotDogPlayer.countDocuments({ hotdoggame: req.params.id, side: 'home' });
        const awayPlayerCount = await HotDogPlayer.countDocuments({ hotdoggame: req.params.id, side: 'away' });

        res.status(200).json({
            status: "success",
            playerCounts: {
                home: homePlayerCount,
                away: awayPlayerCount,
            },
            message:
                "Game status returned successfully",
        });

    } catch (err) {
        console.log(err);

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
 * @route GET api/hotdog/playerlost/id
 * @desc Player lost by id
 * @access Public
*/
export async function PlayerLost(req, res) {
    HotDogPlayer.findByIdAndDelete(req.params.id).then((deletedPlayer) => {
        if (deletedPlayer) {
            res.status(200).json({
                status: "success",
                message:
                    "Player deleted successfully"
            });
        }
        else 
        {
            res.end();
        }
    }).catch((err) => {
        console.log(err);
        
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    });
}

/**
 * @route GET api/hotdog/checkwinner/id
 * @desc Get winner of the game
 * @access Public
*/
export async function CheckWinner(req, res) {

    HotDogGame.findByIdAndDelete(req.params.id).then((deletedGame) => {
        if (deletedGame) {
            const gameIdAsObjectId = new mongoose.Types.ObjectId(req.params.id);
            
            HotDogPlayer.aggregate([
                { $match: { hotdoggame: gameIdAsObjectId } },
                { $sample: { size: 1 } }
            ]).then(result => {
                if (result.length > 0) {
                    res.status(200).json({
                        status: "success",
                        winner: result[0]._id,
                        message: "Winner returned successfully",
                    });
                } else {
                    res.status(404).json({
                        status: "error",
                        message: "No players found",
                    });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    code: 500,
                    data: [],
                    message: "Internal Server Error",
                });
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Game not found",
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    });
    
}