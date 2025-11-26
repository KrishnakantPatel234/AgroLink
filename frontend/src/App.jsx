import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import Home from "./pages/Home";
import MitraAI from "./pages/MitraAI";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/MarketPlace";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mitra" element={<MitraAI />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/marketplace" element={<Marketplace />} />
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route element={<RequireRole role="buyer" />}>
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          </Route>

          <Route element={<RequireRole role="farmer" />}>
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          </Route>
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
