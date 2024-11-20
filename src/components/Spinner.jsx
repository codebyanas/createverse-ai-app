import React from 'react';
import loading from './loading.gif' // Ensure this path points to the actual GIF file

export default function Spinner() {
  return (
    <div className=" text-center">
      <img className="loading" src={loading} alt="Loading..." />
      <p className="">Loading news...</p>
    </div>
  );
}
