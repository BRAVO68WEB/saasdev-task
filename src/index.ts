import 'dotenv/config'
import { serve } from "@hono/node-server";

import "./config/env";
import { app } from "./routes";

serve(app);

console.log("🚀 Server is running on port 3000.");