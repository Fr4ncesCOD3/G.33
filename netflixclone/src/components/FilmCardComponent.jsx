// Importazione delle dipendenze necessarie
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap'; 
import FilmPageComponent from './FilmPageComponent';
import { BsPlus, BsCheck2, BsX } from 'react-icons/bs'; // Importa le icone per i pulsanti di salvataggio
import { motion } from 'framer-motion'; // Importa framer-motion per le animazioni
import { useNavigate } from 'react-router-dom';

/**
 * Componente che rappresenta una card per un singolo film
 * @param {Object} film - Oggetto contenente i dati del film
 * @param {Function} onRemove - Funzione callback per rimuovere il film dalla lista dei salvati
 */
const FilmCardComponent = ({ film, onRemove }) => {
  // Aggiunto hook useNavigate per la navigazione programmatica
  const navigate = useNavigate();
  
  // State per gestire la visualizzazione del modal con i dettagli del film
  const [showModal, setShowModal] = useState(false);
  
  // State per gestire lo stato di salvataggio del film, inizializzato controllando il localStorage
  // Modificato per verificare se il film è già salvato all'avvio
  const [isSaved, setIsSaved] = useState(() => {
    const savedFilms = JSON.parse(localStorage.getItem('savedFilms')) || [];
    return savedFilms.some(savedFilm => savedFilm.imdbID === film.imdbID);
  });
  
  // Aggiunto state per gestire l'hover sulla card e migliorare l'UX
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handler per aprire il modal con i dettagli del film
   * Modificato per usare la navigazione invece del modal
   */
  const handleClick = () => {
    navigate(`/movie-details/${film.imdbID}`);
  };

  /**
   * Handler per gestire il salvataggio/rimozione del film
   * Migliorato per gestire sia il salvataggio che la rimozione
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
    // Wrapper con animazioni per la card - Aggiunto motion.div per animazioni fluide
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
      {/* Migliorato il layout con dimensioni fisse per uniformità */}
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
        {/* Container per il poster con overlay al hover - Migliorata la gestione delle immagini */}
        <div className="film-poster-container">
          <Card.Img 
            variant="top" 
            src={film.Poster} 
            alt={film.Title}
            className="film-poster"
            onError={(e) => {
              // Aggiunto fallback image se il poster non è disponibile
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />
          {/* Overlay animato che appare al hover con il pulsante di salvataggio */}
          {/* Migliorata l'animazione dell'overlay */}
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
              {/* Aggiunta logica condizionale per mostrare l'icona corretta */}
              {isSaved ? (
                onRemove ? <BsX size={20} /> : <BsCheck2 size={20} />
              ) : (
                <BsPlus size={20} />
              )}
            </Button>
          </motion.div>
        </div>
        {/* Body della card con titolo e anno - Migliorato il layout */}
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title className="text-truncate text-white">{film.Title}</Card.Title>
            <Card.Text className="text-white-50">{film.Year}</Card.Text>
          </div>
        </Card.Body>
      </Card>

      {/* Modal con i dettagli completi del film */}
      {/* Mantenuto per retrocompatibilità ma non più utilizzato attivamente */}
      <FilmPageComponent 
        show={showModal}
        onHide={() => setShowModal(false)}
        filmId={film.imdbID}
      />
    </motion.div>
  );
};

export default FilmCardComponent;
