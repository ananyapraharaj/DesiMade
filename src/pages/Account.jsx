import React, { useState } from 'react';
import { MapPin, ShoppingCart, Calendar, ShoppingBag, CreditCard, User } from 'lucide-react';

const Account = () => {
  const [darkMode, setDarkMode] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      
      {/* Main Content */}
      <div className="flex flex-col items-center pt-12 px-6">
        
        {/* Profile Image */}
        <div className="w-28 h-28 rounded-full overflow-hidden mb-8">
          <img 
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop&crop=face"
            alt="Wallaby profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-300 mb-12">
          <MapPin size={18} className="mr-2" />
          <span className="text-base">Lucknow, Uttar Pradesh</span>
        </div>

        {/* Sell on Wallaby Card */}
        <div className="w-full max-w-sm bg-emerald-600 rounded-2xl p-6 mb-12 relative">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-xl mb-3">DesiMade</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                You're minutes away from sharing your creations with your community
              </p>
              <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                Create Your Seller Account
              </button>
            </div>
            <div className="ml-4">
              <ShoppingCart className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="w-full max-w-sm mb-16">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium text-lg mb-1">Dark Mode</h4>
              <p className="text-gray-400 text-sm">Use high contrast colours</p>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                darkMode ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Create Account / Log In */}
        <button className="text-emerald-400 hover:text-emerald-300 font-medium text-lg transition-colors">
          Create Account / Log In
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800">
        <div className="max-w-sm mx-auto flex items-center justify-around py-3">
          <button className="flex flex-col items-center py-2 text-gray-400 hover:text-white transition-colors">
            <Calendar size={24} />
            <span className="text-xs mt-1">Markets</span>
          </button>
          
          <button className="flex flex-col items-center py-2 text-gray-400 hover:text-white transition-colors">
            <ShoppingBag size={24} />
            <span className="text-xs mt-1">Shop</span>
          </button>
          
          <button className="flex flex-col items-center py-2 text-gray-400 hover:text-white transition-colors">
            <CreditCard size={24} />
            <span className="text-xs mt-1">Checkout</span>
          </button>
          
          <button className="flex flex-col items-center py-2 text-emerald-400">
            <User size={24} />
            <span className="text-xs mt-1">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;