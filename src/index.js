//import dotenv from "dotenv";
//dotenv.config({ path: "./.env" });

// import "dotenv/config"; 

// import app from "./app.js";
// import connectDB from "./db/index.js";

// const PORT = process.env.PORT || 5000;

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// });

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
