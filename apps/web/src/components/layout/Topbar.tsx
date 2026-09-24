import {
  Bell,
  ChevronDown,
  Moon,
  Search,
  Store,
  Sun,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

function Topbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} strokeWidth={1.8} />

        <input
          type="search"
          placeholder="Search products, tags, orders..."
        />

        <span className="search-shortcut">
          ⌘ K
        </span>
      </div>

      <div className="topbar-actions">
        <button
          className="icon-button theme-toggle"
          type="button"
          aria-label={
            theme === "light"
              ? "Switch to dark mode"
              : "Switch to light mode"
          }
          title={
            theme === "light"
              ? "Dark mode"
              : "Light mode"
          }
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon size={19} strokeWidth={1.8} />
          ) : (
            <Sun size={19} strokeWidth={1.8} />
          )}
        </button>

        <button
          className="icon-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.8} />
          <span className="notification-dot" />
        </button>

        <div className="store-switcher">
          <div className="store-icon">
            <Store size={16} strokeWidth={1.8} />
          </div>

          <div className="store-switcher-info">
            <span>Store</span>
            <strong>SmartTag Store</strong>
          </div>

          <ChevronDown size={16} strokeWidth={1.8} />
        </div>

        <div className="profile-avatar">
          A
        </div>
      </div>
    </header>
  );
}

export default Topbar;