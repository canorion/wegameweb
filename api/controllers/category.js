import Category from '../models/Category.js';

/**
 * @route POST api/category
 * @desc Creates a new category
 * @access Private
*/
export async function Insert(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { name, imageUrl, description } = req.body;
    try {
        // create an instance of a category
        const newCategory = new Category({
            name,
            imageUrl,
            description
        });

        await newCategory.save(); // save new category into the database

        res.status(200).json({
            status: "success",
            data: [],
            message:
                "Category saved successfully",
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
 * @route List api/category
 * @desc List all categories
 * @access Private
*/
export async function List(req, res) {
    try {
        
        const categories = await Category.find({});

        res.status(200).json({
            status: "success",
            data: categories,
            message:
                "Category list returned successfully",
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
