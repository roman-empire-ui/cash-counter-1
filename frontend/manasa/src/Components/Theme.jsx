import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg transition-all duration-300
                 bg-gray-200 dark:bg-gray-800 
                 text-gray-800 dark:text-gray-200 
                 hover:scale-105 shadow-md"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
