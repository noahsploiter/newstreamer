import React from "react";

const AgeVerificationModal = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Age Verification</h2>
        <p className="mb-6">
          You must be 18 years or older to enter this site.
        </p>
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          I am 18 or older
        </button>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
