import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const PdfGenerator = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    // Filter out non-image files (JPEG and PNG only)
    const imageFiles = files.filter(file => 
      file.type === "image/jpeg" || file.type === "image/png"
    );

    if (imageFiles.length !== files.length) {
      alert("Only JPEG and PNG images are allowed!");
    }

    const imagePromises = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => setSelectedImages(images));
  };

  const generatePDF = async () => {
    setLoading(true);
    const pdfDoc = await PDFDocument.create();

    for (const imgSrc of selectedImages) {
      const imgBytes = await fetch(imgSrc).then((res) => res.arrayBuffer());

      // Detect image type based on the Data URL
      let img;
      if (imgSrc.startsWith("data:image/png")) {
        img = await pdfDoc.embedPng(imgBytes); // Embed PNG
      } else if (imgSrc.startsWith("data:image/jpeg") || imgSrc.startsWith("data:image/jpg")) {
        img = await pdfDoc.embedJpg(imgBytes); // Embed JPEG
      } else {
        alert("Unsupported image format! Please upload PNG or JPEG images.");
        continue; // Skip unsupported image types
      }

      // Get the natural dimensions of the image
      const imgDims = await new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.src = imgSrc;
      });

      // Create a new page with appropriate size based on the image
      const page = pdfDoc.addPage([imgDims.width, imgDims.height]);

      // Draw the image on the page
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: imgDims.width,
        height: imgDims.height,
      });
    }

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    const link = document.createElement("a");
    link.href = pdfDataUri;
    link.download = "download.pdf";
    link.click();
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 my-5">Generate PDF from Your Images</h2>
      <p className="text-center mb-4">
        Upload multiple images to create a downloadable PDF document.
      </p>
      <div className="mb-3">
        <input
          type="file"
          accept="image/jpeg, image/png" // Specify only JPEG and PNG files
          multiple
          onChange={handleImageChange}
          className="form-control"
        />
      </div>

      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={generatePDF}
          disabled={selectedImages.length === 0 || loading}
        >
          {loading ? 'Downloading...' : 'Download as PDF'}
        </button>
      </div>

      <div className="row">
        {selectedImages.map((image, index) => (
          <div
            key={index}
            className="col-md-4 my-3"
            style={{ maxHeight: '200px', overflow: 'hidden' }}
          >
            <img src={image} alt={`Selected ${index}`} className="img-fluid" style={{ height: '100%', width: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfGenerator;
