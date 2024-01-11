import api from './api/server.js';
import web from './server.js';
import { API_PORT, FE_PORT } from "./api/config/index.js";

api.listen(API_PORT, () =>
    console.log(`Api server running on http://localhost:${API_PORT}`)
);

web.listen(FE_PORT, () =>
    console.log(`Web server running on http://localhost:${FE_PORT}`)
);

