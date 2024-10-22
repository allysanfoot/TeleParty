// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Enable CORS for your frontend (adjust origin as needed)
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
}));

// Create the Socket.IO server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Set up a Set to store active rooms
let rooms = new Set();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle room creation
    socket.on('createRoom', (roomId) => {
        if (rooms.has(roomId)) {
            // Notify the user if the room already exists
            socket.emit('roomExists', roomId);
            console.log(`Room ${roomId} already exists`);
        } else {
            // Add the room to the Set and notify the user
            rooms.add(roomId);
            socket.emit('roomCreated', roomId);
            console.log(`Room ${roomId} created`);
        }
    });

    // Handle joining an existing room
    socket.on('joinRoom', (roomId) => {
        // Check if the room exists before joining
        if (rooms.has(roomId)) {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        } else {
            // Notify the user if the room does not exist
            socket.emit('roomError', 'Room does not exist');
            console.log(`User ${socket.id} attempted to join non-existent room ${roomId}`);
        }
    });

    // Handle video synchronization events
    socket.on('syncVideo', ({ roomId, action, currentTime, sender }) => {
        console.log(`Syncing video in room ${roomId}: ${action} at ${currentTime} seconds by ${sender}`);

        // Broadcast the event to all other users in the room (except the sender)
        socket.to(roomId).emit('videoAction', { action, currentTime, sender });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
