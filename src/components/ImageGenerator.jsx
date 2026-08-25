import React, { useState } from "react";

const ImageGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setImage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const imageBlob = await response.blob();
      const imgUrl = URL.createObjectURL(imageBlob);
      setImage(imgUrl);
      setInputText("");
    } catch (err) {
      console.error(err);
      setError("Oops! Something went wrong on our end. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (image) {
      const a = document.createElement("a");
      a.href = image;
      a.download = "generated-image.png";
      a.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!loading && inputText.trim()) {
        handleGenerate();
      }
    }
  };

  return (
    <div className="container d-flex flex-column page-e" style={{ paddingBottom: "80px" }}>
      <h2 className="text-center mb-4">Generate Image from Text</h2>
      <p className="text-center mb-4">
        Enter a description of the image you'd like to generate, such as "Astronaut riding a horse".
      </p>

      <div className="generated-image-container" style={{ flex: 1 }}>
        {error && (
          <div className="mt-4 text-center text-secondary" aria-live="assertive">
            <p>{error}</p>
          </div>
        )}

        {image && (
          <div className="mt-5 text-center">
            <h2>Generated Image</h2>
            <img
              src={image}
              alt="Generated"
              className="img-fluid mt-3"
              style={{ objectFit: "contain" }}
            />
            <div className="mt-3">
              <button className="btn btn-success" onClick={handleDownload}>
                Download Image
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="input-container d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #dee2e6",
          zIndex: 1000,
        }}
      >
        <div className="d-flex w-100">
          <input
            type="text"
            className="form-control me-2 flex-grow-1"
            placeholder="Message Createverse"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading || !inputText.trim()}
            style={{ marginLeft: "10px" }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;