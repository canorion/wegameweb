import { SECRET_ACCESS_TOKEN } from '../api/config/index.js'
import jwt from 'jsonwebtoken';

const AuthenticateToken = (req, res, next) => {
    
  const token = req.cookies.access_token;

  if (!token) return res.render("login");

  jwt.verify(token, SECRET_ACCESS_TOKEN, (err, user) => {
    if (err) return res.render("login");
    req.user = user;
    next();
  });
}

export default AuthenticateToken;