
import app from "./src/server"
import serverless from 'serverless-http';
export const handle = serverless(app);
