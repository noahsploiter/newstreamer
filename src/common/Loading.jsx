import React from "react";
import { FidgetSpinner } from "react-loader-spinner";

const Loading = () => {
  return (
    <div>
      <FidgetSpinner
        visible={true}
        height="30"
        width="30"
        ariaLabel="fidget-spinner-loading"
        wrapperClass="fidget-spinner-wrapper"
      />
    </div>
  );
};

export default Loading;
