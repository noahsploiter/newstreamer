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

const StoryAdmin = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("recent");
  const [totalSizeInMB, setTotalSizeInMB] = useState(0);
  const [uploadingThumbnails, setUploadingThumbnails] = useState({});

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const listRef = ref(storage, "storys");
        const res = await listAll(listRef);
        const storyPromises = res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          const sizeInMB = (metadata.size / (1024 * 1024)).toFixed(2);
          const creationTime = new Date(metadata.timeCreated);
          const storyTitle = metadata.customMetadata?.title || "New Story";
          const thumbnailURL = metadata.customMetadata?.thumbnail;

          return {
            name: storyTitle,
            url,
            ref: itemRef,
            sizeInMB: parseFloat(sizeInMB),
            creationTime,
            thumbnail: thumbnailURL,
          };
        });

        const storyList = await Promise.all(storyPromises);
        setStories(storyList);
        sortStories(storyList, sortOption);

        const totalSize = storyList.reduce(
          (sum, story) => sum + story.sizeInMB,
          0
        );
        setTotalSizeInMB(totalSize.toFixed(2));
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleDelete = async (storyRef) => {
    try {
      await deleteObject(storyRef);
      setStories((prevStories) =>
        prevStories.filter((s) => s.ref !== storyRef)
      );
      alert("Story deleted successfully.");
    } catch (err) {
      console.error("Error deleting story:", err);
      alert("Failed to delete story.");
    }
  };

  const sortStories = (stories, option) => {
    let sortedStories = [];
    switch (option) {
      case "recent":
        sortedStories = [...stories].sort(
          (a, b) => b.creationTime - a.creationTime
        );
        break;
      case "biggest":
        sortedStories = [...stories].sort((a, b) => b.sizeInMB - a.sizeInMB);
        break;
      case "smallest":
        sortedStories = [...stories].sort((a, b) => a.sizeInMB - b.sizeInMB);
        break;
      default:
        sortedStories = stories;
    }
    setFilteredStories(sortedStories);
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    sortStories(stories, newSortOption);
  };

  const handleThumbnailUpdate = async (story, file) => {
    if (!file) {
      alert("Please select a thumbnail image file.");
      return;
    }

    setUploadingThumbnails((prevState) => ({
      ...prevState,
      [story.ref.fullPath]: true,
    }));

    try {
      const thumbnailRef = ref(storage, `storythumbnails/${story.ref.name}`);
      const uploadTask = uploadBytesResumable(thumbnailRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress if needed
        },
        (error) => {
          console.error("Thumbnail upload error:", error);
          alert("Failed to upload thumbnail.");
          setUploadingThumbnails((prevState) => ({
            ...prevState,
            [story.ref.fullPath]: false,
          }));
        },
        async () => {
          const newThumbnailURL = await getDownloadURL(thumbnailRef);

          await updateMetadata(story.ref, {
            customMetadata: {
              title: story.name,
              thumbnail: newThumbnailURL,
            },
          });

          setStories((prevStories) =>
            prevStories.map((s) =>
              s.ref === story.ref ? { ...s, thumbnail: newThumbnailURL } : s
            )
          );

          alert("Thumbnail updated successfully.");
          setUploadingThumbnails((prevState) => ({
            ...prevState,
            [story.ref.fullPath]: false,
          }));
        }
      );
    } catch (err) {
      console.error("Error updating thumbnail:", err);
      alert("Failed to update thumbnail.");
      setUploadingThumbnails((prevState) => ({
        ...prevState,
        [story.ref.fullPath]: false,
      }));
    }
  };

  const handleThumbnailFileChange = (story, event) => {
    const file = event.target.files[0];
    if (file) {
      handleThumbnailUpdate(story, file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white mb-[100px]">
      <h1 className="text-2xl font-bold mb-4 text-center">Story Contents</h1>
      {loading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-4 text-center">
            <p>Total Stories: {filteredStories.length}</p>
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
            {filteredStories.map((story) => (
              <div
                key={story.ref.fullPath}
                className="bg-white p-2 rounded shadow-sm"
              >
                <div className="w-full h-32 mb-2 rounded overflow-hidden">
                  {story.thumbnail ? (
                    <img
                      src={story.thumbnail}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video controls src={story.url} className="w-full h-full" />
                  )}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p
                      className="font-semibold truncate text-black"
                      title={story.name}
                    >
                      {story.name}
                    </p>
                    <p className="text-gray-500">{story.sizeInMB} MB</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`thumbnail-${story.ref.fullPath}`}
                      onChange={(e) => handleThumbnailFileChange(story, e)}
                    />
                    <label htmlFor={`thumbnail-${story.ref.fullPath}`}>
                      {uploadingThumbnails[story.ref.fullPath] ? (
                        <Spin size="small" className="text-blue-500" />
                      ) : (
                        <AiOutlineEdit className="text-sm text-blue-500 cursor-pointer" />
                      )}
                    </label>
                    <button
                      onClick={() => handleDelete(story.ref)}
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

export default StoryAdmin;
