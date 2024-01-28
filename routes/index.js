import express from "express";
import AuthenticateToken from "../middleware/authenticateToken.js"
import { LoginUser, LogoutUser } from '../controllers/auth.js';
import { GetCategoryList } from '../controllers/category.js';
import { GetGameById } from '../controllers/game.js';

const app = express();

app.get('/', AuthenticateToken, GetCategoryList);

app.get("/game/:id", AuthenticateToken, GetGameById);

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/logout", LogoutUser, async function (req, res) {

});

app.post('/login', LoginUser);


export default app;