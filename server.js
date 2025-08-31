// to create a web server
const express = require('express')

const app = express()
const http = require('http').createServer(app);

const { Server } = require('socket.io');  //take only the Server proprty from socket.io
const io = new Server(http);

const PORT = process.env.PORT || 3000; // where the server listens 

app.use(express.static('public'));

// a new connection is done
io.on('connection', (socket) => {
    console.log('a user connected');

    // informing other connections when a new user is joined
    socket.on('join', (username) => {
        socket.data.username = username;
        socket.broadcast.emit('user-joined', username);
        console.log(`${username} joined`);

    });
    // message is passed to everyone including the sender. msgObj is an object with the username and the message. time is addded to the message and its send to everyone using io.emit method
    socket.on('chatMessage', (msgObj) => {
        // msgObj={username:'...', message:'...'}
        const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  // to avoid the seconds
        io.emit('chatMessage', { ...msgObj, time: timeStamp })
    });
    // disconnect the socket.
    socket.on('disconnect', () => {
        const username = socket.data.username;
        if (username) {
            socket.broadcast.emit('user-left', username);
            console.log(`${username} disconnected`);
        }
        else {
            console.log('a user disconnected');

        }
    });

});

http.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);

});