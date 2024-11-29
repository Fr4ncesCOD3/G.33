// Importazione delle dipendenze necessarie
import React from 'react';
import { mirage } from 'ldrs'; // Importazione del componente loader mirage
import '../App.css';

// Registrazione del componente mirage per l'utilizzo
mirage.register();

/**
 * Componente che mostra un loader o un messaggio di errore
 * @param {boolean} error - Flag che indica se c'è stato un errore
 * @returns {JSX.Element} Il componente loader renderizzato
 */
const LoaderComponent = ({ error }) => {
  return (
    // Container principale del loader
    <div className="loader-container">
      {error ? (
        // Contenuto mostrato in caso di errore
        <div className="error-container">
          {/* Logo Netflix */}
          <img 
            src="/netflix_logo.png" 
            alt="Netflix Logo" 
            className="netflix-logo-error"
          />
          {/* Messaggio di errore */}
          <div className="error-message">
            <h2>Failed Connection</h2>
            <p>Try again</p>
          </div>
        </div>
      ) : (
        // Loader animato mostrato durante il caricamento
        <l-mirage
          size="60"
          speed="2.5"
          color="red"
        ></l-mirage>
      )}
    </div>
  );
};

// Esportazione del componente
export default LoaderComponent;
