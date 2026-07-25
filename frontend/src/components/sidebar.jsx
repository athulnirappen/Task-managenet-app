import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    console.log("logout button");
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="w-56 shrink-0 min-h-screen border-r  px-4 py-6 flex flex-col">
      <div className="text-sm font-semibold text-black mb-8 px-3">
        Task Management 
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <Link to="/dashboard">
          Dashboard
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="px-3 py-2 text-sm text-red-500 hover:text-[#e5637a] text-left transition-colors"
      >
        Log out
      </button>
    </aside>
  );
};

export default Sidebar;