import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import SimpleMap from "../../MapComponent/SimpleMap";

export default function HeaderHome({ activities }) {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState(0);

  const username = localStorage.getItem("username");

  const navigateToActivity = () => {
    activities.map((activity) => {
      if (activity.name.toLowerCase().includes(searchValue.toLowerCase())) {
        navigate(`/details/${activity.id}`);
      }
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigateToActivity();
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users/")
      .then((response) => response.json())
      .then((data) => setUsers(data.length))
      .catch((err) => console.error(err));
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="welcome-search">
          <h1>
            Hey {username ? username : "there"}! If you're on the hunt for the
            best fitness activities in Prilep, look no further. You've
            officially found your new home for health!
          </h1>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search for gyms, boxing clubs and sports centres..."
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="search-btn" onClick={() => navigateToActivity()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="search-container">
          <div className="stats-compact-container">
            <div className="stat-card wide">
              <div className="card-inner">
                <span className="stat-number">{activities.length}</span>
                <span className="stat-label">Active Fitness Opportunities</span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="card-inner">
                  <span className="stat-number">
                    {activities.filter((a) => a.activity_type === "gym").length}
                  </span>
                  <span className="stat-label">Gyms</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="card-inner">
                  <span className="stat-number">
                    {
                      activities.filter((a) => a.activity_type === "boxing")
                        .length
                    }
                  </span>
                  <span className="stat-label">Boxing</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="card-inner">
                  <span className="stat-number">
                    {
                      activities.filter(
                        (a) => a.activity_type === "sports_hall",
                      ).length
                    }
                  </span>
                  <span className="stat-label">Halls</span>
                </div>
              </div>
              <div className="stat-card highlight">
                <div className="card-inner">
                  <span className="stat-number">{users}</span>
                  <span className="stat-label">Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
