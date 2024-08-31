import { React, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Layout/Home";
import Login from "./components/Layout/Login";
import SignUp from "./components/Layout/SignUp";
import { Navbar } from "./components/Layout/Navbar";
// import ProtectedRoute from "./Components/ProtectedRoute";
import axios from "axios";
import Hero from "./components/Layout/Hero";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/user", { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route path="/" element={<Hero />} />
        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <SignUp setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
