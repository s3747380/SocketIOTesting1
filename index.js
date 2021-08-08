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
app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

let users = [];

io.on('connection', (socket) => {
    console.log(`Connected, ID: ${socket.id}`);
    users.push({
        socketID: socket.id,
        lat: 0,
        lng: 0
    });
    console.log(users);

    socket.on('user',(data) => {
        console.log(`Data from frontend: ${data}`);

        var obj = JSON.parse(data);

        if (users.length != 0){
            users.forEach( user => {
                if (user.socketID == obj.socketID) {
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

});

io.on("disconnect", () => {
    console.log("Client disconnected"); 
});

http.listen(5000)