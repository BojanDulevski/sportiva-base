import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SimpleMap from "../MapComponent/SimpleMap";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import "./ActivityDetails.css";

const renderIcon = (iconName) => {
  const allIcons = { ...FaIcons, ...MdIcons, ...GiIcons };
  const IconComponent = allIcons[iconName];
  return IconComponent ? <IconComponent size={18} /> : null;
};

const ActivityDetails = ({ activities }) => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState("");

  // --- Динамички состојби за рефреш во реално време ---
  const [reviews, setReviews] = useState([]);
  const [slots, setSlots] = useState([]);

  // --- Review modal state ---
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    activity: parseInt(id),
    user_name: localStorage.getItem("username") || "",
    rating: 5,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // --- Reservation modal state ---
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservationSubmitting, setReservationSubmitting] = useState(false);
  const [reservationError, setReservationError] = useState("");

  useEffect(() => {
    if (activities?.length > 0) {
      const found = activities.find((a) => String(a.id) === String(id));
      if (found) {
        setActivity(found);
        setReviews(found.reviews || []);
        setSlots(found.slots || []); // Ги полниме слотовите во локална состојба
      }
      setLoading(false);
    }
  }, [id, activities]);

  useEffect(() => {
    if (activity?.activity_type === "gym") {
      setSelectedSport("gym");
    }
  }, [activity]);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Филтрирање: Само слотови за избраниот датум, кои НЕ СЕ поминати (пред `now`) и кои НЕ СЕ веќе резервирани
  const filteredSlots =
    slots?.filter((slot) => slot.is_full === false).filter((slot) => {
      const slotDate = new Date(slot.start_time);
      const now = new Date();

      // 1. Проверка дали слотот припаѓа на избраниот датум
      const isSameDate = slotDate.toDateString() === selectedDate.toDateString();

      // 2. Проверка дали слотот е во иднината (ако гледаме за денес, да не ги дава поминатите часови)
      const isFutureSlot = slotDate.getTime() >= now.getTime();

      // 3. Проверка дали слотот е веќе резервиран (се потпира на флаг од бекендот како `is_reserved` или `reserved`)
      const isAlreadyReserved = slot.is_reserved || slot.reserved || slot.status === "reserved";

      return isSameDate && isFutureSlot && !isAlreadyReserved;
    }) || [];

  // --- Submit Review ---
  const handleReviewSubmit = async () => {
    setReviewError("");
    setReviewSubmitting(true);

    if (!reviewForm.comment) {
      setReviewError("Please fill in the comment.");
      setReviewSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/review/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          activity: reviewForm.activity,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
        setShowReviewModal(false);

        // Автоматски рефреш на листата со рецензии веднаш
        setReviews([...reviews, data]);

        // Ресетирање на формата за следен пат
        setReviewForm({
          activity: parseInt(id),
          user_name: localStorage.getItem("username") || "",
          rating: 5,
          comment: "",
        });
      } else {
        console.log("Грешка од бекенд:", data);
        setReviewError(JSON.stringify(data));
      }
    } catch (err) {
      setReviewError("Server connection failed.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // --- Open Reservation Modal ---
  const handleBookClick = (slot) => {
    setSelectedSlot(slot);
    setReservationError("");
    setShowReservationModal(true);
  };

  // --- Confirm Reservation ---
  const handleReservationSubmit = async () => {
    setReservationError("");
    setReservationSubmitting(true);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reservation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          timeslot: selectedSlot.id, // Поправено според твојот Serializer
          sportType: selectedSport, // Додавање на избраниот спорт/дисциплина
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
        setShowReservationModal(false);

        // --- Автоматски рефреш на слотовите ---
        // Опција А: Ако сакаш веднаш да го СКИПНЕШ/ОТСТРАНИШ резервираниот слот од листата:
        setSlots(slots.filter((s) => s.id !== selectedSlot.id));

        /* 
        Опција Б: Ако твојот слот има статус (на пр. 'status': 'reserved') и сакаш да остане видлив, 
        но да го смениш неговото однесување, откоментирај го ова подолу:
        
        setSlots(slots.map(s => s.id === selectedSlot.id ? { ...s, status: 'reserved' } : s));
        */
      } else {
        console.log("Грешка при резервација:", data);
        setReservationError(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      setReservationError("Reservation failed. Make sure you don't have this slot already booked, or try");
    } finally {
      setReservationSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="loader-screen">
        <div className="spinner"></div>
      </div>
    );
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
          {/* LEFT */}
          <section className="col-left">
            <div className="glass-panel main-info">
              <span className="type-badge">{activity.activity_type}</span>
              <h1 className="activity-title">{activity.name}</h1>
              <div className="rating-row">
                <span className="stars">★ {activity.average_rating}</span>
                <span className="count">
                  ({reviews.length} reviews){" "}
                  {/* Се пресметува од динамичката состојба */}
                </span>
              </div>
            </div>

            <div className="glass-panel services-panel">
              <h4>Available Services</h4>
              <div className="services-grid">
                {activity.services?.length > 0 ? (
                  activity.services.map((service) => (
                    <div key={service.id} className="service-tag">
                      {renderIcon(service.icon)}
                      <span>{service.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No services available</p>
                )}
              </div>
            </div>

            <div className="glass-panel about-panel">
              <h4>About this facility</h4>
              <p>{activity.description}</p>
            </div>
          </section>

          {/* MID */}
          <section className="col-mid">
            <div className="gallery-card">
              <div className="gallery-header">
                <span className="label">Image Gallery</span>
                <span className="counter">
                  {currentImg + 1} / {activity.gallery?.length}
                </span>
              </div>

              <div className="main-stage">
                <button
                  className="nav-arrow prev"
                  onClick={() =>
                    setCurrentImg((prev) =>
                      prev === 0 ? activity.gallery.length - 1 : prev - 1,
                    )
                  }
                >
                  ❮
                </button>
                <div className="image-container">
                  {activity.gallery?.length > 0 ? (
                    <img
                      src={activity.gallery[currentImg]?.image}
                      alt="Main"
                      className="fade-img"
                      key={currentImg}
                    />
                  ) : (
                    <div className="no-img">No images</div>
                  )}
                </div>
                <button
                  className="nav-arrow next"
                  onClick={() =>
                    setCurrentImg((prev) =>
                      prev === activity.gallery.length - 1 ? 0 : prev + 1,
                    )
                  }
                >
                  ❯
                </button>
              </div>

              <div className="thumbnail-strip">
                {activity.gallery?.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`thumb-box ${idx === currentImg ? "active" : ""}`}
                    onClick={() => setCurrentImg(idx)}
                  >
                    <img src={img.image} alt="thumbnail" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <section className="col-right">
            <div className="map-panel-compact">
              <SimpleMap activities={[activity]} detailsActivity={activity} />
            </div>

            <div className="glass-panel booking-panel">
              <h4>Instant Booking</h4>
              <div className="date-selector">
                <button onClick={() => changeDate(-1)}>❮</button>
                <span>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <button onClick={() => changeDate(1)}>❯</button>
              </div>
              <div className="slots-container">
                {filteredSlots.length > 0 ? (
                  filteredSlots.map((slot) => (
                    <div key={slot.id} className="slot-row">
                      <span className="time">
                        {new Date(slot.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button
                        className="book-btn"
                        onClick={() => handleBookClick(slot)}
                      >
                        Book
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No slots</p>
                )}
              </div>
            </div>

            {/* REVIEWS PANEL */}
            <div className="glass-panel reviews-panel">
              <div className="reviews-header">
                <h4>Gym Reviews</h4>
                <button
                  className="add-review-btn"
                  onClick={() => setShowReviewModal(true)}
                >
                  + Add Review
                </button>
              </div>
              <div className="reviews-container">
                {reviews.length > 0 ? (
                  // Прикажување на рецензиите наопаку (.reverse()) за најновата да биде прва горе
                  [...reviews].reverse().map((r) => (
                    <div key={r.id} className="review-card-mini">
                      <div className="rev-header">
                        <div className="rev-avatar">
                          {r.user_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <span className="rev-name">{r.user_name}</span>
                          {r.rating && (
                            <span className="rev-rating">
                              {"★".repeat(r.rating)}
                              {"☆".repeat(5 - r.rating)}
                            </span>
                          )}
                        </div>
                      </div>
                      <p>"{r.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No reviews yet. Be the first!</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowReviewModal(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write a Review</h3>
              <button
                className="modal-close"
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <label className="modal-label">Rating</label>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${star <= reviewForm.rating ? "active" : ""}`}
                    onClick={() =>
                      setReviewForm((f) => ({ ...f, rating: star }))
                    }
                  >
                    ★
                  </button>
                ))}
              </div>

              <label className="modal-label">Your Comment</label>
              <textarea
                className="modal-textarea"
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, comment: e.target.value }))
                }
                rows={4}
              />

              {reviewError && <p className="modal-error">{reviewError}</p>}
            </div>

            <div className="modal-footer">
              <button
                className="modal-cancel"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-submit"
                onClick={handleReviewSubmit}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESERVATION MODAL */}
      {showReservationModal && selectedSlot && (
        <div
          className="modal-overlay"
          onClick={() => setShowReservationModal(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Your Booking</h3>
              <button
                className="modal-close"
                onClick={() => setShowReservationModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>
                You are booking a slot for <strong>{activity.name}</strong>.
              </p>

              <div
                className="booking-details-summary"
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "6px",
                }}
              >
                <p>
                  📅 <strong>Date:</strong>{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  ⏰ <strong>Time:</strong>{" "}
                  {new Date(selectedSlot.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  📍 <strong>Type:</strong>{" "}
                  {activity.activity_type === "sports_hall"
                    ? "Sports Hall"
                    : activity.activity_type === "box"
                      ? "Box"
                      : "Gym"}
                </p>

                {/* 1. Ако е ТЕРЕТАНА (gym) - Автоматски се поставува како Gym */}
                {activity.activity_type === "gym" && (
                  <p>
                    🏋️‍♂️ <strong>Activity:</strong> Gym Session
                  </p>
                )}

                {/* 2. Ако е СПОРТСКА САЛА (sports_hall) - Се бира спорт */}
                {activity.activity_type === "sports_hall" && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label htmlFor="sport-select">
                      ⚽ <strong>Choose Sport:</strong>
                    </label>
                    <select
                      id="sport-select"
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      style={{
                        padding: "5px 10px",
                        background: "#1a2333",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "4px",
                        outline: "none",
                      }}
                    >
                      <option value="">-- Choose Sport --</option>
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Volleyball">Volleyball</option>
                      <option value="Handball">Handball</option>
                    </select>
                  </div>
                )}

                {/* 3. Ако е БОКС (box) - Се бира дисциплина */}
                {activity.activity_type === "box" && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label htmlFor="box-select">
                      🥊 <strong>Choose Discipline:</strong>
                    </label>
                    <select
                      id="box-select"
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      style={{
                        padding: "5px 10px",
                        background: "#1a2333",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "4px",
                        outline: "none",
                      }}
                    >
                      <option value="">-- Choose Discipline --</option>
                      <option value="Boxing">Boxing</option>
                      <option value="Kickboxing">Kickboxing</option>
                    </select>
                  </div>
                )}
              </div>

              {reservationError && (
                <p
                  className="modal-error"
                  style={{ color: "#ff4a4a", marginTop: "15px" }}
                >
                  {reservationError}
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="modal-cancel"
                onClick={() => setShowReservationModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-submit"
                onClick={handleReservationSubmit}
                disabled={reservationSubmitting}
              >
                {reservationSubmitting
                  ? "Processing..."
                  : "Confirm Reservation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetails;