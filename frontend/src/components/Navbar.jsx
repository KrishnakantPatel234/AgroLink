import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userImage = localStorage.getItem("userImage");

  // Links for everyone
  const commonLinks = [
    { name: "Home", to: "/" },
    { name: "Farmers", to: "/farmers" },
    { name: "Buyers", to: "/buyers" },
    { name: "Mitra AI", to: "/mitra" },
    { name: "Mandi Rates", to: "/mandi" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-b border-green-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold text-green-700 tracking-wide"
        >
          Bharat<span className="text-orange-400">Krishi</span>
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden text-3xl text-green-700"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-lg font-medium">

          {commonLinks.map((lnk) => (
            <Link
              key={lnk.to}
              to={lnk.to}
              className={`pb-1 transition-all ${
                location.pathname === lnk.to
                  ? "border-b-2 border-green-600 text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              {lnk.name}
            </Link>
          ))}

          {/* IF NOT LOGGED IN → Show Login + Signup */}
          {!userId && (
            <>
              <Link
                to="/login"
                className="text-green-700 font-semibold hover:text-green-800"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* IF LOGGED IN → Show Profile Bubble */}
          {userId && (
            <div
              className="relative"
              onMouseLeave={() => setProfileMenu(false)}
            >
              <div
                onClick={() => setProfileMenu(!profileMenu)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={userImage || "https://via.placeholder.com/40"}
                  alt="profile"
                  className="w-10 h-10 rounded-full border-2 border-green-500"
                />
                <span className="font-semibold text-gray-800">
                  {userName || "Profile"}
                </span>
              </div>

              {/* Dropdown */}
              {profileMenu && (
                <div className="absolute right-0 mt-3 bg-white w-40 shadow-xl border rounded-xl py-2">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <ul className="md:hidden bg-white/90 backdrop-blur-xl border-t border-green-200 shadow-xl flex flex-col p-4 space-y-4 text-lg font-medium">

          {commonLinks.map((lnk) => (
            <Link
              key={lnk.to}
              onClick={() => setOpen(false)}
              to={lnk.to}
              className={`${
                location.pathname === lnk.to
                  ? "text-green-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {lnk.name}
            </Link>
          ))}

          {/* NOT LOGGED IN */}
          {!userId && (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-green-700 font-semibold"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="text-green-700 font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* LOGGED IN */}
          {userId && (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/dashboard");
                }}
                className="text-green-800 font-semibold"
              >
                My Profile
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="text-red-600 font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
