// Importazione delle dipendenze necessarie
import React, { useState } from 'react';
import { Card } from 'react-bootstrap'; 
import FilmPageComponent from './FilmPageComponent';

// Componente che rappresenta una card per un singolo film
const FilmCardComponent = ({ film }) => {
  // State per gestire la visualizzazione del modal con i dettagli del film
  const [showModal, setShowModal] = useState(false);

  // Handler per il click sulla card che mostra il modal
  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Card cliccabile che mostra poster e info base del film */}
      <Card 
        onClick={handleClick} 
        className="mb-4 film-card" 
        style={{ cursor: 'pointer' }}
      >
        {/* Immagine poster del film con fallback se non disponibile */}
        <Card.Img 
          variant="top" 
          src={film.Poster} 
          alt={film.Title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />
        {/* Body della card con titolo e anno del film */}
        <Card.Body>
          <Card.Title className="text-truncate">{film.Title}</Card.Title>
          <Card.Text>{film.Year}</Card.Text>
        </Card.Body>
      </Card>

      {/* Componente modal che mostra i dettagli completi del film */}
      <FilmPageComponent 
        show={showModal}
        onHide={() => setShowModal(false)}
        filmId={film.imdbID}
      />
    </>
  );
};

export default FilmCardComponent;
