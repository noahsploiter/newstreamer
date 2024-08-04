// src/components/UserStatusManager.jsx

import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { io } from "socket.io-client";

const UserStatusManager = () => {
  const { token, userData } = useAuth();

  useEffect(() => {
    if (!userData || !userData._id) {
      return;
    }

    // Connect to Socket.IO server
    const socket = io("https://habeshan.ashara-buildingdesigns.com", {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        userId: userData._id, // Pass user ID to the server
      },
    });

    // Handle connect error
    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [token, userData]);

  return null; // This component doesn't render anything
};

export default UserStatusManager;
