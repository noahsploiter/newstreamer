import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, Spin, Alert } from "antd";
import { startOfWeek, isSameDay, isSameWeek } from "date-fns";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Summary from "../components/Summary";
import UserTable from "../components/UserTable";

const Admin = () => {
  const { token, logout, userData } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData?._id) {
      setError("User is not authenticated");
      return;
    }

    setLoading(true);

    const socket = io("https://habeshan.ashara-buildingdesigns.com", {
      extraHeaders: { Authorization: `Bearer ${token}` },
      query: { userId: userData._id },
    });

    socket.on("userUpdates", (updatedUsers) => {
      setUsers(
        updatedUsers.sort((a, b) => b.totalTimeSpent - a.totalTimeSpent)
      );
      setLoading(false);
    });

    socket.on("connect_error", (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => socket.disconnect();
  }, [token, userData]);

  const calculateTimeSpentToday = (activityLog = []) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayLog = activityLog.find(
      (log) => new Date(log.date).setHours(0, 0, 0, 0) === today
    );
    return todayLog ? formatTimeSpent(todayLog.timeSpent) : "0h 0m";
  };

  const formatTimeSpent = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const dailyRegisteredUsers = users.filter((user) =>
    isSameDay(new Date(user.createdAt), new Date())
  ).length;
  const weeklyRegisteredUsers = users.filter((user) =>
    isSameWeek(new Date(user.createdAt), new Date(), { weekStartsOn: 1 })
  ).length;
  const totalRegisteredUsers = users.length;
  const totalMaleUsers = users.filter((user) => user.gender === "male").length;
  const totalFemaleUsers = users.filter(
    (user) => user.gender === "female"
  ).length;
  const totalOnlineUsers = users.filter((user) => user.onlineStatus).length;
  const totalOfflineUsers = totalRegisteredUsers - totalOnlineUsers;

  return (
    <div className="min-h-screen mb-[100px] flex flex-col items-center bg-gray-100 p-4">
      <Button
        icon={<MenuOutlined />}
        onClick={() => setMenuOpen(!menuOpen)}
        type="link"
      />
      {menuOpen && (
        <div className="absolute top-16 left-0 bg-white shadow-md z-50 w-full p-2">
          <Button block onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button block onClick={() => navigate("/upload")}>
            Upload
          </Button>
          <Button block onClick={() => navigate("/contents")}>
            Contents
          </Button>
          <Button block onClick={() => navigate("/storyadmin")}>
            Story
          </Button>
        </div>
      )}
      <Button onClick={logout} className="mb-2">
        Logout
      </Button>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4">Registered Users</h2>

        <Summary
          dailyRegisteredUsers={dailyRegisteredUsers}
          weeklyRegisteredUsers={weeklyRegisteredUsers}
          totalRegisteredUsers={totalRegisteredUsers}
          totalMaleUsers={totalMaleUsers}
          totalFemaleUsers={totalFemaleUsers}
          totalOnlineUsers={totalOnlineUsers}
          totalOfflineUsers={totalOfflineUsers}
        />

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin />
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <UserTable
            users={users}
            calculateTimeSpentToday={calculateTimeSpentToday}
            formatTimeSpent={formatTimeSpent}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
