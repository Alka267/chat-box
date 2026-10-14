import React from "react";
import { ChatNestLogo, SunIcon, MoonIcon, LogOutIcon } from "./Icons";

function Navbar({ currentUser, onLogout, isDarkMode, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="brand-section">
        <ChatNestLogo size={36} />
        <span className="brand-title">ChatNest</span>
        <span className="brand-badge">PRO</span>
      </div>

      <div className="navbar-right">
        <div className="nav-actions">
          <button 
            className="icon-btn" 
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            onClick={onToggleTheme}
          >
            {isDarkMode ? <SunIcon size={19} /> : <MoonIcon size={19} />}
          </button>
        </div>

        <div className="current-user-pill">
          <div className="user-avatar-mini">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            <span className="status-dot-mini"></span>
          </div>
          <span className="user-name-text">{currentUser?.name || "Alka"}</span>
        </div>

        <button className="btn-logout" onClick={onLogout} title="Sign Out">
          <LogOutIcon size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;