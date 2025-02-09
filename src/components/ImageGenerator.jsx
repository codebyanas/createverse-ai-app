import React, { useState } from 'react';

const ImageGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const huggingfacetoken = import.meta.env.VITE_HUGGING_FACE_TOKEN

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
    setImage(null);

    try {
      const imgUrl = await query({ inputs: inputText });
      setImage(imgUrl);
      setInputText(''); // Clear the input field after successful image generation
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleDownload = () => {
    if (image) {
      const a = document.createElement('a');
      a.href = image;
      a.download = 'generated-image.png'; // Filename for the download
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
    <>
      <div className="container d-flex flex-column page-e" style={{ paddingBottom: '80px' }}> {/* Add padding-bottom */}
        <h2 className="text-center mb-4 ">Generate Image from Text</h2>
        <p className="text-center mb-4">
          Enter a description of the image you'd like to generate, such as "Astronaut riding a horse".
        </p>

        <div className="generated-image-container" style={{ flex: 1 }}>
          {error && (
            <div className="mt-4 text-center" aria-live="assertive">
              <p>Oops! Something went wrong on our end. Please try again later.</p>
            </div>
          )}

          {image && (
            <div className="mt-5 text-center">
              <h2>Generated Image</h2>
              <img
                src={image}
                alt="Generated"
                className="img-fluid mt-3"
                style={{ objectFit: 'contain' }}
              />
              <div className="mt-3">
                <button className="btn btn-success" onClick={handleDownload}>
                  Download Image
                </button>
              </div>
            </div>
          )}
        </div>

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
              placeholder="Message Createverse "
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
    </>
  );
};

export default ImageGenerator;
