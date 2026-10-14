import React, { useState, useEffect } from "react";
import ChatPage from "./pages/chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("chat_app_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [authView, setAuthView] = useState("login"); // 'login' | 'signup'
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("chat_app_user", JSON.stringify(user));
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    localStorage.setItem("chat_app_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("chat_app_user");
    setAuthView("login");
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  if (!currentUser) {
    if (authView === "signup") {
      return (
        <Signup
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthView("login")}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthView("signup")}
      />
    );
  }

  return (
    <div className="app-wrapper">
      <ChatPage
        currentUser={currentUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;