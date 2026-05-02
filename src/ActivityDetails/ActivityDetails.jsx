import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SimpleMap from "../MapComponent/SimpleMap";
import "./ActivityDetails.css";

const ActivityDetails = ({ activities }) => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);


  const [selectedDate, setSelectedDate] = useState(new Date());

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const filteredSlots =
    activity?.slots?.filter((slot) => {
      const slotDate = new Date(slot.start_time).toDateString();
      return slotDate === selectedDate.toDateString();
    }) || [];

  useEffect(() => {
    if (activities && activities.length > 0) {
     
      const foundActivity = activities.find((a) => String(a.id) === String(id));

      if (foundActivity) {
        setActivity(foundActivity);
      }
      setLoading(false);
    }
  }, [id, activities]);

  const nextSlide = () => {
    setCurrentImg((prev) =>
      prev === activity.gallery.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentImg((prev) =>
      prev === 0 ? activity.gallery.length - 1 : prev - 1,
    );
  };

  // English translation for loading and error states
  if (loading)
    return (
      <div className="loader-screen">
        <span>Loading...</span>
      </div>
    );
  if (!activity) return <div className="error-screen">Activity not found.</div>;

  return (
    <div className="details-wrapper">
      <div className="details-container">
        {/* Navigation Bar */}
        <nav className="details-nav">
          <Link to="/explore-activities" className="back-btn">
            <span className="arrow">←</span> Back to Explore
          </Link>

          <div className="glass-card slots-card">
            <h3>Available Slots</h3>

            {/* Селектор на денови */}
            <div className="day-selector">
              <button onClick={() => changeDate(-1)} className="arrow-btn">
                ←
              </button>
              <span className="current-date-display">
                {selectedDate.toLocaleDateString("mk-MK", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <button onClick={() => changeDate(1)} className="arrow-btn">
                →
              </button>
            </div>

            {/* Контејнер со ограничено скролање */}
            <div className="slots-scroll-container">
              <div className="slots-wrapper">
                {filteredSlots.length > 0 ? (
                  filteredSlots.map((slot) => (
                    <div key={slot.id} className="slot-row">
                      <div className="time-tag">
                        {new Date(slot.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <button className="book-action-btn">Book Now</button>
                    </div>
                  ))
                ) : (
                  <p className="no-slots">No slots for this day.</p>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="details-layout">
          {/* LEFT SIDE - Content */}
          <div className="content-side">
            <div className="hero-info">
              <span className="badge-category">{activity.activity_type}</span>
              <h1 className="main-title">{activity.name}</h1>
            </div>

            {/* MODERN SLIDER SECTION */}
            <div className="slider-container">
              {activity.gallery && activity.gallery.length > 0 ? (
                <div className="main-slider">
                  <button className="slider-ctrl prev" onClick={prevSlide}>
                    ❮
                  </button>
                  <img
                    src={activity.gallery[currentImg].image}
                    alt="Gallery"
                    className="active-slide"
                  />
                  <button className="slider-ctrl next" onClick={nextSlide}>
                    ❯
                  </button>
                  <div className="slide-counter">
                    {currentImg + 1} / {activity.gallery.length}
                  </div>
                </div>
              ) : (
                <div className="no-images">
                  No images available for this location.
                </div>
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
          
        </div>
        <div className="glass-card map-card">
            <div className="map-container-styled">
              <SimpleMap activities={[activity]} detailsActivity={activity} />
            </div>
            <div className="stats-row">
              <span className="rating">★ {activity.average_rating}</span>
              <span className="divider">|</span>
              <span className="reviews">{activity.reviews_count} Reviews</span>
            </div>

            <div className="review-card-section slots-scroll-container">
              {activity?.reviews?.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="user-profile">
                      <div className="avatar">
                        {review?.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <span className="username">
                          {review.user_name.charAt(0).toUpperCase() +
                            review.user_name.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="rating">
                      {Array.from({
                        length: Math.round(review.rating || 5),
                      }).map((_, i) => (
                        <span key={i} className="star">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="review-body">
                    <p>{review.comment}</p>
                  </div>

                  <div className="card-glow" />
                </div>
              ))}
            </div>
          </div>

      </div>
    </div>
  );
};

export default ActivityDetails;
