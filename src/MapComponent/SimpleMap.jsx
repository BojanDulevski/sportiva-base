import React from "react";
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

const fitnessCenters = [
  { id: 1, name: "Arena Fitness Center", pos: [41.3442, 21.5515] },
  { id: 2, name: "Fitstar Fitness", pos: [41.3465, 21.555] },
  { id: 3, name: "Energy Fitnes", pos: [41.3418, 21.549] },
  { id: 4, name: "Spartan Fitnes", pos: [41.3522, 21.5475] },
  { id: 5, name: "Champion Fitness", pos: [41.348, 21.5532] },
  { id: 6, name: "Elite Gym", pos: [41.3395, 21.5585] },
  { id: 7, name: "FFitness", pos: [41.3458, 21.544] },
];

const ModernMap = ({ costumStyle }) => {
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

        {fitnessCenters.map((loc) => (
          <Marker key={loc.id} position={loc.pos} icon={neonIcon}>
            <Popup className="cyber-popup">
              {loc.name}
              <div className="popup-buttons">
                <button className="popup-btn">Details</button>
                <button className="popup-btn">Get Directions</button>
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
