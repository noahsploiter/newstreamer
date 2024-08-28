import React from "react";

const AgeVerificationModal = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          Habeshan<span className="text-red-500">X </span> is
          <span className="text-red-500"> adults only</span> website!
        </h2>
        <p className="mb-2 text-sm">
          The content available on Habeshan
          <span className="text-red-500">X</span> may contain pornographic
          materials. Habeshan<span className="text-red-500">X</span> is strictly
          limited to those over 18 or of legal age in your jurisdiction,
          whichever is greater. One of our core goals is to help parents
          restrict access to Habeshan<span className="text-red-500">X</span> for
          minors, so we have ensured that Habeshan
          <span className="text-red-500">X</span> is, and remains, fully
          compliant with the RTA (Restricted to Adults) code. This means that
          all access to the site can be blocked by simple parental control
          tools. It is important that responsible parents and guardians take the
          necessary steps to prevent minors from accessing unsuitable content
          online, especially age-restricted content. Anyone with a minor in
          their household or under their supervision should implement basic
          parental control protections, including computer hardware and device
          settings, software installation, or ISP filtering services, to block
          your minors from accessing inappropriate content.
        </p>
        <button
          onClick={onConfirm}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          I am 18 or older
        </button>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
