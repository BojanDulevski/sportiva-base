import "./App.css";
import ExploreActivities from "./ExploreActivities/ExploreActivities";
import Home from "./Home/Home";
import Navbar from "./Navbar/Navbar";
import ActivityDetails from './ActivityDetails/ActivityDetails';
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/explore-activities" element={<ExploreActivities />} />
        <Route path="/details/:id" element={<ActivityDetails />} />
      </Routes>
    </>
  );
}

export default App;
