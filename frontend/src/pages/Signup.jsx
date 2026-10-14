import React, { useState } from "react";
import {
  ChatNestLogo,
  ZapIcon,
  UsersIcon,
  ShieldIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
} from "../Components/Icons";

function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSignup({ name, email });
  };

  const handleDemoSignup = () => {
    onSignup({
      name: "Alka Bishan",
      email: "alka@exemple.com",
    });
  };

  return (
    <div className="auth-split-wrapper">
      {/* Background ambient lighting */}
      <div className="ambient-blob blob-top-left" />
      <div className="ambient-blob blob-bottom-left" />
      <div className="ambient-blob blob-card-glow" />

      <div className="auth-split-container">
        {/* Left Side: Brand & Feature Highlights */}
        <section className="auth-hero-section">
          <div className="brand-header">
            <ChatNestLogo size={36} />
            <span className="brand-name">ChatNest</span>
          </div>

          <div className="hero-content">
            <h1 className="hero-main-title">
              Better Conversations,
              <br />
              <span className="hero-highlight">Bigger Connections</span>
            </h1>

            <p className="hero-subtext">
              Chat, share, and stay connected with your friends, team and
              community — all in one place.
            </p>

            <div className="hero-features-list">
              <div className="feature-item">
                <div className="feature-icon-box">
                  <ZapIcon size={20} color="#818cf8" />
                </div>
                <div className="feature-text">
                  <h4>Real-time Messaging</h4>
                  <p>Instantly connect, no delays</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-box">
                  <UsersIcon size={20} color="#818cf8" />
                </div>
                <div className="feature-text">
                  <h4>Group Chats</h4>
                  <p>Bring people together</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-box">
                  <ShieldIcon size={20} color="#818cf8" />
                </div>
                <div className="feature-text">
                  <h4>Secure & Private</h4>
                  <p>Your conversations, your privacy</p>
                </div>
              </div>
            </div>

            {/* Handwritten style signature badge */}
            <div className="signature-badge">
              <span className="signature-text">Chat more,</span>
              <span className="signature-text sub">do more</span>
              <svg
                className="signature-underline"
                viewBox="0 0 120 18"
                fill="none"
              >
                <path
                  d="M3 13C30 5 85 4 117 12"
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Right Side: Signup Card */}
        <section className="auth-card-section">
          <div className="auth-glass-card">
            <div className="card-top-icon">
              <ChatNestLogo size={42} />
            </div>

            <div className="card-heading-group">
              <h2 className="card-title">Create Account ✨</h2>
              <p className="card-subtitle">
                Join ChatNest and start collaborating today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-fields">
              <div className="form-field-group">
                <label className="field-label">Full Name</label>
                <div className="input-box-wrapper">
                  <span className="input-icon-left">
                    <UserIcon size={19} color="#64748b" />
                  </span>
                  <input
                    type="text"
                    className="custom-auth-input"
                    placeholder="Alka Bishan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">Email Address</label>
                <div className="input-box-wrapper">
                  <span className="input-icon-left">
                    <MailIcon size={19} color="#64748b" />
                  </span>
                  <input
                    type="email"
                    className="custom-auth-input"
                    placeholder="alka@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">Password</label>
                <div className="input-box-wrapper">
                  <span className="input-icon-left">
                    <LockIcon size={19} color="#64748b" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="custom-auth-input"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} color="#64748b" />
                    ) : (
                      <EyeIcon size={18} color="#64748b" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-workspace-submit">
                <span>Create Account</span>
                <ArrowRightIcon size={18} color="#ffffff" />
              </button>

              <button
                type="button"
                className="demo-pill-btn"
                onClick={handleDemoSignup}
              >
                <ZapIcon size={16} color="#818cf8" />
                <span>Demo Fast Track: 1-Click Register</span>
              </button>
            </form>

            <div className="card-divider-footer">
              <div className="divider-line" />
              <div className="footer-account-text">
                Already have an account?{" "}
                <button
                  type="button"
                  className="switch-auth-link"
                  onClick={onSwitchToLogin}
                >
                  Sign in
                </button>
              </div>
              <div className="divider-line" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Signup;