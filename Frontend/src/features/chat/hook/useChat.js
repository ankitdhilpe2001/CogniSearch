import { useDispatch, useSelector } from "react-redux";
import { initializeSocket } from "../service/chat.socket";
import { sendMessage } from "../service/chat.api";
import { setLoading, setChats, setCurrentChatId, setError } from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();
  const { chats, currentChatId, loading, error } = useSelector((state) => state.chat);

  async function handleSendMessage({ message, chatId }) {
    const activeChatId = chatId ?? currentChatId ?? undefined;
    
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await sendMessage({ message, chatId: activeChatId });
      const id = String(data.chatId);
      const priorChat = activeChatId ? chats[String(activeChatId)] : null;

      //chats is object 
      dispatch(
        setChats({
          ...chats,[id]: 
          {chatId: id,
            title: data.title ??
            priorChat?.title ?? "New Chat",
            messages: [
              ...(priorChat?.messages ?? []),
              { role: "user", content: message },
              { role: "assistant", content: data.aimessage },
            ],
          },
        })
      );
      dispatch(setCurrentChatId(id));

      return data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
    dispatch(setError(null));
  }

  return {
    chats,
    currentChatId,
    loading,
    error,
    initializeSocket,
    handleSendMessage,
    handleNewChat,
  };
};
