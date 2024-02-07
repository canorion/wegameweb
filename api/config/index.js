import * as dotenv from "dotenv";

dotenv.config();

//const { API_PORT, DB_URI, SECRET_ACCESS_TOKEN, FE_PORT } = process.env;

const API_PORT = process.env.API_PORT || 3000;
const FE_PORT = process.env.FE_PORT || 3001;

const DB_URI = process.env.DB_URI;
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;



export { API_PORT, DB_URI, SECRET_ACCESS_TOKEN, FE_PORT };