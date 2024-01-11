import express from "express";
import AuthenticateToken from "../middleware/authenticateToken.js"
import { LoginUser, LogoutUser } from '../controllers/auth.js';
import { GetGamesList } from '../controllers/game.js';

const app = express();

app.get('/', AuthenticateToken, GetGamesList);

// router.get("/game/:id", isAuthenticated, function (req, res) {
//     var sql = "SELECT * FROM Games WHERE Id = ?";
//     var params = [req.params.id];

//     db.get(sql, params, (err, row) => {
//         if (err) {
//             res.write("An error occured!");
//             res.end();
//         }
//         res.render("games", {
//             game: row
//         });
//     });
// });

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/logout", LogoutUser, async function (req, res) {

});

app.post('/login', LoginUser);


export default app;