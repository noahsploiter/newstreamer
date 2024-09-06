import React, { useState } from "react";
import { format } from "date-fns";

const UserTable = ({ users, calculateTimeSpentToday, formatTimeSpent }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const usersPerPage = 10;

  // Filtering users based on the dropdown filter value
  const filteredUsers = users.filter((user) => {
    if (filter === "female") return user.gender === "female";
    if (filter === "online") return user.onlineStatus;
    return true;
  });

  // Calculate total number of pages
  const lastPage = Math.ceil(filteredUsers.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination functions
  const handleNext = () => {
    setCurrentPage((prev) => (prev < lastPage ? prev + 1 : prev));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleLastPage = () => {
    setCurrentPage(lastPage);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  // Function to compute page numbers for pagination buttons
  const pageNumbers = () => {
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 2, lastPage);

    if (end === lastPage && end - start < 2) {
      start = Math.max(end - 2, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center py-3">
        <select
          className="px-3 py-2 border rounded"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1); // Reset to first page on filter change
          }}
        >
          <option value="all">All Users</option>
          <option value="female">Female Only</option>
          <option value="online">Online Only</option>
        </select>
      </div>
      <table className="min-w-full bg-white text-xs">
        <thead className="bg-gray-200 text-gray-600 uppercase leading-normal">
          <tr>
            <th className="py-2 px-4 text-left">Full Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Phone Number</th>
            <th className="py-2 px-4 text-left">Gender</th>
            <th className="py-2 px-4 text-left">Registered Date</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Time Spent Today</th>
            <th className="py-2 px-4 text-left">Total Time Spent</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {currentUsers.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.phoneNumber}</td>
              <td className="py-2 px-4">{user.gender}</td>
              <td className="py-2 px-4">
                {format(new Date(user.createdAt), "MM/dd/yyyy")}
              </td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.onlineStatus
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.onlineStatus ? "Online" : "Offline"}
                </span>
              </td>
              <td className="py-2 px-4">
                {calculateTimeSpentToday(user.activityLog)}
              </td>
              <td className="py-2 px-4">
                {formatTimeSpent(user.totalTimeSpent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-2 space-x-1">
        <button
          onClick={handleFirstPage}
          className="px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-500 border border-blue-500"
        >
          0
        </button>
        <button
          onClick={handlePrevious}
          className="px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-500 border border-blue-500"
        >
          &lt;&lt;
        </button>

        {/* Page numbers */}
        {pageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={handleNext}
          className="px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-500 border border-blue-500"
        >
          &gt;&gt;
        </button>
        <button
          onClick={handleLastPage}
          className="px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-500 border border-blue-500"
        >
          Last Page
        </button>
      </div>
    </div>
  );
};

export default UserTable;
