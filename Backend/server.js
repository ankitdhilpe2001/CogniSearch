import "dotenv/config";
import app from "./src/app.js";
import {createServer} from "http";
import connectToDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.sockets.js";

const PORT = process.env.PORT;

connectToDB();

const Server = createServer(app);
initSocket(Server);

Server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
