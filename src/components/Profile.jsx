import React from "react";
import { Button } from "antd";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../common/Footer";
import ProfilePicture from "../common/ProfilePictures";

const Profile = () => {
  const { userData, logout } = useAuth();

  return (
    <div className="">
      <div className="flex-grow flex flex-col gap-4 justify-center items-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="flex justify-center">
            <ProfilePicture />
          </div>
          <h2 className="text-2xl font-bold mb-4">{userData.name}</h2>
          <div className="text-left">
            <p className="mb-2">
              <strong>Email:</strong> {userData.email}
            </p>
            <p className="mb-2">
              <strong>Phone Number:</strong> {userData.phoneNumber}
            </p>
            <p className="mb-2">
              <strong>Gender:</strong> {userData.gender}
            </p>
            {/* Add other user details here */}
          </div>
        </div>
        <Button onClick={logout} className="mt-4">
          Logout
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
