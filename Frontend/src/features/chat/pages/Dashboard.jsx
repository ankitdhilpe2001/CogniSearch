import { useState, useEffect } from "react";

import { useChat } from "../hook/useChat.js";

import Sidebar from "../components/Sidebar.jsx";

import SearchBox from "../components/Searchbar.jsx";

import Footer from "../components/Footer.jsx";

import MessageList from "../components/MessageList.jsx";

const Dashboard = () => {
  const { chats, initializeSocket, handleSendMessage, handleNewChat, loading, error, currentChatId, } = useChat();

  const [activeNav, setActiveNav] = useState("home");

  const [query, setQuery] = useState("");

  const activeChat = currentChatId ? chats[String(currentChatId)] : null;

  const messages = activeChat?.messages ?? [];

  const hasMessages = messages.length > 0;

  useEffect(() => {
    initializeSocket();
  }, []);

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;
    try {
      await handleSendMessage({ message: query.trim(), chatId: currentChatId })
      setQuery("");
    } catch {
      // error is stored in Redux by useChat
    }
  };

  return (
    <main className="w-full h-screen flex bg-background">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onNewThread={() => {
          setQuery("");

          handleNewChat();
        }}
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
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-8">
            <h1 className="text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-center leading-tight text-foreground">
              Where knowledge begins
            </h1>
          </div>
        )}

        <div
          className={`px-6 ${hasMessages ? "pb-4 pt-2" : "pb-10"} flex flex-col items-center gap-4`}
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
