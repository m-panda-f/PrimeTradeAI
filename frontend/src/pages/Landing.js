import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

const LandingPage = () => {
  const navigate = useNavigate();
  // Initialize theme from local storage or default to 'light'
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Apply theme to body and save to local storage
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // Persist theme setting
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="landing">
      {/* ===== Navbar ===== */}
      <nav className="landing-navbar">
        <h2 className="reg-logo" onClick={() => navigate("/")}>
          PrimeTrade<span className="logo-accent">AI</span> {/* Use a class for the accent color */}
        </h2>

        <div className="nav-right">
          {/* Enhanced Theme Toggle */}
          <div className="theme-toggle">
            <input
              type="checkbox"
              id="theme-switch"
              checked={theme === "dark"}
              onChange={toggleTheme}
              aria-label="Toggle dark mode" // Accessibility improvement
            />
            {/* The label is styled to look like a beautiful switch */}
            <label htmlFor="theme-switch" className="toggle-label"></label> 
          </div>

          <div className="nav-actions">
            <button className="nav-btn nav-signup" onClick={() => navigate("/register")}>
              Sign Up
            </button>
            <button className="nav-btn nav-login" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Hero Section - The main attraction ===== */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="animated-text">
            Welcome to <span className="logo-accent">PrimeTrade AI</span>
          </h1>
          <p className="tagline">
            Revolutionizing Smart Trading with <b>Artificial Intelligence</b>
          </p>

          <button className="get-started" onClick={() => navigate("/register")}>
            Start Your Free Trial →
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 PrimeTrade AI — All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;