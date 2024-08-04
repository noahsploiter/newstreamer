// src/components/VideoUploader.js
import React, { useState } from "react";
import { storage } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  updateMetadata,
} from "firebase/storage";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";

const VideoUploader = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !thumbnail) {
      alert("Please select both a video file and a thumbnail image.");
      return;
    }

    setIsUploading(true);

    const videoRef = ref(storage, `videos/${file.name}`);
    const thumbnailRef = ref(storage, `thumbnails/${thumbnail.name}`);

    try {
      // Upload the video
      const videoUploadTask = uploadBytesResumable(videoRef, file);
      videoUploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => {
          console.error("Video upload error:", error);
          setUploadStatus("Video upload failed.");
        }
      );

      await videoUploadTask;

      // Upload the thumbnail
      const thumbnailUploadTask = uploadBytesResumable(thumbnailRef, thumbnail);
      await thumbnailUploadTask;

      const videoURL = await getDownloadURL(videoUploadTask.snapshot.ref);
      const thumbnailURL = await getDownloadURL(
        thumbnailUploadTask.snapshot.ref
      );

      const videoTitle = title || "New Video";

      // Update the metadata with the custom title and thumbnail URL
      const metadata = {
        customMetadata: {
          title: videoTitle,
          thumbnail: thumbnailURL,
        },
      };

      await updateMetadata(videoRef, metadata);

      setUploadStatus("Upload successful!");
      setFile(null);
      setThumbnail(null);
      setTitle("");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDelete = () => {
    setFile(null);
    setThumbnail(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Video</h1>
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer mb-4 ${
          dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
        />
        <AiOutlineCloudUpload className="text-5xl mx-auto mb-2 text-gray-400" />
        <p className="text-gray-500">
          Drag & drop your video file here, or click to select a file
        </p>
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          Choose file
        </button>
      </div>
      {file && (
        <div className="mt-4">
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow">
            <div className="flex items-center space-x-2">
              <p className="text-gray-800">{file.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">{progress}%</p>
              <AiOutlineDelete
                className="cursor-pointer text-red-500"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter video title"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md mb-4 mt-4"
      />
      <div className="mb-4">
        <label
          htmlFor="thumbnail"
          className="block text-sm font-medium text-gray-700"
        >
          Thumbnail Image
        </label>
        <input
          type="file"
          id="thumbnail"
          onChange={handleThumbnailChange}
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || !thumbnail || isUploading}
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          isUploading ? "cursor-not-allowed bg-blue-300" : ""
        }`}
      >
        {isUploading ? "Uploading..." : "Upload Video"}
      </button>
      {uploadStatus && (
        <p className="text-center mt-4 text-green-500">{uploadStatus}</p>
      )}
    </div>
  );
};

export default VideoUploader;
