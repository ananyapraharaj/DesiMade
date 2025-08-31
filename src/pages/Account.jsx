import { useState } from "react";

export default function Account() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} p-6`}>
      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-2">
        <img
          src="https://placehold.co/100x100" // replace with Firebase storage later
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <p className="bg-gray-700 px-3 py-1 rounded-full text-sm">
          Lucknow, Uttar Pradesh
        </p>
      </div>

      {/* Seller Section */}
      <div className="bg-green-700 text-white rounded-2xl p-4 my-6 flex flex-col items-center space-y-2">
        <h2 className="font-semibold">DesiMade</h2>
        <p className="text-sm text-center">
          You’re minutes away from sharing your creations with your community
        </p>
        <button className="bg-green-500 px-4 py-2 rounded-xl mt-2">
          Create Your Seller Account
        </button>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">
        <span className="text-sm">Dark Mode</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="w-6 h-6"
        />
      </div>

      {/* Auth */}
      <div className="mt-6 text-center text-green-400">
        <button>Create Account / Log In</button>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-gray-800 py-3 text-sm">
        <button>Markets</button>
        <button>Shop</button>
        <button>Checkout</button>
        <button className="text-green-400">Account</button>
      </div>
    </div>
  );
}
