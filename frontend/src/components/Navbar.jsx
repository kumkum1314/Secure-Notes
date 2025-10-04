import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/");
    }, 500);
    return () => clearTimeout(delay);
  }, [search, navigate, user]);

  useEffect(() => {
    setSearch("");
  }, [user]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 text-white/90">
      <div className="bg-indigo-700">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="text-lg">Ledger</span>
          </Link>
          {user && (
            <>
              <div className="flex-1 min-w-[220px] max-w-md w-full order-3 sm:order-none">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="field"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300/90 font-medium truncate max-w-[140px] sm:max-w-none">
                  {user.username}
                </span>
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
