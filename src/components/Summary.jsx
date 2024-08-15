import React from "react";

const Summary = ({
  dailyRegisteredUsers,
  weeklyRegisteredUsers,
  totalRegisteredUsers,
  totalMaleUsers,
  totalFemaleUsers,
  totalOnlineUsers,
  totalOfflineUsers,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold">Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{dailyRegisteredUsers}</div>
          <div className="text-sm">Registered Today</div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{weeklyRegisteredUsers}</div>
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
  );
};

export default Summary;
