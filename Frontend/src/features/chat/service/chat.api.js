import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

async function sendMessage({ message, chatId, socketId }) {
  try {
    const response = await api.post("/api/chat/message", {
      message,
      chatId: chatId || undefined,
    }, {
      headers: {
        "x-socket-id": socketId || "", // Pass socket ID to backend
      },
    });

    // API responds immediately with chatId and title
    // The actual message streaming happens via Socket.io
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong while sending message";
    throw new Error(message);
  }
}


async function getChats() {
  try {
    const response = await api.get("/api/chat/");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong while fetching chats";
    throw new Error(message);
  }
}

async function getMessages({ chatId }) {
  try {
    const response = await api.get(`/api/chat/${chatId}/messages`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong while fetching Messages";
    throw new Error(message);
  }
}

async function deleteChat({ chatId }) {
  try {
    const response = await api.delete(`/api/chat/delete/${chatId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong while deleting the chat";
    throw new Error(message);
  }
}

export { sendMessage, getChats, getMessages, deleteChat };
