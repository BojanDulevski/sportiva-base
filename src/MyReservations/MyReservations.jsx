
import SimpleMap from "../MapComponent/SimpleMap";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./MyReservations.css";

export default function MyReservations({ activities, reservations: initialReservations }) {
  const [activityTypes, setActivityTypes] = useState([]);
  const [filterOption, setFilterOption] = useState(""); 
  const [localReservations, setLocalReservations] = useState([]);
  const storedUser = localStorage.getItem("username");

  // Состојби за модалот
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isNotification, setIsNotification] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "All";
  });

  // Синхронизација на почетните резервации филтрирани по корисник
  useEffect(() => {
    const filtered = (initialReservations || []).filter((r) => r.user_name === storedUser);
    setLocalReservations(filtered);
  }, [initialReservations, storedUser]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    navigate(`?category=${category}`);
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "All";
    setSelectedCategory(cat);
    setActivityTypes(cat);
  }, [location.search]);

  // Се активира кога корисникот ќе кликне на Cancel копчето во картичката
  const openCancelModal = (reservationId) => {
    setSelectedResId(reservationId);
    setModalMessage("Are you sure you want to cancel this reservation?");
    setIsNotification(false);
    setIsModalOpen(true);
  };

  // Се активира кога корисникот ќе кликне "Yes" во модалот
  const handleConfirmCancel = async () => {
    if (!selectedResId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/delete/${selectedResId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setLocalReservations((prev) => prev.filter((res) => res.id !== selectedResId));
        setModalMessage("Reservation cancelled successfully.");
        setIsNotification(true);
      } else {
        setModalMessage("Failed to cancel the reservation. Please try again.");
        setIsNotification(true);
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setModalMessage("An error occurred. Please try again.");
      setIsNotification(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResId(null);
  };

  const filteredActivities = (activities || [])
    .filter((activity) => {
      if (!activity) return false;
      if (selectedCategory === "All") return true;
      return activity.activity_type === selectedCategory;
    })
    .filter((activity) => {
      return (activity.slots || []).some((slot) => (localReservations || []).some((res) => res.timeslot === slot.id));
    });
  
  const userReservations = (localReservations || []).flatMap((res, idx) => {
    const activity = filteredActivities.find((a) => (a.slots || []).some((s) => s.id === res.timeslot));
    if (!activity) return [];
    const slot = (activity.slots || []).find((s) => s.id === res.timeslot) || null;
    const key = res.id || `${activity.id}-${res.timeslot}-${idx}`;
    return { reservation: res, activity, slot, key };
  });

  // Логика за ФИЛТРИРАЊЕ + АВТОМАТСКО СОРТИРАЊЕ (Најновите први)
  const filteredUserReservations = userReservations
    .filter(({ slot }) => {
      if (!filterOption) return true; 
      
      const now = new Date();
      const startTime = slot && slot.start_time ? new Date(slot.start_time) : new Date(0);

      if (filterOption === "upcoming") {
        return startTime >= now;
      }

      if (filterOption === "past") {
        return startTime < now;
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = a.slot && a.slot.start_time ? new Date(a.slot.start_time) : new Date(0);
      const timeB = b.slot && b.slot.start_time ? new Date(b.slot.start_time) : new Date(0);
      
      // Сортирање од најнов датум кон најстар
      return timeB - timeA;
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
              <span className="sort-label">Filter By</span>
              <select
                onChange={(e) => handleFilterChange(e.target.value)}
                className="sort-select"
                value={filterOption}
              >
                <option value="">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </header>

          <div className="activities-grid-my-reviews">
            {filteredUserReservations.map(({ reservation, activity, slot, key }) => {
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
                      <div><strong>Reserved at:</strong> {reservation.reserved_at ? new Date(reservation.reserved_at).toLocaleString() : "-"}</div>
                      <div><strong>Sport Type:</strong> {reservation.sportType}</div>
                      {slot && (slot.start_time || slot.end_time) && (  
                        <div>
                          <strong>Slot:</strong> {formatSlotRange(slot)}
                        </div>
                      )}
                    </div>

                    <div className="card-actions" style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/details/${activity.id}`} className="btn btn-details">
                        Details
                      </Link>
                      <button 
                        onClick={() => openCancelModal(reservation.id)} 
                        className="btn btn-cancel"
                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
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

      {/* Кориснички Модал прозорец */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#1a1f2a', padding: '30px', borderRadius: '10px', width: '400px', textAlign: 'center' }}>
            <h4>Confirmation</h4>
            <p>{modalMessage}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              {!isNotification ? (
                <>
                  <button 
                    onClick={handleConfirmCancel}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={closeModal}
                    style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    No
                  </button>
                </>
              ) : (
                <button 
                  onClick={closeModal}
                  style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
