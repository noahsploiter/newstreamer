import React, { useState, useEffect, useRef, useCallback } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Loading from "../common/Loading";
import { IoPlayCircle, IoRefresh } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa";
import Header from "../common/Header";

const Hero = () => {
  const [videos, setVideos] = useState([]);
  const [shuffledVideos, setShuffledVideos] = useState([]); // Store all shuffled videos
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Initialize page state
  const [allFetched, setAllFetched] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const observer = useRef(null);

  const VIDEOS_PER_PAGE = 4; // Number of videos to display per page

  // Shuffle function
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchVideos = async () => {
    setLoading(true);
    setError(false);
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

      // Shuffle all videos initially
      const shuffledVideos = shuffleArray(videoDetails);
      setShuffledVideos(shuffledVideos); // Store shuffled videos

      // Set initial state with the first page of shuffled videos
      setVideos(shuffledVideos.slice(0, VIDEOS_PER_PAGE));

      // Check if all videos have been fetched initially
      if (shuffledVideos.length <= VIDEOS_PER_PAGE) {
        setAllFetched(true);
      }
    } catch (error) {
      console.error("Error fetching videos: ", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []); // Fetch videos on initial load

  useEffect(() => {
    if (page === 0) return; // No need to fetch on initial load

    // Load more videos from shuffledVideos
    const loadMoreVideos = () => {
      const startIndex = page * VIDEOS_PER_PAGE;
      const endIndex = startIndex + VIDEOS_PER_PAGE;

      // Paginate through the shuffled list
      setVideos((prevVideos) => [
        ...prevVideos,
        ...shuffledVideos.slice(startIndex, endIndex),
      ]);

      // Check if all videos have been fetched
      if (shuffledVideos.length <= endIndex) {
        setAllFetched(true);
      }
    };

    loadMoreVideos();
  }, [page]); // Load more videos whenever the page changes

  const handleVideoClick = (video) => {
    navigate("/player", { state: { video, allVideos: videos } });
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/ikeepmyword1", "_blank");
  };

  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !allFetched) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, allFetched]
  );

  return (
    <div className="text-white mb-[100px]">
      <div className="pt-5">
        <h1 className="text-sm font-bold text-gray-400 ml-2">Latest videos</h1>
        <div className="mt-2 flex justify-center items-center flex-wrap gap-5">
          {videos.length === 0 && !loading && !error ? (
            <p className="text-gray-500">No videos available</p>
          ) : (
            videos.map((video, index) => (
              <div
                key={index}
                className="relative w-screen md:w-[450px] h-[220px] md:h-[250px] cursor-pointer pr-4 pl-4 transition-transform duration-300"
                onClick={() => handleVideoClick(video)}
                ref={videos.length === index + 1 ? lastVideoRef : null}
              >
                <div className="border bg-gray-400 w-full h-full rounded-md overflow-hidden">
                  <ReactPlayer
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
                  />
                  <h1 className="absolute bottom-2 left-5 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    {video.name}
                  </h1>
                </div>
              </div>
            ))
          )}
        </div>
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loading />
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center min-h-[200px]">
            <button
              onClick={() => fetchVideos()}
              className="flex items-center text-lg text-blue-500"
            >
              <IoRefresh className="mr-2" />
              Retry
            </button>
          </div>
        )}
      </div>

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
