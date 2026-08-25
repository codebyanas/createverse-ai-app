import React, { useState } from 'react';
import { InferenceClient } from '@huggingface/inference';

const hf = new InferenceClient(import.meta.env.VITE_HUGGING_FACE_TOKEN);

const IconGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const bgremoverapi = import.meta.env.VITE_REMOVE_BACKGROUND_API_KEY;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResultImage(null);

    const searchText = `${inputText}, regular_icon`;

    try {
      const responseBlob = await hf.textToImage({
        model: 'black-forest-labs/FLUX.1-schnell',
        inputs: searchText,
      });

      const imgUrl = URL.createObjectURL(responseBlob);
      await removeBackground(imgUrl);
      setInputText('');
    } catch (err) {
      console.error('Icon Generator HF Error Details:', err);
      setError('Oops! Something went wrong on our end. Please try again later.');
    } finally {
      setLoading(false);
    }
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
    } catch (err) {
      console.error('Error removing background:', err);
      setError('Oops! Something went wrong on our end. Please try again later.');
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement('a');
      a.href = resultImage;
      a.download = 'generated_icon.png';
      a.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!loading && inputText.trim()) {
        handleGenerate();
      }
    }
  };

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
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
          zIndex: 1000,
        }}
      >
        <div className="d-flex w-100">
          <input
            type="text"
            className="form-control me-2 flex-grow-1"
            placeholder="Message Createverse "
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
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