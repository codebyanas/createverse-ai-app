import React, { useState } from "react";

const BackgroundRemover = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
  };

  // Convert File/Blob to Base64 String
  const fileToBase64 = (fileData) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(fileData);
    });
  };

  const handleRemoveBg = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      const base64Image = await fileToBase64(file);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_b64: base64Image }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove background");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultImage(url);
    } catch (err) {
      console.error("Background Remover Error:", err);
      setError("Oops! Something went wrong on our end. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement("a");
      a.href = resultImage;
      a.download = "no-bg.png";
      a.click();
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 set">Background Remover Tool</h2>
      <p className="text-center mb-4">
        Upload an image and easily remove its background. You can download the result once the background is removed.
      </p>

      <div className="mb-3 text-center">
        <input
          type="file"
          className="form-control"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
        />
      </div>

      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={handleRemoveBg}
          disabled={!file || loading}
        >
          {loading ? "Removing Background..." : "Remove Background"}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-center text-secondary" aria-live="assertive">
          <p>{error}</p>
        </div>
      )}

      {resultImage && (
        <div className="mt-5 text-center">
          <h2>Processed Image</h2>
          <div className="mt-3" style={{ width: "400px", height: "400px", margin: "0 auto" }}>
            <img
              src={resultImage}
              alt="Processed Result"
              className="img-fluid"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <div className="mt-4">
            <button className="btn btn-success" onClick={handleDownload}>
              Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;