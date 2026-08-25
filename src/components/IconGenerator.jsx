import React, { useState } from "react";

const IconGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState(null);

  const blobToBase64 = (blobData) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blobData);
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      // Step 1: Generate Base Image via Express API
      const genResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText, prefix: "regular_icon" }),
      });

      if (!genResponse.ok) {
        throw new Error("Failed to generate base icon");
      }

      const generatedBlob = await genResponse.blob();

      // Step 2: Remove Background via Base64 JSON Payload
      await removeBackground(generatedBlob);
      setInputText("");
    } catch (err) {
      console.error("Icon Generator Error Details:", err);
      setError("Oops! Something went wrong on our end. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const removeBackground = async (imageBlob) => {
    const base64Image = await blobToBase64(imageBlob);

    const bgResponse = await fetch("/api/remove-bg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_b64: base64Image }),
    });

    if (bgResponse.ok) {
      const resultBlob = await bgResponse.blob();
      const url = URL.createObjectURL(resultBlob);
      setResultImage(url);
    } else {
      throw new Error("Failed to process background removal");
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement("a");
      a.href = resultImage;
      a.download = "generated_icon.png";
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
    <div className="container mt-5" style={{ paddingBottom: "80px" }}>
      <h2 className="text-center mb-4 set">Generate Icon from Text</h2>
      <p className="text-center mb-4">
        Enter a description of the icon you'd like to generate, such as "A robot holding a sign".
      </p>

      {error && (
        <div className="mt-4 text-center text-secondary" aria-live="assertive">
          <p>{error}</p>
        </div>
      )}

      {resultImage && (
        <div className="mt-5 text-center">
          <h2 className="mb-4">Generated Icon:</h2>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", margin: "0 auto" }}>
            <img src={resultImage} alt="Generated Icon" className="img-fluid" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="mt-3">
            <button className="btn btn-success" onClick={handleDownload}>
              Download Icon
            </button>
          </div>
        </div>
      )}

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

export default IconGenerator;