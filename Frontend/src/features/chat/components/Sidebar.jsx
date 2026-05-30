// ── Nav Item ───────────────────────────────────────────────────────────────

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

// ── Primary nav config ─────────────────────────────────────────────────────

const PRIMARY_NAV = [
  { id: "home",     label: "Home",     icon: <i className="ri-home-line text-[18px]" aria-hidden="true" /> },
  { id: "discover", label: "Discover", icon: <i className="ri-compass-discover-line text-[18px]" aria-hidden="true" /> },
  { id: "library",  label: "Library",  icon: <i className="ri-book-2-line text-[18px]" aria-hidden="true" /> },
  { id: "profile",  label: "Profile",  icon: <i className="ri-user-line text-[18px]" aria-hidden="true" /> },
];

const BOTTOM_NAV = [
  { id: "help",     label: "Help",     icon: <i className="ri-question-line text-[18px]" aria-hidden="true" /> },
  { id: "settings", label: "Settings", icon: <i className="ri-settings-3-line text-[18px]" aria-hidden="true" /> },
];

// ── Sidebar ────────────────────────────────────────────────────────────────
// Props:
//   activeNav    — string, currently active nav id (controlled from parent)
//   setActiveNav — setter to update active nav from parent
//   onNewThread  — optional callback fired when "+ New Thread" is clicked

const Sidebar = ({ activeNav, setActiveNav, onNewThread }) => {
  return (
    <aside className="w-[260px] min-w-[260px] h-screen bg-surface-lowest border-r border-outline flex flex-col px-4 py-6 gap-2">

      {/* Brand */}
      <div className="px-2 pb-5">
        <p className="text-[18px] font-bold tracking-tight text-foreground">
          CogniSearch
        </p>
        <p className="text-[11px] text-muted mt-0.5 tracking-wide">
          Next-gen Intelligence
        </p>
      </div>

      {/* New Thread Button */}
      <button
        onClick={onNewThread}
        className="
          flex items-center gap-2 w-full mb-4
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

      {/* Primary Nav */}
      {PRIMARY_NAV.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={activeNav === item.id}
          onClick={() => setActiveNav(item.id)}
        />
      ))}

      {/* Spacer pushes bottom nav down */}
      <div className="flex-1" />

      {/* Bottom Nav */}
      {BOTTOM_NAV.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={activeNav === item.id}
          onClick={() => setActiveNav(item.id)}
        />
      ))}

    </aside>
  );
};

export default Sidebar;