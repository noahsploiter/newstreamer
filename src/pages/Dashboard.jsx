import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Admin from "./Admin";
import Loading from "../common/Loading";

const Dashboard = () => {
  const { userData, isAuthenticated, isLoading, error } = useAuth();
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error("Error fetching user data:", error);
        setRedirectPath("/error"); // Assuming you have an error page
      } else if (!isAuthenticated) {
        setRedirectPath("/login");
      } else if (userData?.role !== "admin") {
        setRedirectPath("/hero");
      }
    }
  }, [isLoading, isAuthenticated, userData, error]);

  if (isLoading) {
    return <Loading />;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return <Admin />;
};

export default Dashboard;
