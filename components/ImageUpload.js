import React, { useState, useRef } from "react";
import { uploadFile } from "../lib/api";
import Image from "next/image";

const ImageUpload = ({
  currentImage,
  onImageUpload,
  label = "Upload Image",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewImage, setPreviewImage] = useState(currentImage || "");
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // Create a local preview URL
      const localPreview = URL.createObjectURL(file);
      setPreviewImage(localPreview);

      // Create a FormData object for the file upload
      console.log("Uploading file to server...");
      const result = await uploadFile(file);
      console.log("Upload successful, result:", result);

      // Call the callback with the uploaded image URL
      onImageUpload(result.fileUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
      setPreviewImage(currentImage || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload-container">
      <label className="upload-label">{label}</label>

      <div className="upload-area">
        {previewImage ? (
          <div className="preview-container">
            <Image
              src={previewImage}
              alt="Preview"
              className="preview-image"
              fill={true}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p>Click to select an image</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
          ref={fileInputRef}
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="upload-loading">
          <div className="spinner"></div>
          <span>Uploading...</span>
        </div>
      )}

      {uploadError && <div className="upload-error">{uploadError}</div>}

      <style jsx>{`
        .image-upload-container {
          margin-bottom: 1.5rem;
        }

        .upload-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .upload-area {
          position: relative;
          width: 100%;
          min-height: 200px;
          border: 2px dashed var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.3s ease;
          cursor: pointer;
        }

        .upload-area:hover {
          border-color: var(--primary-color);
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--text-secondary);
        }

        .upload-placeholder svg {
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }

        .preview-container {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: background 0.3s ease;
          z-index: 2;
        }

        .remove-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        }

        .upload-loading {
          display: flex;
          align-items: center;
          margin-top: 0.5rem;
          color: var(--text-secondary);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--text-secondary);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          margin-right: 0.5rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .upload-error {
          margin-top: 0.5rem;
          color: var(--error-color);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
