import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SimpleMap from "../../MapComponent/SimpleMap";

export default function HeaderHome() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/activities/")
      .then((response) => response.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error(err));

    fetch("http://127.0.0.1:8000/api/users/")
      .then((response) => response.json())
      .then((data) => setUsers(data.length))
      .catch((err) => console.error(err));
  }, []);

  return (
    <header class="header">
      <div className="header-left">
        <h1>
          Hey there! If you're on the hunt for the best fitness activities in
          Prilep, look no further. You've officially found your new home for
          health!
        </h1>
        <div class="search-container">
          <div class="search-box">
            <input
              type="text"
              class="search-input"
              placeholder="Search for gyms, boxing clubs and sports centres..."
            />
            <button class="search-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <div class="stats-compact-container">
            <div class="stat-card wide">
              <div class="card-inner">
                <span class="stat-number">{activities.length}</span>
                <span class="stat-label">Active Fitness Opportunities</span>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="card-inner">
                  <span class="stat-number">{activities.filter((a) => a.activity_type === "gym").length}</span>
                  <span class="stat-label">Gyms</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="card-inner">
                  <span class="stat-number">{activities.filter((a) => a.activity_type === "boxing").length}</span>
                  <span class="stat-label">Boxing</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="card-inner">
                  <span class="stat-number">{activities.filter((a) => a.activity_type === "sports_hall").length}</span>
                  <span class="stat-label">Halls</span>
                </div>
              </div>  
              <div class="stat-card highlight">
                <div class="card-inner">
                  <span class="stat-number">{users}</span>
                  <span class="stat-label">Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header_map">
        <SimpleMap activityType="All" />
      </div>
    </header>
  );
}
