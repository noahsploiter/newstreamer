import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { Player, BigPlayButton, ControlBar, LoadingSpinner } from "video-react";
import "video-react/dist/video-react.css"; // Ensure this CSS is properly imported
import Loading from "../common/Loading"; // Assuming you have a Loading component

const StoryPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the video and allStories from the location state
  const { video, allStories = [] } = location.state || {};

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!video) {
      console.error("Video is undefined! Navigating back.");
      navigate(-1); // Navigate back if no video is found
    }
  }, [video, navigate]);

  const handleCanPlay = () => {
    setLoading(false);
  };

  // Filter out the currently playing video from the list of all stories
  const suggestedStories = allStories.filter((v) => v.url !== video?.url);

  const handleStorySelect = (selectedStory) => {
    setLoading(true); // Show loading spinner when selecting a new video
    navigate("/story-player", { state: { video: selectedStory, allStories } });
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
        {video && (
          <Player
            src={video.url}
            autoPlay
            fluid
            onCanPlay={handleCanPlay}
            className={`w-full ${loading ? "hidden" : ""}`}
          >
            <BigPlayButton position="center" />
            <ControlBar autoHide={true} />
            {loading && <LoadingSpinner />}
          </Player>
        )}
        <h1 className="mt-2">{video?.name}</h1>
      </div>
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Suggested Stories</h2>
        <div className="flex flex-wrap gap-5">
          {suggestedStories.map((suggestedStory, index) => (
            <div
              key={index}
              className="w-[280px] cursor-pointer"
              onClick={() => handleStorySelect(suggestedStory)}
            >
              <div className="border bg-gray-400 w-full h-[150px] rounded-md overflow-hidden">
                <img
                  src={suggestedStory.thumbnail || "default-thumbnail.jpg"}
                  alt={suggestedStory.name}
                  className="w-full h-full object-cover"
                />
                <h3 className="text-white mt-2">
                  {suggestedStory.name || "No Title Available"}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;
