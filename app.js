import web from './server.js';
import { FE_PORT } from "./api/config/index.js";

web.listen(FE_PORT, () =>
    console.log(`Web server running on http://localhost:${FE_PORT}`)
);

