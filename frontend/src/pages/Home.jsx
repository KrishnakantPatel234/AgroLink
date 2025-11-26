import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const Home = () => {
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopData = async () => {
      try {
        setLoading(true);
        setError("");

        // 🔹 Top farmers
        const resFarmers = await fetch(`${API_BASE}/farmers/top`);
        const dataFarmers = await resFarmers.json();

        if (resFarmers.ok && dataFarmers.success) {
          const list = Array.isArray(dataFarmers.farmers)
            ? dataFarmers.farmers
            : [];
          setFarmers(list.slice(0, 3));
        } else {
          console.error("Farmers error:", dataFarmers.error);
        }

        // 🔹 Top buyers
        const resBuyers = await fetch(`${API_BASE}/buyers/top`);
        const dataBuyers = await resBuyers.json();

        if (resBuyers.ok && dataBuyers.success) {
          const list = Array.isArray(dataBuyers.buyers)
            ? dataBuyers.buyers
            : [];
          setBuyers(list.slice(0, 3));
        } else {
          console.error("Buyers error:", dataBuyers.error);
        }
      } catch (err) {
        console.error("Home top data error:", err);
        setError("Server se data laane me problem aa rahi hai.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopData();
  }, []);

  return (
    <div className="bg-[#f7fff7]">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-green-700 to-green-500 text-white py-20 px-4 text-center shadow-xl rounded-b-3xl">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          Connecting India’s Farmers & Buyers
        </h1>

        <p className="mt-5 text-xl opacity-90 max-w-2xl mx-auto">
          BharatKrishi is your marketplace for crops, voice-based negotiation,
          AI-powered crop guidance, and reliable mandi rates.
        </p>

        <div className="mt-8 flex gap-6 justify-center">
          <Link
            to="/marketplace"
            className="bg-white text-green-700 px-6 py-3 font-bold rounded-xl shadow-md hover:bg-green-100 transition"
          >
            Explore Marketplace
          </Link>

          <Link
            to="/mitra"
            className="bg-green-900 px-6 py-3 font-bold rounded-xl shadow-md hover:bg-green-800 transition"
          >
            Ask Mitra AI
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-green-700 mb-12">
          What You Can Do
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              👨‍🌾 Farmers
            </h3>
            <p className="text-gray-600">
              Post your crops, talk via voice messages & get top buyers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              🛒 Buyers
            </h3>
            <p className="text-gray-600">
              Discover verified farmers & negotiate efficiently.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              🤖 Mitra AI
            </h3>
            <p className="text-gray-600">
              Get crop diagnosis, weather predictions & price insights.
            </p>
          </div>
        </div>
      </section>

      {/* TOP FARMERS */}
      <section className="py-10 px-6 bg-green-50">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Top Rated Farmers
        </h2>

        {loading && !farmers.length && (
          <p className="text-center text-gray-600">Loading farmers...</p>
        )}
        {error && (
          <p className="text-center text-red-600 text-sm mb-4">{error}</p>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {farmers.length > 0 ? (
            farmers.map((f) => (
              <div
                key={f._id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
              >
                <img
                  src={
                    f.profileImage
                      ? `http://localhost:5000/${f.profileImage}`
                      : "https://via.placeholder.com/300x200?text=Farmer"
                  }
                  alt={f.name}
                  className="w-full h-56 object-cover rounded-lg"
                />
                <h3 className="text-xl font-bold mt-3">{f.name}</h3>
                <p className="text-gray-600">
                  Location: {f.location || "Unknown"}
                </p>
                {f.isOrganic && (
                  <span className="text-green-600 font-semibold">
                    Organic Farmer 🌿
                  </span>
                )}
              </div>
            ))
          ) : (
            !loading && (
              <p className="text-center text-gray-600 col-span-3">
                No farmers found.
              </p>
            )
          )}
        </div>
      </section>

      {/* TOP BUYERS */}
      <section className="py-10 px-6 bg-white">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Top Rated Buyers
        </h2>

        {loading && !buyers.length && (
          <p className="text-center text-gray-600">Loading buyers...</p>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {buyers.length > 0 ? (
            buyers.map((b) => (
              <div
                key={b._id}
                className="bg-green-50 rounded-xl shadow-md p-5 hover:shadow-xl transition"
              >
                <img
                  src={
                    b.profileImage
                      ? `http://localhost:5000/${b.profileImage}`
                      : "https://via.placeholder.com/300x200?text=Buyer"
                  }
                  alt={b.name}
                  className="w-full h-56 object-cover rounded-lg"
                />
                <h3 className="text-xl font-bold mt-3">{b.name}</h3>
                <p className="text-gray-600">
                  Business: {b.businessType || "–"}
                </p>
                {b.isBulkBuyer && (
                  <span className="text-green-600 font-semibold">
                    Bulk Buyer 🏷️
                  </span>
                )}
              </div>
            ))
          ) : (
            !loading && (
              <p className="text-center text-gray-600 col-span-3">
                No buyers found.
              </p>
            )
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 px-6 bg-green-100">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
          What Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Ramesh Yadav",
              review: "BharatKrishi helped me sell tomatoes 3x faster!",
            },
            {
              name: "Suresh Traders",
              review: "Found great farmers with organic produce.",
            },
            {
              name: "Neha Farms",
              review: "Mitra AI is better than any crop advisor!",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <p className="text-gray-600 italic">“{r.review}”</p>
              <p className="text-lg font-bold mt-3 text-green-700">
                – {r.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
