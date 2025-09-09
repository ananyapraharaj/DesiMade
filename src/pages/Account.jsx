import React, { useState, useEffect } from 'react';
import { MapPin, ShoppingCart, Calendar, ShoppingBag, CreditCard, User, LogOut } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';
import BusinessProfileModal from './BusinessProfileModal';
import MarketMap from './MarketMap';

const Account = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBusinessProfile, setShowBusinessProfile] = useState(false);
  const [showMarketMap, setShowMarketMap] = useState(false);
  
  // Auth state
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSwitchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  // Handle successful authentication - show business profile modal
  const handleAuthSuccess = () => {
    setShowSignUpModal(false);
    setShowLoginModal(false);
    setShowBusinessProfile(true);
  };

  // Handle business profile completion
  const handleBusinessProfileComplete = async (formData, profileImage, coverImage) => {
    try {
      const { storage } = await import('../firebase');
      const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
      const { doc, updateDoc, setDoc } = await import('firebase/firestore');
      
      if (!user) return;

      // Upload images to Firebase Storage if provided
      let profileImageUrl = null;
      let coverImageUrl = null;

      if (profileImage) {
        const profileImageRef = ref(storage, `businesses/${user.uid}/profile`);
        await uploadString(profileImageRef, profileImage, 'data_url');
        profileImageUrl = await getDownloadURL(profileImageRef);
      }

      if (coverImage) {
        const coverImageRef = ref(storage, `businesses/${user.uid}/cover`);
        await uploadString(coverImageRef, coverImage, 'data_url');
        coverImageUrl = await getDownloadURL(coverImageRef);
      }

      // Update user document to mark as business
      await updateDoc(doc(db, "users", user.uid), {
        isBusiness: true,
        userType: 'business',
        updatedAt: new Date()
      });

      // Create business profile document
      await setDoc(doc(db, "businessProfiles", user.uid), {
        businessName: formData.businessName,
        aboutBusiness: formData.aboutBusiness,
        location: formData.location,
        profileImage: profileImageUrl,
        coverImage: coverImageUrl,
        ownerId: user.uid,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update local state
      setUserData(prev => ({
        ...prev,
        isBusiness: true,
        userType: 'business'
      }));

      console.log("Business profile created successfully");
      setShowBusinessProfile(false);
      alert("Business profile created successfully!");
      
    } catch (error) {
      console.error('Error creating business profile:', error);
      alert('Error creating business profile. Please try again.');
    }
  };

  // Handle buyer mode selection
  const handleBuyerMode = async () => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      
      if (!user) return;

      // Update user document to mark as buyer/customer
      await updateDoc(doc(db, "users", user.uid), {
        isBusiness: false,
        userType: 'customer',
        updatedAt: new Date()
      });

      // Update local state
      setUserData(prev => ({
        ...prev,
        isBusiness: false,
        userType: 'customer'
      }));

      console.log("User set as customer/buyer");
      setShowBusinessProfile(false);
      alert("Welcome! You're all set as a buyer.");
      
    } catch (error) {
      console.error('Error setting buyer mode:', error);
      alert('Error setting buyer mode. Please try again.');
    }
  };

  const handleBusinessProfileClose = () => {
    setShowBusinessProfile(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };

  const handleMarketClick = () => {
    setShowMarketMap(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      
      {/* Main Content */}
      <div className="flex flex-col items-center pt-12 px-6">
        
        {/* Profile Image */}
        <div className="w-28 h-28 rounded-full overflow-hidden mb-8 border-4 border-emerald-500">
          <img 
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop&crop=face"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        {user ? (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {userData?.firstName || 'User'}!
            </h2>
            <p className="text-emerald-400 text-sm mb-2">{user.email}</p>
            {userData?.userType && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-medium">
                {userData.userType === 'business' ? '🏪 Business Owner' : '🛒 Customer'}
              </div>
            )}
          </div>
        ) : null}

        {/* Location */}
        <div className="flex items-center text-gray-300 mb-12">
          <MapPin size={18} className="mr-2" />
          <span className="text-base">
            {userData ? `${userData.city}, ${userData.state}` : 'City, State'}
          </span>
        </div>

        {/* Sell on DesiMade Card - Show only if not logged in or not a business */}
        {(!user || !userData?.isBusiness) && (
          <div className="w-full max-w-sm bg-emerald-600 rounded-2xl p-6 mb-12 relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-xl mb-3">DesiMade</h3>
                <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                  You're minutes away from sharing your creations with your community
                </p>
                <button 
                  onClick={() => user ? setShowBusinessProfile(true) : setShowSignUpModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  {user ? 'Setup Business Profile' : 'Create Your Seller Account'}
                </button>
              </div>
              <div className="ml-4">
                <ShoppingCart className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        )}

        {/* Business Dashboard Card - Show only for business users */}
        {user && userData?.isBusiness && (
          <div className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-12 relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-xl mb-3">Business Dashboard</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Manage your products and track your sales
                </p>
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                  View Dashboard
                </button>
              </div>
              <div className="ml-4">
                <ShoppingBag className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        )}

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

        {/* Account Actions */}
        {user ? (
          <div className="flex flex-col items-center space-y-4">
            <button 
              onClick={handleLogout}
              className="flex items-center text-red-400 hover:text-red-300 font-medium text-lg transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowSignUpModal(true)} 
            className="text-emerald-400 hover:text-emerald-300 font-medium text-lg transition-colors"
          >
            Create Account / Log In
          </button>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800">
        <div className="max-w-sm mx-auto flex items-center justify-around py-3">
          <button 
            onClick={handleMarketClick}
            className="flex flex-col items-center py-2 text-gray-400 hover:text-white transition-colors"
          >
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

      {/* All Modals */}
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)} 
        onSwitchToLogin={handleSwitchToLogin}
        onAuthSuccess={handleAuthSuccess}
      />
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
        onAuthSuccess={handleAuthSuccess}
      />

      <BusinessProfileModal
        isOpen={showBusinessProfile}
        onClose={handleBusinessProfileClose}
        onContinue={handleBusinessProfileComplete}
        onBuyerMode={handleBuyerMode}
      />

      <MarketMap
        isOpen={showMarketMap}
        onClose={() => setShowMarketMap(false)}
      />
    </div>
  );
};

export default Account;