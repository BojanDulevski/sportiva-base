import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SimpleMap from "../MapComponent/SimpleMap";
import "./ActivityDetails.css";

const ActivityDetails = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  const BACKEND_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/activities/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        const activityData = Array.isArray(data) ? data[0] : data;
        setActivity(activityData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [id]);

  const nextSlide = () => {
    setCurrentImg((prev) => (prev === activity.gallery.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentImg((prev) => (prev === 0 ? activity.gallery.length - 1 : prev - 1));
  };

  // English translation for loading and error states
  if (loading) return <div className="loader-screen"><span>Loading...</span></div>;
  if (!activity) return <div className="error-screen">Activity not found.</div>;

  return (
    <div className="details-wrapper">
      <div className="container">
        {/* Navigation Bar */}
        <nav className="details-nav">
          <Link to="/explore-activities" className="back-btn">
            <span className="arrow">←</span> Back to Explore
          </Link>
        </nav>

        <div className="details-layout">
          {/* LEFT SIDE - Content */}
          <div className="content-side">
            <div className="hero-info">
              <span className="badge-category">{activity.activity_type}</span>
              <h1 className="main-title">{activity.name}</h1>
              <div className="stats-row">
                <span className="rating">★ {activity.average_rating}</span>
                <span className="divider">|</span>
                <span className="reviews">{activity.reviews_count} Reviews</span>
              </div>
            </div>

            {/* MODERN SLIDER SECTION */}
            <div className="slider-container">
              {activity.gallery && activity.gallery.length > 0 ? (
                <div className="main-slider">
                  <button className="slider-ctrl prev" onClick={prevSlide}>❮</button>
                  <img 
                    src={activity.gallery[currentImg].image} 
                    alt="Gallery" 
                    className="active-slide" 
                  />
                  <button className="slider-ctrl next" onClick={nextSlide}>❯</button>
                  <div className="slide-counter">
                    {currentImg + 1} / {activity.gallery.length}
                  </div>
                </div>
              ) : (
                <div className="no-images">No images available for this location.</div>
              )}
              
              <div className="thumb-bar">
                {activity.gallery?.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`thumb-item ${index === currentImg ? "active" : ""}`}
                    onClick={() => setCurrentImg(index)}
                  >
                    <img src={item.image} alt="thumb" />
                  </div>
                ))}
              </div>
            </div>

            <div className="description-box">
              <h3>About this facility</h3>
              <p>{activity.description}</p>
            </div>
          </div>

          {/* RIGHT SIDE - Map & Booking */}
          <aside className="sticky-side">
            <div className="glass-card map-card">
              <h3>Location</h3>
              <div className="map-container-styled">
                <SimpleMap />
              </div>
              <div className="address-info">
                <span className="icon">📍</span>
                <p>{activity.location}</p>
              </div>
            </div>

            <div className="glass-card slots-card">
              <h3>Available Slots</h3>
              <div className="slots-wrapper">
                {activity.slots && activity.slots.length > 0 ? (
                  activity.slots.map((slot) => (
                    <div key={slot.id} className="slot-row">
                      <div className="time-tag">
                        {new Date(slot.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <button className="book-action-btn">Book Now</button>
                    </div>
                  ))
                ) : (
                  <p className="no-slots">No slots currently available.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;