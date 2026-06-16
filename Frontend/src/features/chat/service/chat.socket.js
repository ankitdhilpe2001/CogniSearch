import { io } from "socket.io-client";

//module-level socket instance  
let socket = null;

//getter to always access the current socket instance
export const getSocket = () => socket;

//initializes the socket connection to backend. Connect frontend client to real-time backend server.
export const initializeSocket = () => {
    //avoid creating duplicate connections
    if (socket) return socket;

    //This creates a real-time connection with backend.
    socket = io("http://localhost:3000", {
        withCredentials: true,
    });

    socket.on("connect", () => {
        console.log("Connected to socket.io server");
    });

    return socket;

    //As soon as the client is connected
};

