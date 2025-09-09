import React, { useState } from 'react';
import { X, Edit3, Upload } from 'lucide-react';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Helper function to get user location
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
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // ✅ Handle image upload + compression to Base64
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxSize = 300; 
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // compress
            setProfileImage(dataUrl);
          };
        };
        reader.readAsDataURL(file);
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const handleCreateAccount = async () => {
    if (!firstName.trim() || !email.trim() || !password || !city.trim() || !state.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      let location = { lat: null, lng: null };
      try {
        location = await getUserLocation();
      } catch (locError) {
        console.warn("Could not get user location:", locError);
      }

      // ✅ Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // ✅ Save to Firestore (profileImage as Base64 string)
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName.trim(),
        email: email.trim(),
        city: city.trim(),
        state: state.trim(),
        lat: location.lat,
        lng: location.lng,
        profileImage: profileImage || null, 
        isBusiness: null,
        userType: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      alert(`Welcome ${firstName}! Account created successfully`);

      setFirstName('');
      setEmail('');
      setPassword('');
      setCity('');
      setState('');
      setProfileImage(null);

      onAuthSuccess();
    } catch (error) {
      console.error("Error creating account:", error.message);
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Try logging in instead.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters long.');
      } else {
        alert(`Error creating account: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <h2 className="text-white text-xl font-semibold">Sign Up</h2>
          <div className="w-6"></div>
        </div>

        <div className="px-6 pb-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleImageUpload}
                disabled={loading}
                className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 rounded-full p-2 border-2 border-gray-800 transition-colors disabled:opacity-50"
              >
                <Edit3 size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          {/* Same as before... */}

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
