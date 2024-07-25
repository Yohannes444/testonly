const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const PORT = process.env.PORT || 4001;

const app = express();
app.use(express.static('public'));
app.use(cors()); // Add CORS support

const server = http.createServer(app);
const io = socketIo(server);

const deviceLocations = {}; // Store locations of devices

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle new location data from a device
  socket.on('sendLocation', (data) => {
    console.log('Received location from', socket.id, ':', data);

    // Log the latitude and longitude
    console.log('Latitude:', data.latitude);
    console.log('Longitude:', data.longitude);

    // Store/update the location for the specific device
    deviceLocations[socket.id] = data;

    // Broadcast updated location data to all clients
    io.emit('updateLocations', deviceLocations);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Remove the device's location data on disconnect
    delete deviceLocations[socket.id];

    // Broadcast updated location data to all clients
    io.emit('updateLocations', deviceLocations);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
