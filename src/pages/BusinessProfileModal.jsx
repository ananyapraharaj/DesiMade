import React, { useState } from 'react';
import { X, MapPin, Edit } from 'lucide-react';

const BusinessProfileModal = ({ isOpen, onClose, onContinue, onBuyerMode }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    aboutBusiness: '',
    location: 'Port Macquarie, New South Wales, Australia'
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type === 'profile') {
            setProfileImage(e.target.result);
          } else {
            setCoverImage(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleContinue = () => {
    if (!formData.businessName.trim()) {
      alert('Please enter your business name');
      return;
    }
    onContinue(formData, profileImage, coverImage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md mx-auto text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-semibold">Your Business Profile</h2>
          <div className="w-6"></div>
        </div>

        <div className="p-6 space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your business name"
              required
            />
          </div>

          {/* About Business */}
          <div>
            <label className="block text-sm font-medium mb-2">About Your Business</label>
            <textarea
              name="aboutBusiness"
              value={formData.aboutBusiness}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Tell us about your business..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your business location"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Profile Image</label>
              <div className="relative">
                <div 
                  className="w-full h-32 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-750 transition-colors overflow-hidden"
                  onClick={() => handleImageUpload('profile')}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-2"></div>
                      <span className="text-xs text-gray-400">Tap to add</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleImageUpload('profile')}
                  className="absolute bottom-2 right-2 bg-emerald-500 hover:bg-emerald-600 rounded-full p-2 transition-colors"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <div className="relative">
                <div 
                  className="w-full h-32 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-750 transition-colors overflow-hidden"
                  onClick={() => handleImageUpload('cover')}
                >
                  {coverImage ? (
                    <img 
                      src={coverImage} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-8 bg-gray-700 rounded mx-auto mb-2"></div>
                      <span className="text-xs text-gray-400">Tap to add</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleImageUpload('cover')}
                  className="absolute bottom-2 right-2 bg-emerald-500 hover:bg-emerald-600 rounded-full p-2 transition-colors"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleContinue}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-4 rounded-2xl transition-colors"
            >
              Continue
            </button>
            
            <button
              onClick={onBuyerMode}
              className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 rounded-2xl transition-colors"
            >
              Here to buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileModal;