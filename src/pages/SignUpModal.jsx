import React, { useState } from 'react';
import { X, Edit3 } from 'lucide-react';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// 🔹 Helper function to get user location
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation not supported"));
    }
  });
};

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin, onAuthSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateAccount = async () => {
    if (!firstName || !email || !password || !city || !state) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // ✅ Ask for location
      let location = { lat: null, lng: null };
      try {
        location = await getUserLocation();
      } catch (locError) {
        console.warn("Could not get user location:", locError);
        // Continue without location if user denies permission
      }

      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save user basic details in "users" collection
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        email,
        city,
        state,
        lat: location.lat,
        lng: location.lng,
        isBusiness: null, // Will be set when they choose business/buyer
        userType: null,   // Will be set when they choose business/buyer
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log("Account created:", user);
      alert(`Welcome ${firstName}! Account created successfully`);
      
      // ✅ Call the success handler to show business profile modal
      onAuthSuccess();
      
    } catch (error) {
      console.error("Error creating account:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <h2 className="text-white text-xl font-semibold">Sign Up</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        <div className="px-6 pb-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-2 border-2 border-gray-800">
                <Edit3 size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter your first name"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter your city"
                disabled={loading}
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter your state"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Already have account */}
          <div className="text-center mt-8 mb-6">
            <span className="text-gray-400">Already have an account? </span>
            <button 
              onClick={onSwitchToLogin}
              disabled={loading}
              className="text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50"
            >
              Log In
            </button>
          </div>

          {/* Create Account Button */}
          <button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;