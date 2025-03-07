require("dotenv").config(); // Load environment variables

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const net = require("net");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Load environment variables
const PORT = process.env.PORT || 3000;
const PYTHON_SERVER_PORT = process.env.PYTHON_SERVER_PORT || 5000;

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
const pythonServer = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log("Received from Python:", data.toString());
        io.emit("update", data.toString()); // Send data to frontend
    });
});

pythonServer.listen(PYTHON_SERVER_PORT, () => {
    console.log(`Python server listening on port ${PYTHON_SERVER_PORT}`);
});

// Start Node.js server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
