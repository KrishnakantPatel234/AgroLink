import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
// import FarmersPage from "./pages/FarmersPage";
// import BuyersPage from "./pages/BuyersPage";
import MitraAI from "./pages/MitraAI";
// import MandiPage from "./pages/MandiPage";
// import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Register from "./components/auth/PhoneLogin";
import OTPVerify from "./components/auth/OTPVerify";
import ProfileSetup from "./components/auth/ProfileSetup";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/farmers" element={<FarmersPage />} /> */}
        {/* <Route path="/buyers" element={<BuyersPage />} /> */}
        <Route path="/mitra" element={<MitraAI />} />
        {/* <Route path="/mandi" element={<MandiPage />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/create-post" element={<CreatePost />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTPVerify />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
