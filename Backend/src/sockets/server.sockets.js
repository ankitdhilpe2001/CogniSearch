import {Server} from "socket.io";

export function initSocket(httpServer){
   const io = new Server(httpServer,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    })

    console.log("Socket.io server initialized");

    io.on("connection", (socket)=>{
        console.log("A user is connected: ",socket.id);
    })
}

export function getIO(){
    if(!io){
        throw new Error("Socket.io not initialized")
    }

    return io
}