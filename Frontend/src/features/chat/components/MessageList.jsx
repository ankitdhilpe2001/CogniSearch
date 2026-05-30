import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents = {
  p: ({ children }) => (
    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
  ),
  h1: ({ children }) => (
    <h1 className="mb-3 mt-4 text-xl font-bold first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 text-lg font-semibold first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 text-base font-semibold first:mt-0">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-accent/50 pl-4 text-secondary last:mb-0">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 hover:text-accent-hover"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");

    if (isBlock) {
      return (
        <code className={`${className} font-mono text-[13px] text-foreground`}>
          {children}
        </code>
      );
    }

    return (
      <code className="rounded bg-surface-bright px-1.5 py-0.5 font-mono text-[13px] text-accent">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-xl border border-outline bg-background p-4 last:mb-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-outline bg-surface-bright px-3 py-2 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-outline px-3 py-2">{children}</td>
  ),
  hr: () => <hr className="my-4 border-outline" />,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
};

const MarkdownContent = ({ content }) => (
  <div className="markdown-content text-sm">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  </div>
);

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

        {isUser ? (
          <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
        ) : (
          <MarkdownContent content={content} />
        )}
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
