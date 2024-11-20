import React, { useState } from 'react';

const BackgroundRemover = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const bgremoverapi = 'rksVHYCc6MWNT3Mbux3PGUbc';

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRemoveBg = async () => {
    // eslint-disable-next-line
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', file);

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': `${bgremoverapi}` },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setResultImage(url);
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement('a');
      a.href = resultImage;
      a.download = 'no-bg.png'; // Set the filename for the download
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
          disabled={!file || loading} // Disabled if no file is selected or if loading
        >
          {loading ? 'Removing Background...' : 'Remove Background'}
        </button>
      </div>


      {resultImage && (
        <div className="mt-5 text-center">
          <h2>Processed Image</h2>
          <div className="mt-3" style={{ width: '400px', height: '400px', margin: '0 auto' }}>
            <img
              src={resultImage}
              alt="Processed Image"
              className="img-fluid"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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