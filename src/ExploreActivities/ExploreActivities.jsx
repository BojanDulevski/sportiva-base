import "./ExploreActivities.css";
import SimpleMap from "../MapComponent/SimpleMap";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Додаден Link

export default function ExploreActivities() {
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "All";
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    navigate(`?category=${category}`);
  };

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const cat = params.get("category")|| "All";
  setSelectedCategory(cat);
  setActivityTypes(cat); 
}, [location.search]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/activities/")
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredActivities = (activities || []).filter((activity) => {
    if (!activity) return false;
    if (selectedCategory === "All") return true;
    return activity.activity_type === selectedCategory;
  });

  return (
    <>
      <div className="explore-container">
        <div className="platform-container">
          <header className="filter-section">
            <h3 className="section-title">Explore Activities</h3>
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
          </header>

          <div className="activities-grid">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="activity-card">
                <div className="card-image">
                  <img src={activity.image} alt={activity.name} />
                </div>
                <div className="card-content">
                  <div className="info-top">
                    <span className="category-tag">
                      {activity.activity_type}
                    </span>
                    <h4 className="location-name">{activity.name}</h4>
                  </div>
                  <div className="rating">
                    {Array.from(
                      { length: Math.floor(activity.average_rating) },
                      (_, index) => (
                        <span className="star" key={index}>
                          ★
                        </span>
                      ),
                    )}
                    <span className="rating-text">
                      ({activity.average_rating})
                    </span>
                  </div>
                  <div className="card-actions">
                    {/* ПРОМЕНЕТО: Сега води кон рутата за детали со точното ID */}
                    <Link
                      to={`/details/${activity.id}`}
                      className="btn btn-details"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="explore-map-container"></div>
        <SimpleMap
          costumStyle={{ height: "100%", width: "500px", borderRadius: "15px" } } activityType={activityTypes} 
        />
      </div>
    </>
  );
}
