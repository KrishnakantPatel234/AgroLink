import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);



  const [user, setUser] = useState(() => ({
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName"),
    image: localStorage.getItem("userImage"),
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser({ id: null, name: "", image: "" });
    navigate("/login");
  };

  const commonLinks = [
    { name: "Home", to: "/" },
    { name: "MarketPlace", to: "/marketplace" },
    { name: "Buyers", to: "/buyers" },
    { name: "Mitra AI", to: "/mitra" },
    { name: "Mandi Rates", to: "/mandi" },
  ];

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

          {/* NOT LOGGED IN */}
          {!user.id && (
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

          {/* LOGGED IN */}
          {user.id && (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setProfileMenu(!profileMenu)}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User"
                    )}&background=16a34a&color=fff&bold=true`
                  }
                  onError={(e) =>
                    (e.target.src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || "User"
                      )}&background=16a34a&color=fff`)
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full border-2 border-green-500 object-cover"
                />

                <span className="font-semibold text-gray-800">
                  {user.name || "Profile"}
                </span>
              </div>

              {profileMenu && (
                <div className="absolute right-0 mt-3 bg-white w-44 shadow-xl border rounded-xl py-2 z-50">
                  {/* yahan updated My Profile button */}
                  <button
                    onClick={() => {
                      setProfileMenu(false);

                      const roleFromUser = user.role;
                      const roleFromStorage = localStorage.getItem("role");
                      const role = roleFromUser || roleFromStorage;

                      if (role === "farmer") {
                        navigate("/farmer-dashboard");
                      } else if (role === "buyer") {
                        navigate("/buyer-dashboard");
                      } else {
                        navigate("/");
                      }
                    }}
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

          {!user.id && (
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

          {user.id && (
            <>
              <button
                onClick={() => {
                  setOpen(false);

                  const roleFromUser = user.role;
                  const roleFromStorage = localStorage.getItem("role");
                  const role = roleFromUser || roleFromStorage;

                  if (role === "farmer") {
                    navigate("/farmer-dashboard");
                  } else if (role === "buyer") {
                    navigate("/buyer-dashboard");
                  } else {
                    navigate("/"); // fallback
                  }
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
