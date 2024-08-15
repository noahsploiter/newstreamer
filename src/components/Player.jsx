import React, { useState, useEffect, useRef } from "react";
import { IoArrowBack, IoShareOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { Player, BigPlayButton, ControlBar } from "video-react";
import "video-react/dist/video-react.css";
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
      navigate(-1);
    }
  }, [video, navigate]);

  const handleCanPlay = () => {
    setLoading(false);
  };

  const captureFrame = () => {
    const player = playerRef.current.getInternalPlayer();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (player.videoWidth && player.videoHeight) {
      canvas.width = player.videoWidth;
      canvas.height = player.videoHeight;
      context.drawImage(player, 0, 0, canvas.width, canvas.height);

      const thumbnailDataUrl = canvas.toDataURL("image/jpeg");
      console.log("Thumbnail generated:", thumbnailDataUrl);

      setCapturedThumbnail(thumbnailDataUrl);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const suggestedVideos = shuffleArray(
    allVideos.filter((v) => v.url !== video?.url)
  );

  const handleVideoSelect = (selectedVideo) => {
    setLoading(true);
    navigate("/player", { state: { video: selectedVideo, allVideos } });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [video]);

  const handleShare = async () => {
    const shareData = {
      title: video?.name || "Check out this video!",
      text: "Watch this amazing video:",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
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
      <div className="w-full flex justify-center flex-col max-w-4xl mx-auto relative">
        {loading && (
          <div className="absolute h-[230px] rounded-md inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center">
              <p className="mt-3 text-white">Loading video...</p>
            </div>
          </div>
        )}
        {video && (
          <Player
            ref={playerRef}
            src={video.url}
            autoPlay
            fluid
            onCanPlay={handleCanPlay}
            onStart={captureFrame}
            className={`w-full ${loading ? "hidden" : ""}`}
            poster={video.thumbnail || capturedThumbnail}
          >
            <BigPlayButton position="center" />
            <ControlBar autoHide={true} />
          </Player>
        )}
        <h1 className="mt-2">{video?.name}</h1>
        <button
          onClick={handleShare}
          className="flex items-center mt-4 p-2 bg-blue-600 rounded-md"
        >
          <IoShareOutline className="mr-2" />
          Share Video
        </button>
      </div>
      <div className="mt-10">
        {" "}
        {/* Add a larger margin-top here */}
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

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default PlayerComponent;
