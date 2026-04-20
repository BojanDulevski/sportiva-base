import React, {  useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ПРАВИЛНО


export default function MainHome() {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const goToGyms = () => {
    navigate("/explore-activities", { state: { category: "Gym" } }); // Испраќаме параметар во URL
  };
  const goToBoxing = () => {
    navigate("/explore-activities", { state: { category: "Boxing" } }); // Испраќаме параметар во URL
  };
  const goToSportsHalls = () => {
    navigate("/explore-activities", { state: { category: "Sports Halls" } }); // Испраќаме параметар во URL
  };


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/activities/")
      .then((response) => response.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="container">
      <section className="left-section">
        <div className="activiry-categories">
          <div onClick={goToGyms} className="card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 45 45"
              fill="none"
              width="45px"
              height="45px"
            >
              <path
                d="M33 16.5H35C35.552 16.5 36 16.948 36 17.5V27.5C36 28.052 35.552 28.5 35 28.5H33C32.448 28.5 32 28.052 32 27.5V17.5C32 16.948 32.448 16.5 33 16.5Z"
                stroke="#3C3C3C"
                stroke-width="2"
              />
              <path
                d="M29 12.5H31C31.552 12.5 32 12.948 32 13.5V31.5C32 32.052 31.552 32.5 31 32.5H29C28.448 32.5 28 32.052 28 31.5V13.5C28 12.948 28.448 12.5 29 12.5Z"
                stroke="#3C3C3C"
                stroke-width="2"
              />
              <path
                d="M15 12.5H17C17.552 12.5 18 12.948 18 13.5V31.5C18 32.052 17.552 32.5 17 32.5H15C14.448 32.5 14 32.052 14 31.5V13.5C14 12.948 14.448 12.5 15 12.5Z"
                stroke="#3C3C3C"
                stroke-width="2"
              />
              <path
                d="M11 16.5H13C13.552 16.5 14 16.948 14 17.5V27.5C14 28.052 13.552 28.5 13 28.5H11C10.448 28.5 10 28.052 10 27.5V17.5C10 16.948 10.448 16.5 11 16.5Z"
                stroke="#3C3C3C"
                stroke-width="2"
              />
              <path d="M36 22.5H39" stroke="#3C3C3C" stroke-width="2" />
              <path d="M18 22.5H28" stroke="#3C3C3C" stroke-width="2" />
              <path d="M7 22.5H10" stroke="#3C3C3C" stroke-width="2" />
            </svg>
            <h2>Gyms</h2>
          </div>
          <div onClick={goToBoxing} className="card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#000000"
              width="45px"
              height="45px"
              version="1.1"
              id="Layer_1"
              viewBox="0 0 496 496"
              xml:space="preserve"
            >
              <g>
                <g>
                  <g>
                    <path d="M424,40h-56c-39.696,0-72,32.304-72,72v28.296c-4.712-2.736-10.176-4.296-16-4.296c-17.648,0-32,14.352-32,32     c0-17.648-14.352-32-32-32c-5.824,0-11.288,1.56-16,4.296V112c0-39.696-32.304-72-72-72H72C32.304,40,0,72.304,0,112v150.152     c0,7.624,1.52,15.048,4.528,22.056L24,329.64V456h168V331.008l38.184-43.648C241.672,274.24,248,257.4,248,239.952     c0,17.448,6.328,34.288,17.816,47.408L304,331.008V456h168V329.64l19.472-45.432c3.008-7.016,4.528-14.432,4.528-22.056V112     C496,72.304,463.696,40,424,40z M232,239.952c0,13.568-4.92,26.664-13.856,36.872L180.368,320H160v16h16v104H40V336h104v-16     H37.272l-18.04-42.104c-2.144-5-3.232-10.304-3.232-15.744V112c0-30.88,25.12-56,56-56h56c30.88,0,56,25.12,56,56v28     l-22.408,16.8C155.584,161.312,152,168.488,152,176v8c0,13.232,10.768,24,24,24s24-10.768,24-24v-16c0-8.824,7.176-16,16-16     c8.824,0,16,7.176,16,16V239.952z M185.28,159.04c-0.832,2.848-1.28,5.848-1.28,8.96v16c0,4.408-3.592,8-8,8s-8-3.592-8-8v-8     c0-2.504,1.192-4.896,3.2-6.4L185.28,159.04z M310.72,159.04l14.08,10.56c2.008,1.504,3.2,3.896,3.2,6.4v8c0,4.408-3.592,8-8,8     c-4.408,0-8-3.592-8-8v-16C312,164.888,311.552,161.888,310.72,159.04z M480,262.152c0,5.448-1.088,10.752-3.232,15.76     L458.728,320H440v16h16v104H320V336h104v-16H315.632l-37.776-43.168C268.92,266.616,264,253.52,264,239.952V168     c0-8.824,7.176-16,16-16c8.824,0,16,7.176,16,16v16c0,13.232,10.768,24,24,24s24-10.768,24-24v-8c0-7.512-3.584-14.688-9.6-19.2     L312,140v-28c0-30.88,25.12-56,56-56h56c30.88,0,56,25.12,56,56V262.152z" />
                    <path d="M336,424h104v-72H336V424z M352,368h72v40h-72V368z" />
                    <path d="M56,424h104v-72H56V424z M72,368h72v40H72V368z" />
                  </g>
                </g>
              </g>
            </svg>
            <h2>Boxing</h2>
          </div>
          <div onClick={goToSportsHalls} className="card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="45px"
              height="45px"
              viewBox="0 0 60 60"
              version="1.1"
            >
              <title>field-football</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="People"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g id="Icon-43" fill="#000000">
                  <path
                    d="M55,34 C55.553,34 56,33.553 56,33 C56,32.447 55.553,32 55,32 L53,32 C52.447,32 52,32.447 52,33 L52,43 C52,43.553 52.447,44 53,44 L55,44 C55.553,44 56,43.553 56,43 C56,42.447 55.553,42 55,42 L54,42 L54,34 L55,34 Z M55,26 L45,26 C44.447,26 44,26.447 44,27 L44,49 C44,49.553 44.447,50 45,50 L55,50 C55.553,50 56,49.553 56,49 C56,48.447 55.553,48 55,48 L46,48 L46,28 L55,28 C55.553,28 56,27.553 56,27 C56,26.447 55.553,26 55,26 L55,26 Z M5,42 C4.448,42 4,42.447 4,43 C4,43.553 4.448,44 5,44 L7,44 C7.552,44 8,43.553 8,43 L8,33 C8,32.447 7.552,32 7,32 L5,32 C4.448,32 4,32.447 4,33 C4,33.553 4.448,34 5,34 L6,34 L6,42 L5,42 Z M5,50 L15,50 C15.552,50 16,49.553 16,49 L16,27 C16,26.447 15.552,26 15,26 L5,26 C4.448,26 4,26.447 4,27 C4,27.553 4.448,28 5,28 L14,28 L14,48 L5,48 C4.448,48 4,48.447 4,49 C4,49.553 4.448,50 5,50 L5,50 Z M20.853,7.976 L24.129,9.04 L29,5.491 L29,2.051 C25.35,2.415 22.276,4.752 20.853,7.976 L20.853,7.976 Z M31,2.051 L31,5.49 L35.884,9.035 L39.147,7.976 C37.724,4.752 34.65,2.415 31,2.051 L31,2.051 Z M40,12 C40,11.271 39.917,10.562 39.768,9.877 L36.499,10.938 L34.619,16.832 L36.63,19.466 C38.691,17.633 40,14.969 40,12 L40,12 Z M30,22 C31.826,22 33.535,21.5 35.01,20.641 L32.993,18 L26.978,18 L24.985,20.638 C26.461,21.498 28.171,22 30,22 L30,22 Z M25.468,10.54 L27.201,16 L32.785,16 L34.531,10.525 L30.001,7.236 L25.468,10.54 Z M23.367,19.463 L25.363,16.821 L23.496,10.938 L20.232,9.877 C20.083,10.563 20,11.271 20,12 C20,14.968 21.307,17.63 23.367,19.463 L23.367,19.463 Z M18,12 C18,10.713 18.209,9.476 18.585,8.313 C18.587,8.306 18.586,8.299 18.588,8.292 C18.591,8.282 18.599,8.275 18.603,8.266 C20.177,3.474 24.688,0 30,0 C35.314,0 39.827,3.476 41.399,8.271 C41.402,8.279 41.408,8.284 41.411,8.292 C41.413,8.297 41.411,8.303 41.413,8.309 C41.791,9.473 42,10.712 42,12 C42,15.949 40.074,19.448 37.121,21.636 C37.103,21.653 37.093,21.677 37.072,21.692 C37.045,21.713 37.013,21.722 36.983,21.739 C35.014,23.156 32.606,24 30,24 C27.396,24 24.992,23.158 23.023,21.744 C22.993,21.726 22.96,21.718 22.932,21.696 C22.91,21.68 22.899,21.654 22.879,21.637 C19.926,19.448 18,15.949 18,12 L18,12 Z M29,41.858 L29,34.142 C27.28,34.589 26,36.142 26,38 C26,39.858 27.28,41.411 29,41.858 L29,41.858 Z M31,34.142 L31,41.858 C32.721,41.411 34,39.858 34,38 C34,36.142 32.721,34.589 31,34.142 L31,34.142 Z M29,55 L29,43.91 C26.167,43.432 24,40.967 24,38 C24,35.033 26.167,32.568 29,32.09 L29,27 C29,26.447 29.448,26 30,26 C30.552,26 31,26.447 31,27 L31,32.09 C33.833,32.568 36,35.033 36,38 C36,40.967 33.833,43.432 31,43.91 L31,55 C31,55.553 30.552,56 30,56 C29.448,56 29,55.553 29,55 L29,55 Z M60,21 L60,55 C60,57.757 57.757,60 55,60 L5,60 C2.243,60 0,57.757 0,55 L0,21 C0,18.243 2.243,16 5,16 L16,16 C16.552,16 17,16.447 17,17 C17,17.553 16.552,18 16,18 L5,18 C3.346,18 2,19.346 2,21 L2,55 C2,56.654 3.346,58 5,58 L55,58 C56.654,58 58,56.654 58,55 L58,21 C58,19.346 56.654,18 55,18 L44,18 C43.447,18 43,17.553 43,17 C43,16.447 43.447,16 44,16 L55,16 C57.757,16 60,18.243 60,21 L60,21 Z"
                    id="field-football"
                  ></path>
                </g>
              </g>
            </svg>

            <h2>Sports Halls</h2>
          </div>
        </div>
        <section className="popular-gyms">
          <h2 className="section-title">Popular Gyms</h2>
          <div className="popular-gyms-grid">
            {activities
              .sort((a, b) => b.average_rating - a.average_rating)
              .slice(0, 2)
              .map((activity) => (
                <div className="gym-container">
                  <div className="gym-card">
                    <div className="gym-image">
                      <img src={activity.image} alt={activity.name} />
                    </div>
                    <div className="gym-info">
                      <h3>{activity.name}</h3>

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
                      <button className="details-btn">Details</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </section>

      <section className="right-section">
        <h2>Why Choose Us?</h2>
        <div className="stats-container">
          <p>
            Currently, our platform hosts over <strong>150+</strong> active
            fitness opportunities, featuring:
          </p>

          <ul className="stats-list">
            <li>
              <strong>45</strong> Premium Gyms
            </li>
            <li>
              <strong>20</strong> Boxing Clubs
            </li>
            <li>
              <strong>35</strong> Sports Halls
            </li>
          </ul>

          <p className="users-count">
            Join a growing community of over <strong>5,000</strong> registered
            users reaching their goals every day!
          </p>
        </div>
      </section>
    </main>
  );
}
