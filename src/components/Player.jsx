import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { Player, BigPlayButton, ControlBar } from "video-react";
import "video-react/dist/video-react.css"; // import css for video-react
import Loading from "../common/Loading";

const PlayerComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { video, allVideos = [] } = location.state || {};

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!video) {
      navigate(-1); // Navigate back if no video is found
    }
  }, [video, navigate]);

  const handleCanPlay = () => {
    setLoading(false);
  };

  // Filter out the currently playing video from the list of all videos
  const suggestedVideos = allVideos.filter((v) => v.url !== video.url);

  // Debugging: Log the suggested videos and their names
  useEffect(() => {
    // console.log("Current Video:", video);
    // console.log("All Videos:", allVideos);
    // console.log("Suggested Videos:", suggestedVideos);
  }, [video, allVideos, suggestedVideos]);

  const handleVideoSelect = (selectedVideo) => {
    navigate("/player", { state: { video: selectedVideo, allVideos } });
  };

  return (
    <div className="text-white p-5 mb-[100px]">
      <button
        className="flex items-center text-lg mb-4"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack className="mr-2" />
        Back
      </button>
      <div className="w-full flex justify-center flex-col max-w-4xl mx-auto">
        {loading && <Loading />}
        <Player
          src={video?.url}
          autoPlay
          fluid
          onCanPlay={handleCanPlay}
          className={`w-full ${loading ? "hidden" : ""}`}
        >
          <BigPlayButton position="center" />
          <ControlBar autoHide={true} />
        </Player>
        <h1 className="mt-2">{video?.name}</h1>
      </div>
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Suggested Videos</h2>
        <div className="flex flex-wrap gap-5">
          {suggestedVideos.map((suggestedVideo, index) => (
            <div
              key={index}
              className="w-[280px] cursor-pointer"
              onClick={() => handleVideoSelect(suggestedVideo)}
            >
              <div className="border bg-gray-400 w-full h-[150px] rounded-md overflow-hidden">
                <img
                  src={suggestedVideo.thumbnail || "default-thumbnail.jpg"}
                  alt={suggestedVideo.name}
                  className="w-full h-full object-cover"
                />
                <h3 className="text-white mt-2">
                  {suggestedVideo.name || "No Title Available"}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerComponent;
