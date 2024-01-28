import Team from "../models/Team.js";

/**
 * @route POST api/team
 * @desc Creates a new team
 * @access Private
*/
export async function Insert(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { name, imageUrl } = req.body;
    try {
        // create an instance of a team
        const newTeam = new Team({
            name,
            imageUrl
        });

        await newTeam.save(); // save new team into the database

        res.status(200).json({
            status: "success",
            data: [],
            message:
                "Team saved successfully",
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
 * @route List api/team
 * @desc List all teams
 * @access Private
*/
export async function List(req, res) {
    try {
        
        const teams = await Team.find({}).sort({'name': 'asc'});

        res.status(200).json({
            status: "success",
            data: teams,
            message:
                "Team list returned successfully",
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
