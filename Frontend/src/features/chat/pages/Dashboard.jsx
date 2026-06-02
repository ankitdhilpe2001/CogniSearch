import { useState, useEffect, useCallback } from "react";

import { useChat } from "../hook/useChat.js";

import Sidebar from "../components/Sidebar.jsx";

import SearchBox from "../components/Searchbar.jsx";

import Footer from "../components/Footer.jsx";

import MessageList from "../components/MessageList.jsx";

const Dashboard = () => {
  const {
    chats,
    initializeSocket,
    handleSendMessage,
    handleNewChat,
    handleGetChats,
    handleSelectChat,
    handleDeleteChat:deleteChatById,
    loading,
    error,
    currentChatId,
  } = useChat();

  const [query, setQuery] = useState("");

  const activeChat = currentChatId ? chats[String(currentChatId)] : null;

  const messages = activeChat?.messages ?? [];

  const hasMessages = messages.length > 0;

  useEffect(() => {
    initializeSocket();
    handleGetChats().catch(() => {
      // Error is already stored in Redux
    });
  }, []);

  /*
    useCallback memoizes the function.

    Without useCallback:
    - A new handleSubmit function is created
      on every Dashboard re-render.

    With useCallback:
    - React stores the same function reference
      until dependencies change.

    Useful because this function is passed
    to child components.
  */
  const handleSubmit = useCallback(async () => {
    const submittedQuery = query.trim();
    if (!submittedQuery || loading) return;

    setQuery("");

    try {
      await handleSendMessage({
        message: submittedQuery,
        chatId: currentChatId,
      });

    } catch {
      setQuery(submittedQuery);
      // Error already handled in Redux
    }
  }, [query, loading, currentChatId, handleSendMessage]);

  /*
    Memoized new chat handler.

    This prevents Sidebar from receiving
    a new function reference every render.
  */
  const handleNewThread = useCallback(() => {
    setQuery("");
    handleNewChat();
  }, [handleNewChat]);

  /*
    Memoized chat selection handler.

    Function only changes if handleSelectChat changes.
  */
  const handleChatSelect = useCallback(
    (chatId) => {
      setQuery("");

      handleSelectChat(chatId).catch(() => {
        // Error already handled in Redux
      });
    },
    [handleSelectChat],
  );


  const handleDeleteChat = useCallback((chatId)=>{
    deleteChatById({chatId}).catch(()=>{
      //error handled in redux
    });
  },[deleteChatById]);

  return (
    <main className="w-full h-screen flex bg-background">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        /*
          Passing memoized functions
          instead of inline arrow functions.
        */
        onNewThread={handleNewThread}
        onSelectChat={handleChatSelect}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {!hasMessages && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "400px",
              background:
                "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)",
            }}
          />
        )}

        {hasMessages ? (
          <div className="flex-1 overflow-y-auto px-6 py-8">
            {activeChat?.title && (
              <h2 className="mb-6 text-center text-sm font-medium text-secondary">
                {activeChat.title}
              </h2>
            )}

            <MessageList messages={messages} loading={loading} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-2">
            <h1 className="text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-center leading-tight text-foreground">
              CogniSearch
            </h1>
            <p className="text-accent">Where Knowledge Begins!</p>
          </div>
        )}

        <div
          className={`px-6 ${
            hasMessages ? "pb-4 pt-2" : "pb-10"
          } flex flex-col items-center gap-4`}
        >
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 max-w-[720px] w-full">
              {error}
            </p>
          )}

          <SearchBox
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        <Footer />
      </div>
    </main>
  );
};

export default Dashboard;
