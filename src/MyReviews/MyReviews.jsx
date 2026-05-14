import SimpleMap from "../MapComponent/SimpleMap";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./MyReviews.css";

export default function MyReviews({ activities }) {
  const [activityTypes, setActivityTypes] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const storedUser = localStorage.getItem("username");

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "All";
  });

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
      return activity.reviews.some((review) => review.user_name === storedUser);
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

  // Flatten reviews written by the current user so multiple reviews
  // on the same activity are shown separately.
  const userReviews = filteredActivities.flatMap((activity) =>
    (activity.reviews || [])
      .filter((r) => r.user_name === storedUser)
      .map((r, idx) => ({
        review: r,
        activity,
        key: r.id || `${activity.id}-${idx}`,
      })),
  );

  return (
    <>
      <div className="explore-container">
        <div className="platform-container">
          <header className="filter-section">
            <h3 className="section-title">My Reviews</h3>

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
            {userReviews.map(({ review, activity, key }, idx) => {
              const userRating = review ? review.rating : 0;

              return (
                <div key={key} className="activity-card">
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
                    <div>
                      <strong>User:</strong> {review.user_name}
                    </div>

                    <div className="rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          className="star"
                          key={i}
                          style={{
                            color: i < userRating ? "#f1c40f" : "#444",
                          }}
                        >
                          {i < userRating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <div className="review-scroll-container">
                      <div className="review-text">
                        {review ? review.comment : "No review text"}
                      </div>
                    </div>

                    <div className="card-actions">
                      <Link
                        to={`/details/${activity.id}`}
                        className="btn btn-details"
                      >
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
