import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hook/useAuth.js";

const ChatItem = ({ title, active = false, onClick, onDelete }) => (
  <div
    className={`
      group flex items-center gap-1 rounded-lg transition-all duration-150
      ${active
        ? "bg-surface text-foreground"
        : "bg-transparent text-secondary hover:bg-surface hover:text-foreground"
      }
    `}
  >
    <button
      onClick={onClick}
      title={title}
      className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border-none bg-transparent px-3 py-2.5 text-left text-sm font-medium text-inherit"
    >
      <i className="ri-chat-3-line text-[18px] shrink-0" aria-hidden="true" />
      <span className="truncate">{title}</span>
    </button>

    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onDelete();
      }}
      title="Delete chat"
      className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-none bg-transparent text-muted opacity-0 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
    >
      <i className="ri-delete-bin-6-line text-base" aria-hidden="true" />
    </button>
  </div>
);

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 w-full px-3 py-[10px] rounded-lg
      text-sm font-medium transition-all duration-150 border-none text-left
      ${active
        ? "bg-surface text-foreground"
        : "bg-transparent text-secondary hover:bg-surface hover:text-foreground"
      }
    `}
  >
    {icon}
    {label}
  </button>
);

const Sidebar = ({ chats, currentChatId, onNewThread, onSelectChat, onDeleteChat, onLogout }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const handleLogoutClick = async () => {
    setSettingsOpen(false);
    await handleLogout();
    onLogout?.();
    navigate("/", { replace: true });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chatList = useMemo(() => {
    return Object.values(chats).sort(
      (a, b) => new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0)
    );
  }, [chats]);

  return (
    <aside className="w-[260px] min-w-[260px] h-screen bg-surface-lowest border-r border-outline flex flex-col px-4 py-6 gap-2">

      <div className="px-2 pb-5">
        <p className="text-[18px] font-bold tracking-tight text-foreground">
          CogniSearch
        </p>
        <p className="text-[11px] text-muted mt-0.5 tracking-wide">
          Next-gen Intelligence
        </p>
      </div>

      <button
        onClick={onNewThread}
        className="
          flex items-center gap-2 w-full mb-2
          bg-foreground text-background
          rounded-[10px] px-4 py-[11px]
          text-sm font-semibold
          transition-opacity duration-150 hover:opacity-85
          border-none cursor-pointer
        "
      >
        <i className="ri-add-line text-lg leading-none" aria-hidden="true" />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 -mx-1 px-1">
        <p className="px-2 mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          Recent
        </p>

        {chatList.length === 0 ? (
          <p className="px-2 text-xs text-muted">No chats yet</p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {chatList.map((chat) => (
              <ChatItem
                key={chat.chatId}
                title={chat.title}
                active={String(currentChatId) === String(chat.chatId)}
                onClick={() => onSelectChat(chat.chatId)}
                onDelete={() => onDeleteChat(chat.chatId)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-outline">
        {/* Settings button with dropdown */}
        <div className="relative" ref={settingsRef}>
          {/* Dropdown — renders above the button */}
          {settingsOpen && (
            <div className="absolute bottom-full mb-1 left-0 w-full bg-surface border border-outline rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 border-none text-left bg-transparent text-secondary hover:bg-red-500/10 hover:text-red-400"
              >
                <i className="ri-logout-box-r-line text-[16px]" aria-hidden="true" />
                Logout
              </button>
            </div>
          )}

          <NavItem
            icon={<i className="ri-settings-3-line text-[18px]" aria-hidden="true" />}
            label="Settings"
            active={settingsOpen}
            onClick={() => setSettingsOpen((prev) => !prev)}
          />
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
