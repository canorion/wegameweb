import * as dotenv from "dotenv";

dotenv.config();

const { API_PORT, DB_URI, SECRET_ACCESS_TOKEN, FE_PORT } = process.env;

export { API_PORT, DB_URI, SECRET_ACCESS_TOKEN, FE_PORT };