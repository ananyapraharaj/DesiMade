import React, { useState } from 'react';
import { X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    
    setLoading(true);
    try {
      const { auth, db } = await import('../firebase');
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Logged in:", user);
      
      // ✅ Check if user has already selected business/buyer mode
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      
      if (userData && userData.userType) {
        // User has already chosen their type, go directly to their interface
        console.log(`User is a ${userData.userType}`);
        alert(`Welcome back!`);
        onClose();
        // Navigate based on userType
        if (userData.userType === 'business') {
          // Navigate to business dashboard
        } else {
          // Navigate to customer interface
        }
      } else {
        // User hasn't chosen their type yet, show business profile modal
        alert(`Welcome back!`);
        onAuthSuccess();
      }
      
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
      <div className="bg-gray-800 rounded-t-3xl w-full max-w-sm mx-auto pb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <h2 className="text-white text-xl font-semibold">Log In</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
        
        <div className="px-6">
          {/* Form Fields */}
          <div className="space-y-6 mb-8">
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
          </div>
          
          {/* Don't have account */}
          <div className="text-center mb-8">
            <span className="text-gray-400">Don't have an account? </span>
            <button
              onClick={onSwitchToSignUp}
              disabled={loading}
              className="text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
          
          {/* Log In Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;