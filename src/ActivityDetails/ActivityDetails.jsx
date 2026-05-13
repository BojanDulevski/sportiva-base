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

  useEffect(() => {
    if (activities?.length > 0) {
      const found = activities.find((a) => String(a.id) === String(id));
      if (found) setActivity(found);
      setLoading(false);
    }
  }, [id, activities]);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const filteredSlots = activity?.slots?.filter((slot) => 
    new Date(slot.start_time).toDateString() === selectedDate.toDateString()
  ) || [];

  if (loading) return <div className="loader-screen"><div className="spinner"></div></div>;
  if (!activity) return <div className="error-screen">Activity not found</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        
        <nav className="top-nav">
          <Link to="/explore-activities" className="back-link">
            <span className="arrow-icon">←</span> Back to Explore
          </Link>
        </nav>

        <div className="dashboard-grid">
          
        
          <section className="col-left">
            <div className="glass-panel main-info">
              <span className="type-badge">{activity.activity_type}</span>
              <h1 className="activity-title">{activity.name}</h1>
              <div className="rating-row">
                <span className="stars">★ {activity.average_rating}</span>
                <span className="count">({activity.reviews_count} reviews)</span>
              </div>
            </div>

            <div className="glass-panel services-panel">
              <h4>Available Services</h4>
              <div className="services-grid">
                <div className="service-tag">Wi-Fi</div>
                <div className="service-tag">Parking</div>
                <div className="service-tag">Showers</div>
                <div className="service-tag">Locker Rooms</div>
              </div>
            </div>

            <div className="glass-panel about-panel">
              <h4>About this facility</h4>
              <p>{activity.description}</p>
            </div>
          </section>

          
          <section className="col-mid">
            <div className="gallery-card">
              <div className="gallery-header">
                <span className="label">Image Gallery</span>
                <span className="counter">{currentImg + 1} / {activity.gallery?.length}</span>
              </div>

              <div className="main-stage">
                <button className="nav-arrow prev" onClick={() => setCurrentImg(prev => prev === 0 ? activity.gallery.length-1 : prev-1)}>❮</button>
                <div className="image-container">
                  {activity.gallery?.length > 0 ? (
                    <img src={activity.gallery[currentImg]?.image} alt="Main" className="fade-img" key={currentImg} />
                  ) : <div className="no-img">No images</div>}
                </div>
                <button className="nav-arrow next" onClick={() => setCurrentImg(prev => prev === activity.gallery.length-1 ? 0 : prev+1)}>❯</button>
              </div>

              <div className="thumbnail-strip">
                {activity.gallery?.map((img, idx) => (
                  <div 
                    key={img.id} 
                    className={`thumb-box ${idx === currentImg ? 'active' : ''}`}
                    onClick={() => setCurrentImg(idx)}
                  >
                    <img src={img.image} alt="thumbnail" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          
          <section className="col-right">
            <div className="map-panel-compact">
              <SimpleMap activities={[activity]} detailsActivity={activity} />
            </div>

            <div className="glass-panel booking-panel">
              <h4>Instant Booking</h4>
              <div className="date-selector">
                <button onClick={() => changeDate(-1)}>❮</button>
                <span>{selectedDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</span>
                <button onClick={() => changeDate(1)}>❯</button>
              </div>
              <div className="slots-container">
                {filteredSlots.length > 0 ? (
                  filteredSlots.map(slot => (
                    <div key={slot.id} className="slot-row">
                      <span className="time">{new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button className="book-btn">Book</button>
                    </div>
                  ))
                ) : <p className="no-data">No slots</p>}
              </div>
            </div>

            <div className="glass-panel reviews-panel">
              <h4>Gym Reviews</h4>
              <div className="reviews-container">
                {activity.reviews?.map(r => (
                  <div key={r.id} className="review-card-mini">
                    <div className="rev-header">
                      <div className="rev-avatar">{r.user_name[0]}</div>
                      <span className="rev-name">{r.user_name}</span>
                    </div>
                    <p>"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;