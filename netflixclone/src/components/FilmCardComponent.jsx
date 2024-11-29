// Importazione delle dipendenze necessarie
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap'; 
import FilmPageComponent from './FilmPageComponent';
import { BsPlus, BsCheck2, BsX } from 'react-icons/bs'; // Importa le icone
import { motion, AnimatePresence } from 'framer-motion'; // Importa framer-motion

// Componente che rappresenta una card per un singolo film
const FilmCardComponent = ({ film, onRemove }) => {
  // State per gestire la visualizzazione del modal con i dettagli del film
  const [showModal, setShowModal] = useState(false);
  const [isSaved, setIsSaved] = useState(() => {
    const savedFilms = JSON.parse(localStorage.getItem('savedFilms')) || [];
    return savedFilms.some(savedFilm => savedFilm.imdbID === film.imdbID);
  });
  const [isHovered, setIsHovered] = useState(false);

  // Handler per il click sulla card che mostra il modal
  const handleClick = () => {
    setShowModal(true);
  };

  const handleSaveFilm = (e) => {
    e.stopPropagation(); // Previene l'apertura del modal
    const savedFilms = JSON.parse(localStorage.getItem('savedFilms')) || [];
    
    if (isSaved) {
      const updatedFilms = savedFilms.filter(savedFilm => savedFilm.imdbID !== film.imdbID);
      localStorage.setItem('savedFilms', JSON.stringify(updatedFilms));
      setIsSaved(false);
      
      // Se siamo nella pagina profilo, chiamiamo onRemove
      if (onRemove) {
        onRemove(film.imdbID);
      }
    } else {
      savedFilms.push(film);
      localStorage.setItem('savedFilms', JSON.stringify(savedFilms));
      setIsSaved(true);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Card cliccabile che mostra poster e info base del film */}
      <Card 
        onClick={handleClick} 
        className="film-card bg-black text-white-50" 
        style={{ 
          cursor: 'pointer',
          width: '250px',  // Larghezza fissa
          height: '400px', // Altezza fissa
          margin: 'auto'
        }}
      >
        <div className="film-poster-container">
          <Card.Img 
            variant="top" 
            src={film.Poster} 
            alt={film.Title}
            className="film-poster"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="film-card-overlay"
          >
            <Button
              variant={isSaved ? "danger" : "light"}
              size="sm"
              className="save-button"
              onClick={handleSaveFilm}
            >
              {isSaved ? (
                onRemove ? <BsX size={20} /> : <BsCheck2 size={20} />
              ) : (
                <BsPlus size={20} />
              )}
            </Button>
          </motion.div>
        </div>
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title className="text-truncate text-white">{film.Title}</Card.Title>
            <Card.Text className="text-white-50">{film.Year}</Card.Text>
          </div>
        </Card.Body>
      </Card>

      {/* Componente modal che mostra i dettagli completi del film */}
      <FilmPageComponent 
        show={showModal}
        onHide={() => setShowModal(false)}
        filmId={film.imdbID}
      />
    </motion.div>
  );
};

export default FilmCardComponent;
