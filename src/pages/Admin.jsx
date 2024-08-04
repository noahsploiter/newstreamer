import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, Spin, Alert } from "antd";
import { format, startOfWeek, isSameDay, isSameWeek } from "date-fns";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Admin = () => {
  const { token, logout, userData } = useAuth(); // Use userData from context
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData || !userData._id) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Connect to Socket.IO server
    const socket = io("https://habeshan.ashara-buildingdesigns.com", {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        userId: userData._id, // Use userData._id
      },
    });

    // Listen for user updates
    socket.on("userUpdates", (updatedUsers) => {
      const sortedUsers = updatedUsers.sort(
        (a, b) => b.totalTimeSpent - a.totalTimeSpent
      );
      setUsers(sortedUsers);
      setLoading(false);
    });

    socket.on("connect_error", (err) => {
      setError(err.message);
      setLoading(false);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [token, userData]);

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

  const dailyRegisteredUsers = users.filter((user) =>
    isSameDay(new Date(user.createdAt), today)
  ).length;

  const weeklyRegisteredUsers = users.filter((user) =>
    isSameWeek(new Date(user.createdAt), today, { weekStartsOn: 1 })
  ).length;

  const totalRegisteredUsers = users.length;
  const totalMaleUsers = users.filter((user) => user.gender === "male").length;
  const totalFemaleUsers = users.filter(
    (user) => user.gender === "female"
  ).length;

  // Calculate total online and offline users
  const totalOnlineUsers = users.filter((user) => user.onlineStatus).length;
  const totalOfflineUsers = totalRegisteredUsers - totalOnlineUsers;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to format time from seconds to hours and minutes
  const formatTimeSpent = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen mb-[100px] flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full justify-between items-center p-2">
        <Button icon={<MenuOutlined />} onClick={toggleMenu} type="link" />
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
          </div>
        )}
        <Button onClick={logout} className="mb-2">
          Logout
        </Button>
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-2xl font-bold mb-4">Registered Users</h2>

          <div className="mb-4">
            <h3 className="text-xl font-semibold">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{dailyRegisteredUsers}</div>
                <div className="text-sm">Registered Today</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {weeklyRegisteredUsers}
                </div>
                <div className="text-sm">Registered This Week</div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{totalRegisteredUsers}</div>
                <div className="text-sm">Total Registered</div>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{totalMaleUsers}</div>
                <div className="text-sm">Total Male</div>
              </div>
              <div className="bg-pink-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{totalFemaleUsers}</div>
                <div className="text-sm">Total Female</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{totalOnlineUsers}</div>
                <div className="text-sm">Online Users</div>
              </div>
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{totalOfflineUsers}</div>
                <div className="text-sm">Offline Users</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spin />
            </div>
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Full Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Phone Number</th>
                    <th className="py-3 px-6 text-left">Gender</th>
                    <th className="py-3 px-6 text-left">Registered Date</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Time Spent</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">{user.name}</td>
                      <td className="py-3 px-6 text-left">{user.email}</td>
                      <td className="py-3 px-6 text-left">
                        {user.phoneNumber}
                      </td>
                      <td className="py-3 px-6 text-left">{user.gender}</td>
                      <td className="py-3 px-6 text-left">
                        {format(new Date(user.createdAt), "MM/dd/yyyy")}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {user.onlineStatus ? (
                          <span className="text-green-500">● Online</span>
                        ) : (
                          <span className="text-red-500">● Offline</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {formatTimeSpent(user.totalTimeSpent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
