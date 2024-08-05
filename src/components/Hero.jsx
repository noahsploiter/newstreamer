import React, { useState, useEffect, useRef } from "react";
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  uploadString,
} from "firebase/storage";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Loading from "../common/Loading";
import { IoPlayCircle } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa";
import Header from "../common/Header";

const Hero = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const folderRef = ref(storage, "videos");
        const videoRefs = await listAll(folderRef);
        const videoDetails = await Promise.all(
          videoRefs.items.map(async (itemRef) => {
            const videoURL = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);
            const videoTitle = metadata.customMetadata?.title || "New Video";
            const thumbnailURL = metadata.customMetadata?.thumbnail;

            return {
              url: videoURL,
              name: videoTitle,
              thumbnail: thumbnailURL,
            };
          })
        );

        setVideos(videoDetails);
      } catch (error) {
        console.error("Error fetching videos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    navigate("/player", { state: { video, allVideos: videos } });
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/ikeepmyword1", "_blank");
  };

  // Capture a frame from the video and create a thumbnail
  const captureFrame = () => {
    const player = playerRef.current.getInternalPlayer();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(player, 0, 0, canvas.width, canvas.height);

    const thumbnailDataUrl = canvas.toDataURL("image/jpeg");
    console.log("Thumbnail generated:", thumbnailDataUrl);

    // Optional: upload thumbnail to Firebase Storage
    const uploadThumbnail = async (thumbnailDataUrl, video) => {
      const storageRef = ref(storage, `thumbnails/${video.name}.jpg`);
      await uploadString(storageRef, thumbnailDataUrl, "data_url");
      console.log(`Thumbnail uploaded for ${video.name}`);
    };

    // Assuming you call this function with the current video
    // You can manage this within your player controls or hooks
    uploadThumbnail(thumbnailDataUrl, video); // video is the current video object
  };

  return (
    <div className="text-white mb-[100px]">
      <Header />
      <div className="">
        <h1 className="text-sm font-bold text-gray-400 ml-2">Latest videos</h1>
        <div className="mt-2 flex justify-center items-center flex-wrap gap-5">
          {loading ? (
            <Loading />
          ) : videos.length === 0 ? (
            <p>No videos available</p>
          ) : (
            videos.map((video, index) => (
              <div
                key={index}
                className="relative w-screen md:w-[450px] h-[220px] md:h-[250px] cursor-pointer pr-4 pl-4"
                onClick={() => handleVideoClick(video)}
              >
                <div className="border bg-gray-400 w-full h-full rounded-md overflow-hidden">
                  <ReactPlayer
                    ref={playerRef}
                    url={video.url}
                    light={video.thumbnail || true}
                    playing={false}
                    width="100%"
                    height="100%"
                    controls={false}
                    playIcon={
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IoPlayCircle className="text-white text-6xl" />
                      </div>
                    }
                    onStart={captureFrame} // Capture frame when video starts
                  />
                  <h1 className="absolute bottom-2 left-5 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    {video.name}
                  </h1>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Canvas for capturing video frame */}
      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        style={{ display: "none" }}
      ></canvas>

      {/* Telegram Icon */}
      <div
        className="fixed bottom-[100px] right-5 cursor-pointer bg-blue-500 rounded-full p-3 shadow-lg"
        onClick={handleTelegramClick}
      >
        <FaTelegram className="text-white text-xl" />
      </div>
    </div>
  );
};

export default Hero;
