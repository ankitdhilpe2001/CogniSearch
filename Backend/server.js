import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectToDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.sockets.js";

const PORT = process.env.PORT || 8080;

connectToDB();

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
