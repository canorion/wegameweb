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

        const hotDogGame = await HotDogGame.findOne({ _id: gameId });

        if (!hotDogGame) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Record not found!",
            });
        }
        else {
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
 * @route GET api/hotdog/checkwinner/id
 * @desc Get winner of the game
 * @access Public
*/

function calculateTotalDifference(array1, array2) {
    let minLength = Math.min(array1.length, array2.length);
    let difference = 0;
    for (let i = 0; i < minLength; i++) {
      difference += Math.abs(array1[i] - array2[i]);
    }
    return difference;
  }

export async function CheckWinner(req, res) {

    const hotDogGame = await HotDogGame.findOne({ _id: req.params.id });

    var gameTimeData = hotDogGame.timeData.split(',');

    gameTimeData = gameTimeData.map(function (item) {
        return parseFloat(item);
    });

    let smallestDifference = Infinity;
    let winner = '';
    let playerId = '';
    
    HotDogPlayer.find({
        hotdoggame: req.params.id
    }).then((documents) => {
        documents.forEach((record) => {
            if ('timeData' in record && record.timeData) 
            {
                var recordTimeData = record.timeData.split(',');

                recordTimeData = recordTimeData.map(function (item) {
                    return parseFloat(item);
                });
                
                const recordDifference = calculateTotalDifference(gameTimeData, recordTimeData);
                
                // console.log("gameTimeData: " + gameTimeData.join(','));
                // console.log("recordTimeData: " + recordTimeData.join(','));
                // console.log("recordDifference: " + recordDifference);
                
                if (recordDifference < smallestDifference) {
                    console.error(record);
                
                    smallestDifference = recordDifference;
                    
                    playerId = record._id;
                    winner = record.side + ' side, Block: ' + record.block + ', Seat: ' + record.seat;
                }
            }
        });
        
        //HotDogGame.findByIdAndDelete(req.params.id).then(function (record) { });

        HotDogGame.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    winner: winner.toUpperCase()
                },
            },
            { upsert: false }
        );
        
        res.status(200).json({
            status: "success",
            playerId: playerId,
            winner: winner.toUpperCase(),
            message: "Winner returned successfully",
        });
        
    }).catch((err) => {
        console.error(err);
    });
}

/**
 * @route GET api/hotdog/endGame/id
 * @desc Get winner of the game
 * @access Public
*/
export async function EndGame(req, res) {

    await HotDogGame.updateOne(
        { _id: req.params.id },
        {
            $set: {
                isFinished: true
            },
        },
        { upsert: false }
    );
    
    res.end();
}


/**
 * @route POST api/hotdog/playertimedata
 * @desc Insert player time data
 * @access Public
*/
export async function PlayerTimeData(req, res) {
    try {

        const { playerId, timeData } = req.body;

        await HotDogPlayer.updateOne(
            { _id: playerId },
            {
                $set: {
                    timeData: timeData
                },
            },
            { upsert: false }
        );

        res.status(200).json({
            status: "success",
            data: [],
            message:
                "Playet time data inserted successfully",
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
