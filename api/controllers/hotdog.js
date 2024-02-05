import HotDogGame from '../models/HotDogGame.js';
import HotDogPlayer from '../models/HotDogPlayer.js';

/**
 * @route POST api/hotdog/player
 * @desc Creates a new player
 * @access Public
*/
export async function InsertPlayer(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { block, seat } = req.body;
    try {
        // create an instance of a hotdogplayer
        const newPlayer = new HotDogPlayer({
            block,
            seat
        });

        await newPlayer.save(); // save new hotdogplayer into the database

        res.status(200).json({
            status: "success",
            data: [],
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

    res.end();
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
        const newGame = new HotDogGame();

        await newGame.save(); // save new hotdoggame into the database

        res.status(200).json({
            status: "success",
            data: [],
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

    res.end();
}

/**
 * @route POST api/hotdog/game
 * @desc Creates a new player
 * @access Public
*/
export async function GetGameList(req, res) {
    try {
        
        const games = await HotDogGame.find({ isActive: true, isFinished: false }).exec();

        res.status(200).json({
            status: "success",
            data: games,
            message:
                "Hot Dog Game list returned successfully",
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