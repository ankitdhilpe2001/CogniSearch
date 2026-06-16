import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initializeSocket, getSocket } from "../service/chat.socket.js";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api.js";
import {
  setLoading,
  setChats,
  setCurrentChatId,
  setError,
} from "../chat.slice";

export const useStreamChat = () => {
  const dispatch = useDispatch();
  const { chats, currentChatId, loading, error } = useSelector(
    (state) => state.chat,
  );

  // Initialize Socket.io on mount meaning try connecting the socket(client) to server(io).
  useEffect(() => {
    initializeSocket();
  }, []);

  async function handleSendMessage({ message, chatId }) {
    const activeChatId = chatId ?? currentChatId ?? undefined;
    const optimisticChatId = activeChatId
      ? String(activeChatId)
      : `temp-${Date.now()}`;
    const priorChat = activeChatId ? chats[String(activeChatId)] : null;
    const previousChats = chats;
    const previousCurrentChatId = currentChatId;

    // Add user message optimistically
    const optimisticMessages = [
      ...(priorChat?.messages ?? []),
      { role: "user", content: message },
    ];

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Set user message in Redux state
      dispatch(
        setChats({
          ...chats,
          [optimisticChatId]: {
            chatId: optimisticChatId,
            title: priorChat?.title ?? "New Chat",
            updatedAt: new Date().toISOString(),
            messages: optimisticMessages,
          },
        }),
      );
      dispatch(setCurrentChatId(optimisticChatId));

      const socket = getSocket();

      // Set up socket listeners BEFORE calling the API
      // (the backend emits stream events during the API call)
      const streamPromise = new Promise((resolve, reject) => {
        let fullResponse = "";
        const id = String(activeChatId) || optimisticChatId;

        // Handle each chunk
        const handleChunk = (data) => {
          fullResponse = data.fullText;

          // Update Redux with streaming text
          dispatch(
            setChats({
              ...chats,
              [id]: {
                chatId: id,
                title: chats[id]?.title ?? priorChat?.title ?? "New Chat",
                updatedAt: new Date().toISOString(),
                messages: [
                  ...optimisticMessages,
                  { role: "assistant", content: fullResponse },
                ],
              },
            }),
          );
        };

        // Handle streaming complete
        const handleComplete = (data) => {
          cleanup();
          const finalId = String(data.chatId);

          // Update with final response
          dispatch(
            setChats({
              ...chats,
              [finalId]: {
                chatId: finalId,
                title: data.title ?? priorChat?.title ?? "New Chat",
                updatedAt: new Date().toISOString(),
                messages: [
                  ...optimisticMessages,
                  { role: "assistant", content: fullResponse },
                ],
              },
            }),
          );
          dispatch(setCurrentChatId(finalId));
          dispatch(setLoading(false));

          resolve({
            chatId: finalId,
            title: data.title ?? priorChat?.title ?? "New Chat",
            aimessage: fullResponse,
          });
        };

        // Handle streaming error
        const handleError = (data) => {
          cleanup();
          dispatch(setChats(previousChats));
          dispatch(setCurrentChatId(previousCurrentChatId));
          dispatch(setError(data.error));
          dispatch(setLoading(false));
          reject(new Error(data.error));
        };

        // Cleanup function
        let cleanup = () => {
          socket?.off("stream:chunk", handleChunk);
          socket?.off("stream:complete", handleComplete);
          socket?.off("stream:error", handleError);
        };

        // Listen for streaming events BEFORE the API call
        socket?.on("stream:chunk", handleChunk);
        socket?.on("stream:complete", handleComplete);
        socket?.on("stream:error", handleError);

        // Set a timeout in case streaming gets stuck
        const timeout = setTimeout(() => {
          cleanup();
          dispatch(setError("Streaming timeout"));
          dispatch(setLoading(false));
          reject(new Error("Streaming timeout"));
        }, 120000); // 2 minutes

        // Clear timeout when complete or error
        const originalCleanup = cleanup;
        cleanup = () => {
          clearTimeout(timeout);
          originalCleanup();
        };
      });

      // NOW call the API (streaming events will be caught by listeners above)
      await sendMessage({
        message,
        chatId: activeChatId,
        socketId: socket?.id,
      });

      // Wait for streaming to complete
      return await streamPromise;
    } catch (err) {
      dispatch(setChats(previousChats));
      dispatch(setCurrentChatId(previousCurrentChatId));
      dispatch(setError(err.message));
      dispatch(setLoading(false));
      throw err;
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
    dispatch(setError(null));
  }

  async function handleGetChats() {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await getChats();

      const chatsObject = data.chats.reduce((acc, chat) => {
        const id = String(chat._id);
        acc[id] = {
          chatId: id,
          title: chat.title ?? chats[id]?.title ?? "New Chat",
          updatedAt: chat.updatedAt ?? chats[id]?.updatedAt,
          messages: chats[id]?.messages ?? [],
        };
        return acc;
      }, {});

      dispatch(setChats(chatsObject));
      return data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleSelectChat(chatId) {
    const id = String(chatId);
    dispatch(setCurrentChatId(id));
    dispatch(setError(null));

    if (chats[id]?.messages?.length > 0) return;

    try {
      dispatch(setLoading(true));
      const data = await getMessages({ chatId: id });

      dispatch(
        setChats({
          ...chats,
          [id]: {
            ...chats[id],
            chatId: id,
            title: chats[id]?.title ?? "New Chat",
            messages: data.messages.map(({ role, content }) => ({
              role,
              content,
            })),
          },
        }),
      );
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleDeleteChat({ chatId }) {
    const id = String(chatId);

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await deleteChat({ chatId: id });

      const updatedChats = { ...chats };
      delete updatedChats[id];
      dispatch(setChats(updatedChats));

      if (String(currentChatId) === id) {
        dispatch(setCurrentChatId(null));
      }

      return data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    chats,
    currentChatId,
    loading,
    error,
    initializeSocket,
    handleSendMessage,
    handleNewChat,
    handleGetChats,
    handleSelectChat,
    handleDeleteChat,
  };
};
