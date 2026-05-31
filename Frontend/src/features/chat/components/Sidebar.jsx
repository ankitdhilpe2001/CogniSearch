const ChatItem = ({ title, active = false, onClick }) => (
  <button
    onClick={onClick}
    title={title}
    className={`
      flex items-center gap-3 w-full px-3 py-[10px] rounded-lg
      text-sm font-medium transition-all duration-150 border-none text-left
      ${active
        ? "bg-surface text-foreground"
        : "bg-transparent text-secondary hover:bg-surface hover:text-foreground"
      }
    `}
  >
    <i className="ri-chat-3-line text-[18px] shrink-0" aria-hidden="true" />
    <span className="truncate">{title}</span>
  </button>
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

const BOTTOM_NAV = [
  { id: "help", label: "Help", icon: <i className="ri-question-line text-[18px]" aria-hidden="true" /> },
  { id: "settings", label: "Settings", icon: <i className="ri-settings-3-line text-[18px]" aria-hidden="true" /> },
];

const Sidebar = ({ chats, currentChatId, onNewThread, onSelectChat }) => {
  const chatList = Object.values(chats).sort(
    (a, b) => new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0)
  );

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

      <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
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
              />
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-outline">
        {BOTTOM_NAV.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => {}}
          />
        ))}
      </div>

    </aside>
  );
};

export default Sidebar;
