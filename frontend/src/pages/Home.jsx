import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  // fetch top 3 farmers
  useEffect(() => {
    fetch("http://localhost:5000/api/farmers/top")
      .then((res) => res.json())
      .then((data) => setFarmers(data.slice(0, 3)))
      .catch(() => {});
    
    fetch("http://localhost:5000/api/buyers/top")
      .then((res) => res.json())
      .then((data) => setBuyers(data.slice(0, 3)))
      .catch(() => {});
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
            to="/farmers"
            className="bg-white text-green-700 px-6 py-3 font-bold rounded-xl shadow-md hover:bg-green-100 transition"
          >
            Explore Farmers
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
        <h2 className="text-4xl font-bold text-green-700 mb-12">What You Can Do</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">👨‍🌾 Farmers</h3>
            <p className="text-gray-600">Post your crops, talk via voice messages & get top buyers.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">🛒 Buyers</h3>
            <p className="text-gray-600">Discover verified farmers & negotiate efficiently.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">🤖 Mitra AI</h3>
            <p className="text-gray-600">Get crop diagnosis, weather predictions & price insights.</p>
          </div>
        </div>
      </section>

      {/* TOP FARMERS */}
      <section className="py-10 px-6 bg-green-50">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Top Rated Farmers</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {farmers.length > 0 ? farmers.map((f) => (
            <div key={f._id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition">
              <img
                src={`http://localhost:5000/${f.profileImage}`}
                className="w-full h-56 object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold mt-3">{f.name}</h3>
              <p className="text-gray-600">Location: {f.location || "Unknown"}</p>
              <span className="text-green-600 font-semibold">
                {f.isOrganic ? "Organic Farmer 🌿" : ""}
              </span>
            </div>
          )) : <p className="text-center text-gray-600 col-span-3">Loading...</p>}
        </div>
      </section>

      {/* TOP BUYERS */}
      <section className="py-10 px-6 bg-white">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Top Rated Buyers</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {buyers.length > 0 ? buyers.map((b) => (
            <div key={b._id} className="bg-green-50 rounded-xl shadow-md p-5 hover:shadow-xl transition">
              <img
                src={`http://localhost:5000/${b.profileImage}`}
                className="w-full h-56 object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold mt-3">{b.name}</h3>
              <p className="text-gray-600">Business: {b.businessType}</p>
              <span className="text-green-600 font-semibold">
                {b.isBulkBuyer ? "Bulk Buyer 🏷️" : ""}
              </span>
            </div>
          )) : <p className="text-center text-gray-600 col-span-3">Loading...</p>}
        </div>
      </section>

      {/* FAKE REVIEWS */}
      <section className="py-16 px-6 bg-green-100">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
          What Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Ramesh Yadav", review: "BharatKrishi helped me sell tomatoes 3x faster!" },
            { name: "Suresh Traders", review: "Found great farmers with organic produce." },
            { name: "Neha Farms", review: "Mitra AI is better than any crop advisor!" },
          ].map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <p className="text-gray-600 italic">“{r.review}”</p>
              <p className="text-lg font-bold mt-3 text-green-700">– {r.name}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
