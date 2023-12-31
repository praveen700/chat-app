const express = require('express');
const app = express();
const connectDb = require('./config/db.js');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middilwares/errorMiddileware.js');
const path = require("path");
require('dotenv').config()

connectDb()

app.use(express.json())


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, '/frontend/build')));
   // Catch-all route for client-side routing
   app.get('*', (req, res) => {
     res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
   });

} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`server started on port ${PORT}`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    },

});

io.on("connection", (socket) => {
    
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        
       var chat = newMessageRecieved.chat;

       if(!chat.users) return console.log('chat users not defined');
       chat.users.forEach((user) => {
        if(user._id === newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
        
       });
    });
    // video call
    socket.emit("me", socket.id)

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded")
    })
  
    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })
  
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
    })

    // disconnect socket
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });


});





// 
