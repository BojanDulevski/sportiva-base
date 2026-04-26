import "./App.css";
import ExploreActivities from "./ExploreActivities/ExploreActivities";
import Home from "./Home/Home";
import Navbar from "./Navbar/Navbar";
import ActivityDetails from './ActivityDetails/ActivityDetails';
import Signup from './Authentications/SignUp';
import Login from './Authentications/Login';
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/explore-activities" element={<ExploreActivities />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details/:id" element={<ActivityDetails />} />
      </Routes>
    </>
  );
}

export default App;