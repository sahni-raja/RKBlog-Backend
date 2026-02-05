import "dotenv/config";
import http from "http";

import app from "./app.js";
import connectDB from "./db/index.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

connectDB().then(() => {
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
