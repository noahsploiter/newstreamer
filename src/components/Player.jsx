import React, { useState, useEffect, useRef } from "react";
import { IoArrowBack, IoShareOutline, IoPlayCircle } from "react-icons/io5";
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
  const [showShareOptions, setShowShareOptions] = useState(false);
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
      text: `Watch this amazing video: ${video?.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(video?.name || "Check out this video!");
    const body = encodeURIComponent(
      `I wanted to share this video with you: ${window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
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
        {video && (
          <div className="relative">
            <Player
              ref={playerRef}
              src={video.url}
              autoPlay
              fluid
              onCanPlay={handleCanPlay}
              onStart={captureFrame}
              className={`w-full ${loading ? "opacity-50" : "opacity-100"}`}
              poster={video.thumbnail || capturedThumbnail}
            >
              <BigPlayButton position="center" />
              <ControlBar autoHide={true} />
            </Player>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="text-center">
                  <Loading />
                  <p className="mt-3 text-white">Loading video...</p>
                </div>
              </div>
            )}
          </div>
        )}
        <h1 className="mt-2">{video?.name}</h1>
        <button
          onClick={toggleShareOptions}
          className="flex items-center mt-4 p-2 bg-blue-600 rounded-md"
        >
          <IoShareOutline className="mr-2" />
          Share Video
        </button>

        {/* Share Options Modal */}
        {showShareOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-md text-black w-80">
              <h2 className="text-lg font-bold mb-4">Share this Video</h2>
              <button
                onClick={handleShare}
                className="block w-full p-2 mb-2 bg-blue-500 rounded-md text-white"
              >
                Share via Native Share
              </button>
              <button
                onClick={handleShareViaEmail}
                className="block w-full p-2 mb-2 bg-green-500 rounded-md text-white"
              >
                Share via Email
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="block w-full p-2 mb-2 bg-gray-500 rounded-md text-white"
              >
                Copy Link
              </button>
              <button
                onClick={toggleShareOptions}
                className="block w-full p-2 bg-red-500 rounded-md text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">Suggested Videos</h2>
        <div className="flex flex-wrap gap-5">
          {suggestedVideos.map((suggestedVideo, index) => (
            <div
              key={index}
              className="relative w-screen md:w-[350px] cursor-pointer"
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <IoPlayCircle className="text-white text-6xl" />
                </div>
                <h3 className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
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
