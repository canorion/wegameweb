import * as dotenv from "dotenv";

dotenv.config();

const { DB_URI, SECRET_ACCESS_TOKEN, FE_PORT } = process.env;

export { DB_URI, SECRET_ACCESS_TOKEN, FE_PORT };