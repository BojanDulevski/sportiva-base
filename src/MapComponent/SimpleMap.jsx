import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SimpleMap.css";

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

const ModernMap = ({ activities, costumStyle, detailsActivity, activityType }) => {

 
  const handleDirections = (activity) => {
    const query = encodeURIComponent(
      ` ${activity.google_maps_address || ""}`,
    );
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

    window.open(googleMapsUrl, "_blank"); // Го отвора Google Maps во нов таб
  };

  const prilepCenter = [41.3461, 21.554];
  const displayedActivities =
    activityType !== "All"
      ? activities.filter((act) => act.activity_type === activityType)
      : activities;

  return (
    <div className="map-wrapper">
      <MapContainer
        center= {detailsActivity ? JSON.parse(detailsActivity.location) : prilepCenter}
        zoom={detailsActivity ? 15 : 14}
        zoomControl={false}
        attributionControl={false}
        style={{
          height: costumStyle?.height || "350px",
          width: costumStyle?.width || "350px",
          borderRadius: "15px",
          ...costumStyle,
        }}
      >
        {/* Модерен Dark Tile Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
        />
        {detailsActivity ? (
          <Marker
            key={detailsActivity.id}
            position={JSON.parse(detailsActivity.location)}
            icon={neonIcon}
          >
            <Popup className="cyber-popup">
              {detailsActivity.name}
              <div className="popup-buttons">
                <button className="popup-btn" onClick={() => handleDirections(detailsActivity)}>
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ) : (
          displayedActivities.map((activity) => (
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
          ))
        )}

       
      </MapContainer>

      
    </div>
  );
};

export default ModernMap;
