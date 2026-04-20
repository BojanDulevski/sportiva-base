import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Креирање на сопствена неонска икона преку CSS
const neonIcon = L.divIcon({
  className: "custom-neon-icon",
  html: `<div class="neon-wrapper">
           <div class="neon-dot"></div>
           <div class="neon-pulse"></div>
         </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const ModernMap = ({ costumStyle }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/activities/")
      .then((response) => response.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDirections = (activity) => {
    const query = encodeURIComponent(
      ` ${activity.google_maps_address || ""}`,
    );
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

    window.open(googleMapsUrl, "_blank"); // Го отвора Google Maps во нов таб
  };

  const prilepCenter = [41.3461, 21.554];
  return (
    <div className="map-wrapper">
      <MapContainer
        center={prilepCenter}
        zoom={13}
        zoomControl={false}
        attributionControl={false}
        style={{
          height: "350px",
          width: "350px",
          borderRadius: "15px",
          ...costumStyle,
        }}
      >
        {/* Модерен Dark Tile Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
        />

        {activities.map((activity) => (
          <Marker
            key={activity.id}
            position={JSON.parse(activity.location)}
            icon={neonIcon}
          >
            <Popup className="cyber-popup">
              {activity.name}
              <div className="popup-buttons">
                <button className="popup-btn">Show Details</button>
                <button className="popup-btn" onClick={() => handleDirections(activity)}>
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* CSS Стилизација за неонскиот ефект */}
      <style>
        {`
        .header_map {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .map-wrapper { 
          border: 1px solid rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          border-radius: 15px;
          overflow: hidden;
        }
        .header_map .map-wrapper:hover {
            transform: scale(1.2);
            transition: transform 0.6s ease;

        }
        .explore-map-container .map-wrapper {
            height: 100vh;
        }
       
        

        .neon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .neon-dot {
          width: 10px;
          height: 10px;
          background: #00f3ff;
          border-radius: 50%;
          box-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff;
          z-index: 2;
        }

        .neon-pulse {
          position: absolute;
          width: 25px;
          height: 25px;
          background: rgba(0, 243, 255, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* Стилизирање на Popup-от */
        .cyber-popup .leaflet-popup-content-wrapper {
          background: rgba(20, 20, 20, 0.9);
          color: #00f3ff;
          border: 1px solid #00f3ff;
          font-family: 'Inter', sans-serif;
          backdrop-filter: blur(5px);
        }
        
        .cyber-popup .leaflet-popup-tip {
          background: #00f3ff;
        }
        .popup-buttons {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }
        .popup-btn {
        background: rgba(20, 20, 20, 0.9);
          color: #00f3ff;
          border: 1px solid #00f3ff;
          font-family: 'Inter', sans-serif;
          backdrop-filter: blur(5px);
          border-radius: 5px;
            padding: 2px 4px;
        }
                 
      `}
      </style>
    </div>
  );
};

export default ModernMap;
