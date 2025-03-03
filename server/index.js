import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import userRoute from './Routes/userRoute.js';
import chatRoute from './Routes/chatRoute.js'
import messageRoute from './Routes/messageRoute.js'
import {Server} from 'socket.io';


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoute);
app.use("/api/chat",chatRoute)
app.use("/api/messages",messageRoute)

app.get('/', (req, res) => {
    res.send("Welcome to chat app APIs...");
});

// Ensure MongoDB URI exists
if (!process.env.URI) {
    console.error("❌ Error: MongoDB URI is not defined in .env file");
    process.exit(1);
}

const expressServer = app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});

// ✅ Connect to MongoDB BEFORE starting the server
mongoose.connect(process.env.URI)
    .then(() => {
        console.log("✅ Database connected successfully!");
       
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // Stop the server if DB fails to connect
    });


const io = new Server(expressServer,{cors:process.env.CLIENT_URL});
let onlineUser=[]
io.on("connection", (socket) => {
 

  socket.on("addNewUser",(userId)=>{
    !onlineUser.some(user=>user.userId===userId) && 
    onlineUser.push({
        userId,
        socketId:socket.id
    })
    io.emit("getOnlineUsers",onlineUser)

  })

  socket.on("sendMessage",(message)=>{
    const user = onlineUser.find(user=>user.userId===message.recipientId)

    if(user){
        io.to(user.socketId).emit("getMessage",message)
        io.to(user.socketId).emit("getNotification",{
          senderId:message.senderId,
          isRead: false,
          date:new Date()
        })
    }
  })

  socket.on("disconnect",()=>{
   onlineUser= onlineUser.filter((user)=>{
        user.socketId!==socket.id
    })

    io.emit("getOnlineUsers",onlineUser)

  })
  
});
