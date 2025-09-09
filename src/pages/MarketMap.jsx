import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, MapPin, Store, Calendar } from 'lucide-react';

const MarketMap = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Fake data for shops and fairs
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Initialize map
        if (mapRef.current && !map) {
          const L = window.L;
          
          // Center on Lucknow, India
          const newMap = L.map(mapRef.current).setView([26.8467, 80.9462], 12);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(newMap);

          setMap(newMap);
          
          // Generate fake markers
          generateFakeMarkers(newMap, L);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading map:', error);
        setLoading(false);
      }
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [isOpen]);

  const generateFakeMarkers = (mapInstance, L) => {
    const fakeData = [
      // Local Shops
      {
        id: 1,
        name: "Sharma's Sweets",
        type: 'shop',
        lat: 26.8467,
        lng: 80.9462,
        category: 'Food & Beverages',
        description: 'Traditional Indian sweets and snacks',
        rating: 4.5,
        isOpen: true
      },
      {
        id: 2,
        name: "Handicrafts Corner",
        type: 'shop',
        lat: 26.8567,
        lng: 80.9562,
        category: 'Arts & Crafts',
        description: 'Handmade crafts and traditional items',
        rating: 4.2,
        isOpen: true
      },
              {
        id: 3,
        name: "Organic Vegetable Store",
        type: 'shop',
        lat: 26.8367,
        lng: 80.9362,
        category: 'Fresh Produce',
        description: 'Fresh organic vegetables and fruits',
        rating: 4.8,
        isOpen: true
      },
      {
        id: 4,
        name: "Fashion Boutique",
        type: 'shop',
        lat: 26.8267,
        lng: 80.9262,
        category: 'Clothing',
        description: 'Trendy clothes and accessories',
        rating: 4.0,
        isOpen: false
      },
      // Local Fairs/Markets
      {
        id: 5,
        name: "Weekend Farmers Market",
        type: 'fair',
        lat: 26.8500,
        lng: 80.9400,
        category: 'Farmers Market',
        description: 'Fresh produce, local vendors every weekend',
        rating: 4.7,
        isOpen: true,
        schedule: 'Saturdays & Sundays, 7AM - 2PM'
      },
      {
        id: 6,
        name: "Craft Fair",
        type: 'fair',
        lat: 26.8400,
        lng: 80.9500,
        category: 'Arts & Crafts',
        description: 'Local artisans showcase handmade items',
        rating: 4.3,
        isOpen: false,
        schedule: 'First Sunday of every month'
      },
      {
        id: 7,
        name: "Street Food Festival",
        type: 'fair',
        lat: 26.8600,
        lng: 80.9300,
        category: 'Food Festival',
        description: 'Best street food from around the city',
        rating: 4.9,
        isOpen: true,
        schedule: 'Daily 6PM - 11PM'
      }
    ];

    const shopIcon = L.divIcon({
      html: `<div style="
        background: #10b981; 
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      ">🏪</div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const fairIcon = L.divIcon({
      html: `<div style="
        background: #f59e0b; 
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      ">🎪</div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    // Add markers to map
    fakeData.forEach(item => {
      const icon = item.type === 'shop' ? shopIcon : fairIcon;
      const marker = L.marker([item.lat, item.lng], { icon }).addTo(mapInstance);
      
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
            ${item.name}
          </h3>
          <div style="margin-bottom: 8px;">
            <span style="background: ${item.type === 'shop' ? '#10b981' : '#f59e0b'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
              ${item.type === 'shop' ? '🏪 Shop' : '🎪 Fair'}
            </span>
            <span style="background: ${item.isOpen ? '#16a34a' : '#dc2626'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 4px;">
              ${item.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${item.category}</p>
          <p style="margin: 8px 0; color: #374151; font-size: 13px;">${item.description}</p>
          ${item.schedule ? `<p style="margin: 4px 0; color: #7c3aed; font-size: 12px;"><strong>Schedule:</strong> ${item.schedule}</p>` : ''}
          <div style="margin-top: 8px;">
            <span style="color: #fbbf24; font-size: 14px;">⭐ ${item.rating}</span>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });

    setMarkers(fakeData);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Invalidate map size after toggle
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${
      isFullscreen 
        ? 'bg-gray-900' 
        : 'bg-black bg-opacity-70 flex items-center justify-center p-4'
    }`}>
      <div className={`bg-gray-900 rounded-2xl text-white transition-all duration-300 ${
        isFullscreen 
          ? 'w-full h-full rounded-none' 
          : 'w-full max-w-4xl h-[80vh]'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-semibold">Local Markets & Shops</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-xs">🏪</div>
              <span>Local Shops</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-xs">🎪</div>
              <span>Markets & Fairs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Open</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Closed</span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative flex-1" style={{ height: isFullscreen ? 'calc(100vh - 140px)' : 'calc(80vh - 140px)' }}>
          {loading && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading map...</p>
              </div>
            </div>
          )}
          
          <div 
            ref={mapRef} 
            className="w-full h-full rounded-b-2xl"
            style={{ 
              borderRadius: isFullscreen ? '0' : '0 0 1rem 1rem'
            }}
          />
        </div>

        {/* Bottom Stats */}
        {!loading && (
          <div className="px-4 py-3 bg-gray-800 flex justify-between items-center text-sm border-t border-gray-700" style={{
            borderRadius: isFullscreen ? '0' : '0 0 1rem 1rem'
          }}>
            <div className="flex space-x-6">
              <span className="flex items-center space-x-1">
                <Store size={16} className="text-emerald-500" />
                <span>{markers.filter(m => m.type === 'shop').length} Shops</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar size={16} className="text-yellow-500" />
                <span>{markers.filter(m => m.type === 'fair').length} Markets</span>
              </span>
            </div>
            <div className="text-gray-400">
              Click markers for details
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketMap;
        