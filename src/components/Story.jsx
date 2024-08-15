import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../firebase"; // Ensure this imports your initialized Firebase storage
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Loading from "../common/Loading";
import { IoPlayCircle } from "react-icons/io5";
import Header from "../common/Header";

const Story = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if the component is unmounted

    const fetchStories = async () => {
      try {
        const folderRef = ref(storage, "storys"); // Ensure this matches your actual folder name
        const storyRefs = await listAll(folderRef);
        const storyDetails = await Promise.all(
          storyRefs.items.map(async (itemRef) => {
            const storyURL = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);
            const storyTitle = metadata.customMetadata?.title || "New Story";
            const thumbnailURL =
              metadata.customMetadata?.thumbnail || "default-thumbnail.jpg"; // Fallback thumbnail

            return {
              url: storyURL,
              name: storyTitle,
              thumbnail: thumbnailURL,
            };
          })
        );

        if (isMounted) {
          setStories(storyDetails);
        }
      } catch (error) {
        console.error("Error fetching stories: ", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStories();

    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmounting
    };
  }, []);

  const handleStoryClick = (story) => {
    navigate("/storyplayer", { state: { video: story, allStories: stories } });
  };

  return (
    <div className="text-white mb-[100px]">
      <div className="pb-5 ">
        <h1 className="text-sm font-bold text-gray-400">Latest Stories</h1>
        <div className="mt-2 flex justify-center items-center flex-wrap ">
          {loading ? (
            <Loading />
          ) : stories.length === 0 ? (
            <p>No stories available</p>
          ) : (
            stories.map((story, index) => (
              <div
                key={index}
                className="relative p-2 pr-3 pl-3 w-screen h-[220px] cursor-pointer"
                onClick={() => handleStoryClick(story)}
              >
                <div className="border bg-gray-400 w-full h-full rounded-md overflow-hidden">
                  {story.thumbnail ? (
                    <img
                      src={story.thumbnail}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ReactPlayer
                      url={story.url}
                      light={true} // Use light mode with thumbnail
                      playing={false}
                      width="100%"
                      height="100%"
                      playIcon={
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IoPlayCircle className="text-white text-6xl" />
                        </div>
                      }
                    />
                  )}
                  <h1 className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    {story.name}
                  </h1>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;
