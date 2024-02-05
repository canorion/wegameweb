import Game from '../models/Game.js';

/**
 * @route POST api/game
 * @desc Creates a new game
 * @access Private
*/
export async function Insert(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { name, description, imageUrl, category } = req.body;
    try {
        // create an instance of a game
        const newGame = new Game({
            name,
            description,
            imageUrl,
            category
        });

        await newGame.save(); // save new game into the database

        res.status(200).json({
            status: "success",
            data: [],
            message:
                "Game saved successfully",
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
 * @route PUT api/games
 * @desc Creates a new game
 * @access Private
*/
export async function Update(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { name, description, imageUrl, isActive } = req.body;

    try {

        const item = await Game.findOne({ _id: req.body._id })

        //console.log(item);

        if (!item) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Record not found!",
            });
        }

        await Game.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    name: name,
                    description: description,
                    imageUrl: imageUrl,
                    isActive: isActive
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
                "Game updated successfully",
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
 * @route Delete api/games
 * @desc Creates a new game
 * @access Private
*/
export async function Delete(req, res) {
    // get required variables from request body
    // using es6 object destructing
    try {

        const item = await Game.findOne({ _id: req.body._id })

        if (!item) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Record not found!",
            });
        }

        await Game.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    isActive: false,
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
                "Game deleted successfully",
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
 * @route List api/games
 * @desc List all games
 * @access Private
*/
export async function List(req, res) {
    try {
        
        const games = await Game.find({ isActive: true }).populate('category').exec();

        res.status(200).json({
            status: "success",
            data: games,
            message:
                "Game list returned successfully",
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


