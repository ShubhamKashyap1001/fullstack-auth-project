import React from 'react';

const Spinner = ({ text = 'Loading...' }) => (
  <div className="spinner-container">
    <div className="spinner" />
    <p className="spinner-text">{text}</p>
  </div>
);

export default Spinner;
