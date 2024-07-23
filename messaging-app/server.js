const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', (room) => {
        if (!rooms[room]) {
            rooms[room] = [];
        }
        rooms[room].push(socket.id);
        socket.join(room);

        if (rooms[room].length === 2) {
            io.to(room).emit('startChat', 'Both users are connected. You can start chatting now.');
        } else {
            socket.emit('waiting', 'Waiting for another user to join.');
        }
    });

    socket.on('message', (data) => {
        io.to(data.room).emit('message', data.message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        for (let room in rooms) {
            rooms[room] = rooms[room].filter(id => id !== socket.id);
            if (rooms[room].length === 0) {
                delete rooms[room];
            }
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
