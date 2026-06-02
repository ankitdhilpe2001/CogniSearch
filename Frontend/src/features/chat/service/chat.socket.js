import { io } from "socket.io-client";


//initializes the socket connection to backend. Connect frontend client to real-time backend server.
export const initializeSocket = ()=>{

    //This creates a real-time connection with backend.
    const socket = io("http://localhost:3000",{
        withCredentials:true,
    })

    //As soon as the client is connected 
    socket.on("connect",()=>{
        console.log("Connected to socket.io server")
    })
}
