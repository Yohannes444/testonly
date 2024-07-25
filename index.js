const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const PORT = process.env.PORT || 4001;

const app = express();
app.use(express.static('public'));
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);
app.get('/', function (req, res) {
    res.send("llll")
})
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('sendLocation', (data) => {
    console.log('Received location:', data);
    io.emit('changeLocation', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));