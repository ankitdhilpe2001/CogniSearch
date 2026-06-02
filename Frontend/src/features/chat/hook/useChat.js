import { useDispatch, useSelector } from "react-redux";
import { initializeSocket } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
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
            updatedAt: new Date().toISOString(),
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
            messages: data.messages.map(({ role, content }) => ({ role, content })),
          },
        })
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

    const data = await deleteChat({ chatId: id });    //call api to delete chat from backend

    const updatedChats = { ...chats };    //cannot mutate the chats obj directly so 

    delete updatedChats[id];    //deletes the chat from the redux state 
    dispatch(setChats(updatedChats)); //and updates the chats 

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
    handleDeleteChat
  };
};
