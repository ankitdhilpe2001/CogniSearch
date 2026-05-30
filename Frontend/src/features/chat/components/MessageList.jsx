import { useEffect, useRef } from "react";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? "bg-accent text-foreground"
            : "bg-surface border border-outline text-foreground"
          }
        `}
      >
        {!isUser && (
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
            CogniSearch
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
};

const MessageList = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!messages.length && !loading) return null;

  return (
    <div className="w-full max-w-[720px] mx-auto flex flex-col gap-4">
      {messages.map((msg, index) => (
        <MessageBubble
          key={`${msg.role}-${index}`}
          role={msg.role}
          content={msg.content}
        />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="rounded-2xl border border-outline bg-surface px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
