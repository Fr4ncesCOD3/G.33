import React from 'react';
import { mirage } from 'ldrs';
import '../App.css';

mirage.register();

const LoaderComponent = ({ error }) => {
  return (
    <div className="loader-container">
      {error ? (
        <div className="error-container">
          <img 
            src="/netflix_logo.png" 
            alt="Netflix Logo" 
            className="netflix-logo-error"
          />
          <div className="error-message">
            <h2>Failed Connection</h2>
            <p>Try again</p>
          </div>
        </div>
      ) : (
        <l-mirage
          size="60"
          speed="2.5"
          color="red"
        ></l-mirage>
      )}
    </div>
  );
};

export default LoaderComponent;
