const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (for frontend)
app.use(express.static("public"));

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("disconnect", () => {
        console.log("A client disconnected");
    });
});

// Listen for data from Python
const net = require("net");
const pythonServer = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log("Received from Python:", data.toString());
        io.emit("update", data.toString()); // Send data to frontend
    });
});

pythonServer.listen(5000, () => {
    console.log("Python server listening on port 5000");
});

// Start Node.js server
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
