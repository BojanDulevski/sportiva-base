import SimpleMap from "../MapComponent/SimpleMap";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./MyReservations.css";

export default function MyReservations({ activities, reservations }) {
  const [activityTypes, setActivityTypes] = useState([]);
  const [sortOption, setSortOption] = useState("");
    const storedUser = localStorage.getItem("username");


  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "All";
  });
  reservations = (reservations || []).filter((r) => r.user_name === storedUser);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    navigate(`?category=${category}`);
  };
  const handleSortChange = (sortOption) => {
    setSortOption(sortOption);
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "All";
    setSelectedCategory(cat);
    setActivityTypes(cat);
  }, [location.search]);

  const filteredActivities = (activities || [])
    .filter((activity) => {
      if (!activity) return false;
      if (selectedCategory === "All") return true;
      return activity.activity_type === selectedCategory;
    })
    .filter((activity) => {
      return (activity.slots || []).some((slot) => (reservations || []).some((res) => res.timeslot === slot.id));
    })
    .sort((a, b) => {
      if (sortOption === "top_rated") {
        return b.average_rating - a.average_rating;
      }

      if (sortOption === "most_reviewed") {
        return b.reviews_count - a.reviews_count;
      }

      return 0;
    });
  
  // Build list of reservations (for the current user) mapped to their activity and slot
  const userReservations = (reservations || []).flatMap((res, idx) => {
    const activity = filteredActivities.find((a) => (a.slots || []).some((s) => s.id === res.timeslot));
    if (!activity) return [];
    const slot = (activity.slots || []).find((s) => s.id === res.timeslot) || null;
    const key = res.id || `${activity.id}-${res.timeslot}-${idx}`;
    return { reservation: res, activity, slot, key };
  });

  const formatSlotRange = (slot) => {
    if (!slot || !slot.start_time || !slot.end_time) return slot?.id ? String(slot.id) : "";
    const s = new Date(slot.start_time);
    const e = new Date(slot.end_time);
    if (isNaN(s) || isNaN(e)) return `${slot.start_time} - ${slot.end_time}`;
    const timeOpts = { hour: '2-digit', minute: '2-digit' };
    if (s.toDateString() === e.toDateString()) {
      return `${s.toLocaleDateString()} ${s.toLocaleTimeString([], timeOpts)} - ${e.toLocaleTimeString([], timeOpts)}`;
    }
    return `${s.toLocaleString()} - ${e.toLocaleString()}`;
  };

  return (
    <>
      <div className="explore-container">
        <div className="platform-container">
          <header className="filter-section">
            <h3 className="section-title">My Reservations</h3>

            <div className="filter-bar">
              <button
                className={`filter-chip set ${selectedCategory === "All" ? "active" : ""}`}
                onClick={() => handleCategoryChange("All")}
              >
                All
              </button>
              <button
                className={`filter-chip ${selectedCategory === "gym" ? "active" : ""}`}
                onClick={() => handleCategoryChange("gym")}
              >
                Gyms
              </button>
              <button
                className={`filter-chip ${selectedCategory === "boxing" ? "active" : ""}`}
                onClick={() => handleCategoryChange("boxing")}
              >
                Boxing
              </button>
              <button
                className={`filter-chip ${selectedCategory === "sports_hall" ? "active" : ""}`}
                onClick={() => handleCategoryChange("sports_hall")}
              >
                Sports Halls
              </button>
            </div>
            <div className="sort-box">
              <span className="sort-label">Sort By</span>
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                <option value="">Select</option>
                <option value="top_rated">Top Rated</option>
                <option value="most_reviewed">Most Reviewed</option>
              </select>
            </div>
          </header>

          <div className="activities-grid-my-reviews">
            {userReservations.map(({ reservation, activity, slot, key }, idx) => {
              return (
                <div key={key} className="activity-card">
                  <div className="card-image">
                    <img src={activity.image} alt={activity.name} />
                  </div>
                  <div className="card-content">
                    <div className="info-top">
                      <span className="category-tag">{activity.activity_type}</span>
                      <h4 className="location-name">{activity.name}</h4>
                    </div>

                    <div className="reservation-info">
                      <div><strong>User:</strong> {reservation.user_name}</div>
                      <div><strong>Timeslot:</strong> {reservation.timeslot}</div>
                      <div><strong>Reserved at:</strong> {reservation.reserved_at ? new Date(reservation.reserved_at).toLocaleString() : "-"}</div>
                      <div><strong>Status:</strong> {reservation.status}</div>
                      {slot && (slot.start_time || slot.end_time) && (
                        <div>
                          <strong>Slot:</strong> {formatSlotRange(slot)}
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <Link to={`/details/${activity.id}`} className="btn btn-details">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="explore-map-container"></div>
        <SimpleMap
          activities={filteredActivities}
          costumStyle={{ height: "100%", width: "500px", borderRadius: "15px" }}
          activityType={activityTypes}
        />
      </div>
    </>
  );
}
