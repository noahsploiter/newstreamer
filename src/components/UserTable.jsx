import React from "react";
import { format } from "date-fns";

const UserTable = ({ users, calculateTimeSpentToday, formatTimeSpent }) => {
  return (
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
            <th className="py-3 px-6 text-left">Time Spent Today</th>
            <th className="py-3 px-6 text-left">Total Time Spent</th>
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
              <td className="py-3 px-6 text-left">{user.phoneNumber}</td>
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
                {calculateTimeSpentToday(user.activityLog)}
              </td>
              <td className="py-3 px-6 text-left">
                {formatTimeSpent(user.totalTimeSpent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
