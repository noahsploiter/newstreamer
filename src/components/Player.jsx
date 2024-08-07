import React, { useState, useEffect, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { Player, BigPlayButton, ControlBar, LoadingSpinner } from "video-react";
import "video-react/dist/video-react.css"; // Ensure this CSS is properly imported
import Loading from "../common/Loading";

const PlayerComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { video, allVideos = [] } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [capturedThumbnail, setCapturedThumbnail] = useState(
    video?.thumbnail || null
  );
  const playerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!video) {
      console.error("Video is undefined! Navigating back.");
      navigate(-1); // Navigate back if no video is found
    }
  }, [video, navigate]);

  const handleCanPlay = () => {
    setLoading(false);
  };

  // Capture a frame from the video and create a thumbnail
  const captureFrame = () => {
    const player = playerRef.current.getInternalPlayer();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Ensure the video has been loaded and has dimensions
    if (player.videoWidth && player.videoHeight) {
      canvas.width = player.videoWidth;
      canvas.height = player.videoHeight;
      context.drawImage(player, 0, 0, canvas.width, canvas.height);

      const thumbnailDataUrl = canvas.toDataURL("image/jpeg");
      console.log("Thumbnail generated:", thumbnailDataUrl);

      setCapturedThumbnail(thumbnailDataUrl);
    }
  };

  // Filter out the currently playing video from the list of all videos
  const suggestedVideos = allVideos.filter((v) => v.url !== video?.url);

  const handleVideoSelect = (selectedVideo) => {
    setLoading(true); // Show loading spinner when selecting a new video
    navigate("/player", { state: { video: selectedVideo, allVideos } });
  };

  useEffect(() => {
    // Scroll to top whenever a new video is loaded
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [video]);

  useEffect(() => {
    console.log("Video:", video);
    console.log("All Videos:", allVideos);
    console.log("Suggested Videos:", suggestedVideos);
  }, [video, allVideos, suggestedVideos]);

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
            ref={playerRef}
            src={video.url}
            autoPlay
            fluid
            onCanPlay={handleCanPlay}
            onStart={captureFrame} // Capture frame when video starts
            className={`w-full ${loading ? "hidden" : ""}`}
          >
            <BigPlayButton position="center" />
            <ControlBar autoHide={true} />
            {loading && <LoadingSpinner />}
          </Player>
        )}
        <h1 className="mt-2">{video?.name}</h1>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Suggested Videos</h2>
        <div className="flex flex-wrap gap-5">
          {suggestedVideos.map((suggestedVideo, index) => (
            <div
              key={index}
              className="w-screen md:w-[350px] cursor-pointer"
              onClick={() => handleVideoSelect(suggestedVideo)}
            >
              <div className="border bg-gray-400 w-full h-[220px] md:w-[350px] rounded-md overflow-hidden">
                <img
                  src={
                    suggestedVideo.thumbnail ||
                    capturedThumbnail ||
                    "default-thumbnail.jpg"
                  }
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

      {/* Canvas for capturing video frame */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default PlayerComponent;
