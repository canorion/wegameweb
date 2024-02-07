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
    const { block, seat, hotdoggame } = req.body;
    try {
        // create an instance of a hotdogplayer
        const newPlayer = new HotDogPlayer({
            block,
            seat, 
            hotdoggame
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
        const newGame = new HotDogGame({
            isStarted: false,
            isActive: true,
            isFinished: false
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

    res.end();
}

/**
 * @route POST api/hotdog/game
 * @desc List active games
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

        await HotDogGame.updateOne(
            { _id: gameId },
            {
                $set: {
                    timeData: timeData,
                    isStarted: true
                },
            },
            /* Set the upsert option to insert a document if no documents
            match the filter */
            { upsert: false }
        );
        
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

    res.end();
}