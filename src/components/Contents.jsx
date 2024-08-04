import React, { useState, useEffect } from "react";
import { storage } from "../firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  deleteObject,
  getMetadata,
  uploadBytesResumable,
  updateMetadata,
} from "firebase/storage";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Spin } from "antd";
import Loading from "../common/Loading";

const Contents = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("recent");
  const [totalSizeInMB, setTotalSizeInMB] = useState(0);
  const [uploadingVideos, setUploadingVideos] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const listRef = ref(storage, "videos");
        const res = await listAll(listRef);
        const videoPromises = res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          const sizeInMB = (metadata.size / (1024 * 1024)).toFixed(2); // Convert size to MB
          const creationTime = new Date(metadata.timeCreated); // Ensure this is a Date object
          const videoTitle = metadata.customMetadata?.title || "New Video";
          const thumbnailURL = metadata.customMetadata?.thumbnail; // Get thumbnail URL

          return {
            name: videoTitle,
            url,
            ref: itemRef,
            sizeInMB: parseFloat(sizeInMB),
            creationTime,
            thumbnail: thumbnailURL,
          };
        });

        const videoList = await Promise.all(videoPromises);
        setVideos(videoList);
        sortVideos(videoList, sortOption); // Sort videos initially

        // Calculate total size in MB
        const totalSize = videoList.reduce(
          (sum, video) => sum + video.sizeInMB,
          0
        );
        setTotalSizeInMB(totalSize.toFixed(2));
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (videoRef) => {
    try {
      await deleteObject(videoRef);
      setVideos((prevVideos) => prevVideos.filter((v) => v.ref !== videoRef));
      alert("Video deleted successfully.");
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video.");
    }
  };

  const sortVideos = (videos, option) => {
    let sortedVideos = [];
    switch (option) {
      case "recent":
        sortedVideos = [...videos].sort(
          (a, b) => b.creationTime - a.creationTime
        );
        break;
      case "biggest":
        sortedVideos = [...videos].sort((a, b) => b.sizeInMB - a.sizeInMB);
        break;
      case "smallest":
        sortedVideos = [...videos].sort((a, b) => a.sizeInMB - b.sizeInMB);
        break;
      default:
        sortedVideos = videos;
    }
    setFilteredVideos(sortedVideos);
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    sortVideos(videos, newSortOption);
  };

  const handleThumbnailUpdate = async (video, file) => {
    if (!file) {
      alert("Please select a thumbnail image file.");
      return;
    }

    // Set uploading state for the specific video
    setUploadingVideos((prevState) => ({
      ...prevState,
      [video.ref.fullPath]: true,
    }));

    try {
      // Upload the new thumbnail
      const thumbnailRef = ref(storage, `thumbnails/${video.ref.name}`);
      const uploadTask = uploadBytesResumable(thumbnailRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress if needed
        },
        (error) => {
          console.error("Thumbnail upload error:", error);
          alert("Failed to upload thumbnail.");
          // Reset uploading state for the specific video
          setUploadingVideos((prevState) => ({
            ...prevState,
            [video.ref.fullPath]: false,
          }));
        },
        async () => {
          const newThumbnailURL = await getDownloadURL(thumbnailRef);

          // Update metadata with new thumbnail URL
          await updateMetadata(video.ref, {
            customMetadata: {
              title: video.name, // Retain existing title
              thumbnail: newThumbnailURL,
            },
          });

          // Update the state
          setVideos((prevVideos) =>
            prevVideos.map((v) =>
              v.ref === video.ref ? { ...v, thumbnail: newThumbnailURL } : v
            )
          );

          alert("Thumbnail updated successfully.");
          // Reset uploading state for the specific video
          setUploadingVideos((prevState) => ({
            ...prevState,
            [video.ref.fullPath]: false,
          }));
        }
      );
    } catch (err) {
      console.error("Error updating thumbnail:", err);
      alert("Failed to update thumbnail.");
      // Reset uploading state for the specific video
      setUploadingVideos((prevState) => ({
        ...prevState,
        [video.ref.fullPath]: false,
      }));
    }
  };

  const handleThumbnailFileChange = (video, event) => {
    const file = event.target.files[0];
    if (file) {
      handleThumbnailUpdate(video, file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white mb-[100px]">
      <h1 className="text-2xl font-bold mb-4 text-center">Video Contents</h1>
      {loading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-4 text-center">
            <p>Total Videos: {filteredVideos.length}</p>
            <p>Total Size: {totalSizeInMB} MB</p>
          </div>
          <div className="mb-4 flex justify-center">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 rounded-md border border-gray-300 text-black"
            >
              <option value="recent">Recently Uploaded</option>
              <option value="biggest">Biggest Size</option>
              <option value="smallest">Smallest Size</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVideos.map((video) => (
              <div
                key={video.ref.fullPath}
                className="bg-white p-2 rounded shadow-sm"
              >
                <div className="w-full h-32 mb-2 rounded overflow-hidden">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video controls src={video.url} className="w-full h-full" />
                  )}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p
                      className="font-semibold truncate text-black"
                      title={video.name}
                    >
                      {video.name}
                    </p>
                    <p className="text-gray-500">{video.sizeInMB} MB</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`thumbnail-${video.ref.fullPath}`}
                      onChange={(e) => handleThumbnailFileChange(video, e)}
                    />
                    <label htmlFor={`thumbnail-${video.ref.fullPath}`}>
                      {uploadingVideos[video.ref.fullPath] ? (
                        <Spin size="small" className="text-blue-500" />
                      ) : (
                        <AiOutlineEdit className="text-sm text-blue-500 cursor-pointer" />
                      )}
                    </label>
                    <button
                      onClick={() => handleDelete(video.ref)}
                      className="text-red-500"
                    >
                      <AiOutlineDelete className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Contents;
