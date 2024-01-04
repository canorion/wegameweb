const express = require("express");
const router = express.Router();
const db = require("../database")

router.use("/games/:id", function (req, res) {
    var sql = "SELECT * FROM Games WHERE Id = ?";
    var params = [req.params.id];
    
    db.get(sql, params, (err, row) => {
        if (err) {
            res.write("An error occured!");
            res.end();
        }
        res.render("games", {
            game: row
        });
    });
});

router.use("/home", function (req, res) {
    var sql = "SELECT * FROM Games";
    var params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.write("An error occured!");
            res.end();
        }
        res.render("home", {
            gameList: rows
        });
    });
});

router.use("/", function (req, res) {
    res.render("index");
});

module.exports = router;