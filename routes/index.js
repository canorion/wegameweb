import express from "express";
import AuthenticateToken from "../middleware/authenticateToken.js"
import { LoginUser, LogoutUser } from '../controllers/auth.js';
import { GetCategoryList } from '../controllers/category.js';
import { GetGameById } from '../controllers/game.js';

///API
import Auth from '../api/routes/auth.js';
import Game from '../api/routes/game.js';
import Category from '../api/routes/category.js';
import Team from '../api/routes/team.js';
import HotDogPlayer from '../api/routes/hotdog.js';
import { Verify, VerifyRole } from "../api/middleware/verify.js";

const app = express();

app.get('/', AuthenticateToken, GetCategoryList);

app.get("/game/:id", AuthenticateToken, GetGameById);

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/logout", LogoutUser, async function (req, res) {

});

app.post('/login', LoginUser);

//API

app.get("/api/admin", Verify, VerifyRole, (req, res) => {
  res.status(200).json({
      status: "success",
      message: "Welcome to the Admin portal!",
  });
});

app.get("/api/user", Verify, (req, res) => {
  res.status(200).json({
      status: "success",
      message: "Welcome to the your Dashboard!",
  });
});

// home route with the get method and a handler
app.get("/api", (req, res) => {
  try {
      res.status(200).json({
          status: "success",
          data: [],
          message: "Welcome to our API homepage!",
      });
  } catch (err) {
      res.status(500).json({
          status: "error",
          message: "Internal Server Error",
      });
  }
});

app.use('/api/auth', Auth);
app.use('/api/game', Game);
app.use('/api/category', Category);
app.use('/api/team', Team);
app.use('/api/hotdog', HotDogPlayer);


export default app;