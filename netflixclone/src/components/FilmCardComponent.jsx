// Importazione delle dipendenze necessarie
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap'; 
import FilmPageComponent from './FilmPageComponent';
import { BsPlus, BsCheck2, BsX } from 'react-icons/bs'; // Importa le icone per i pulsanti di salvataggio
import { motion } from 'framer-motion'; // Importa framer-motion per le animazioni

/**
 * Componente che rappresenta una card per un singolo film
 * @param {Object} film - Oggetto contenente i dati del film
 * @param {Function} onRemove - Funzione callback per rimuovere il film dalla lista dei salvati
 */
const FilmCardComponent = ({ film, onRemove }) => {
  // State per gestire la visualizzazione del modal con i dettagli del film
  const [showModal, setShowModal] = useState(false);
  
  // State per gestire lo stato di salvataggio del film, inizializzato controllando il localStorage
  const [isSaved, setIsSaved] = useState(() => {
    const savedFilms = JSON.parse(localStorage.getItem('savedFilms')) || [];
    return savedFilms.some(savedFilm => savedFilm.imdbID === film.imdbID);
  });
  
  // State per gestire l'hover sulla card
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handler per aprire il modal con i dettagli del film
   */
  const handleClick = () => {
    setShowModal(true);
  };

  /**
   * Handler per gestire il salvataggio/rimozione del film
   * @param {Event} e - Evento del click
   */
  const handleSaveFilm = (e) => {
    e.stopPropagation(); // Previene l'apertura del modal quando si clicca sul pulsante di salvataggio
    const savedFilms = JSON.parse(localStorage.getItem('savedFilms')) || [];
    
    if (isSaved) {
      // Rimuove il film dalla lista dei salvati
      const updatedFilms = savedFilms.filter(savedFilm => savedFilm.imdbID !== film.imdbID);
      localStorage.setItem('savedFilms', JSON.stringify(updatedFilms));
      setIsSaved(false);
      
      // Se siamo nella pagina profilo, chiamiamo onRemove per aggiornare l'UI
      if (onRemove) {
        onRemove(film.imdbID);
      }
    } else {
      // Aggiunge il film alla lista dei salvati
      savedFilms.push(film);
      localStorage.setItem('savedFilms', JSON.stringify(savedFilms));
      setIsSaved(true);
    }
  };

  return (
    // Wrapper con animazioni per la card
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
          width: '250px',  // Larghezza fissa per uniformità
          height: '400px', // Altezza fissa per uniformità
          margin: 'auto'
        }}
      >
        {/* Container per il poster con overlay al hover */}
        <div className="film-poster-container">
          <Card.Img 
            variant="top" 
            src={film.Poster} 
            alt={film.Title}
            className="film-poster"
            onError={(e) => {
              // Fallback image se il poster non è disponibile
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />
          {/* Overlay animato che appare al hover con il pulsante di salvataggio */}
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
              {/* Mostra icona appropriata in base allo stato di salvataggio */}
              {isSaved ? (
                onRemove ? <BsX size={20} /> : <BsCheck2 size={20} />
              ) : (
                <BsPlus size={20} />
              )}
            </Button>
          </motion.div>
        </div>
        {/* Body della card con titolo e anno */}
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title className="text-truncate text-white">{film.Title}</Card.Title>
            <Card.Text className="text-white-50">{film.Year}</Card.Text>
          </div>
        </Card.Body>
      </Card>

      {/* Modal con i dettagli completi del film */}
      <FilmPageComponent 
        show={showModal}
        onHide={() => setShowModal(false)}
        filmId={film.imdbID}
      />
    </motion.div>
  );
};

export default FilmCardComponent;
