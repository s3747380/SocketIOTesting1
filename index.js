// const express = require("express");
// const socketio = require("socket.io");
// const http = require("http");

// const PORT = 5000;

// const router = require('./router');


// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// app.use(router);

// io.on('connect', (socket) => {
//     console.log("We have a connection");
//     socket.on('join', ({ name, room }, callback) => {
  
//       console.log(name , room);

//     });
  
//     socket.on('disconnect', () => {
      
//         console.log("Disconnected!");
//     });
//   });

// server.listen(PORT,()=> console.log(`Server started on port ${PORT}`))

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http);
const cors = require('cors');

app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

app.use(cors());

let users = [];

io.on('connection', (socket) => {
    console.log(`Connected, ID: ${socket.id}`);
    io.emit('handshake socketID',socket.id);
    users.push({
        socketID: socket.id,
        userId: 0,
        lat: 1.1,
        lng: 1.1,
    });

    socket.on('user',(data) => {
        console.log(`Data from frontend: ${data}`);

        var obj = JSON.parse(data);

        if (users.length != 0){
            users.forEach( user => {
                if (user.socketID == obj.socketID) {
                    user.userId = obj.userId;
                    user.lat = obj.lat;
                    user.lng = obj.lng;
                    console.log("Changed the lat lng value");
                    return 
                 }
            });
        }
        else{
            users.push(obj);
        }
        console.log(`The current array : `);
        users.forEach(user => {
            console.log(user)
        });        
        io.emit("user return",JSON.stringify(users));
    });

    socket.on('sos message', (socketID)=> {
        // io.emit('sos sender');
        console.log(`Client ${socketID} has sent an SOS message`);
        io.emit('sos receiver', socketID);
        });

    socket.on('user dispose', (socketID)=>{
        console.log("event user dispose is triggered");
        io.emit('user close stream');
        if (users.length != 0){
            console.log("condition matches");
            users.forEach(user => {
                console.log(`This user socketID is ${user.socketID}`);
                console.log(`SocketID from the frontend is ${socketID}`);
                if (user.socketID == socketID) {
                    users.pop(user);
                    socket.disconnect();
                    console.log("Destroy the user socket connection!");
                    return
                }
            });
        }
    });

});

io.on("disconnect", () => {
    console.log("Client disconnected"); 
});

http.listen(5000)