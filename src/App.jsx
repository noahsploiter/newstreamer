import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Dashboard from "./pages/Dashboard";
import Hero from "./components/Hero";
import Shuffle from "./components/Shuffle";
import Profile from "./components/Profile";
import Footer from "./common/Footer";
import Player from "./components/Player";
import { useAuth } from "./contexts/AuthContext";
import Upload from "./components/Upload";
import Contents from "./components/Contents";
import UserStatusManager from "./components/UserStatusManager";

const App = () => {
  const { isAuthenticated, userData } = useAuth();

  // Example of role-based route access
  const isAdmin = userData?.role === "admin";

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/upload"
              element={isAuthenticated ? <Upload /> : <Navigate to="/login" />}
            />
            <Route
              path="/contents"
              element={
                isAuthenticated ? <Contents /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/hero"
              element={isAuthenticated ? <Hero /> : <Navigate to="/login" />}
            />
            <Route
              path="/shuffle"
              element={isAuthenticated ? <Shuffle /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/player"
              element={isAuthenticated ? <Player /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
        {isAuthenticated && <Footer />}
        {isAuthenticated && <UserStatusManager />}
      </div>
    </Router>
  );
};

export default App;
