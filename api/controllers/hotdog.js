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

        await HotDogGame.updateMany(
            {
                _id:
                {
                    $ne: gameId
                }
            },
            {
                $set: {
                    isFinished: true
                },
            }
        );

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
 * @route POST api/hotdog/game/id
 * @desc Get game by id
 * @access Public
*/
export async function GetGameStatus(req, res) {
    try {

        const games = await HotDogGame.find({ _id: req.params.id }).exec();
        
        const homePlayerCount = await HotDogPlayer.countDocuments({ hotdoggame: req.params.id, side: 'home' });
        const awayPlayerCount = await HotDogPlayer.countDocuments({ hotdoggame: req.params.id, side: 'away' });

        const gameStatus = games[0].isFinished;
        
        res.status(200).json({
            status: "success",
            playerCounts: {
                home: homePlayerCount,
                away: awayPlayerCount,
            },
            isFinished: gameStatus,
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