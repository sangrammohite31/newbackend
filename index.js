const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static("public"));

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("message", (data) => {
        console.log("Received from Python:", data);
        io.emit("update", data); // Forward data to frontend
    });

    socket.on("disconnect", () => {
        console.log("A client disconnected");
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
