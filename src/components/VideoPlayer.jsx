// src/components/VideoPlayer.js
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { FaPlay } from "react-icons/fa";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize the player when the component mounts
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        fluid: true,
        preload: "auto",
      });

      playerRef.current.on("play", () => {
        setIsPlaying(true);
      });

      playerRef.current.on("pause", () => {
        setIsPlaying(false);
      });

      playerRef.current.on("ended", () => {
        setIsPlaying(false);
      });
    }

    // Update the player source when the src prop changes
    if (playerRef.current && src) {
      playerRef.current.src({ src, type: "video/mp4" });
      playerRef.current.load();
    }

    return () => {
      // Dispose the player when the component unmounts
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  const handleOverlayClick = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-full">
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 cursor-pointer"
          onClick={handleOverlayClick}
        >
          <FaPlay className="text-white text-4xl" />
        </div>
      )}
      <div data-vjs-player className="w-full h-full">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered w-full h-full"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
