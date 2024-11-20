import React, { useState } from 'react';

const IconGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultImage, setResultImage] = useState(null); // For the processed image
  const huggingfacetoken = import.meta.env.VITE_HUGGING_FACE_TOKEN;
  const bgremoverapi = import.meta.env.VITE_REMOVE_BACKGROUND_API_KEY;

  async function query(data) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          headers: {
            Authorization: `Bearer ${huggingfacetoken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to generate image.');
      }

      const result = await response.blob();
      return URL.createObjectURL(result);
    } catch (err) {
      throw err;
    }
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResultImage(null); // Reset the processed image

    const searchText = `${inputText}, regular_icon`;

    try {
      const imgUrl = await query({ inputs: searchText });
      await removeBackground(imgUrl); // Automatically remove background
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const removeBackground = async (imgUrl) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image_file', blob);
      formData.append('size', 'auto');

      const bgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': `${bgremoverapi}` },
        body: formData,
      });

      if (bgResponse.ok) {
        const resultBlob = await bgResponse.blob();
        const url = URL.createObjectURL(resultBlob);
        setResultImage(url);
      } else {
        throw new Error(`${bgResponse.status}: ${bgResponse.statusText}`);
      }
    } catch (error) {
      console.error('Error removing background:', error);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement('a');
      a.href = resultImage;
      a.download = 'generated_icon.png'; // Filename for the download
      a.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default Enter key behavior (like form submission)
      if (!loading && inputText.trim()) {
        handleGenerate();
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 set">Generate Icon from Text</h2>
      <p className="text-center mb-4">
        Enter a description of the icon you'd like to generate, such as "A robot holding a sign".
      </p>

      <div className="text-center mb-5">
        {error && (
          <div className="mt-4" aria-live="assertive">
            <p>Oops! Something went wrong on our end. Please try again later.</p>
          </div>
        )}
      </div>

      {resultImage && (
        <div className="mt-5 text-center">
          <h2 className="mb-4">Generated Icon:</h2>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto' }}>
            <img src={resultImage} alt="Generated Icon" className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="mt-3">
            <button className="btn btn-success" onClick={handleDownload}>
              Download Icon
            </button>
          </div>
        </div>
      )}

      {/* Fixed input and button at the bottom */}
              {/* Search bar at the bottom */}
              <div
          className="input-container d-flex justify-content-center align-items-center"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #dee2e6',
            zIndex: 1000, // Ensure it's on top
          }}
        >
          <div className="d-flex w-100">
            <input
              type="text"
              className="form-control me-2 flex-grow-1"
              placeholder="Message EditPro Studio"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown} // Add onKeyDown event handler
            />
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              style={{ marginLeft: '10px' }}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

    </div>
  );
};

export default IconGenerator;
