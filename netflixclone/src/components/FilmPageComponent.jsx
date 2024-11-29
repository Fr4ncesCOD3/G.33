// Importazione delle dipendenze necessarie da React e React Bootstrap
import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Badge } from 'react-bootstrap';

/**
 * Componente che mostra i dettagli di un film in un modal
 * @param {boolean} show - Controlla la visibilità del modal
 * @param {function} onHide - Funzione per chiudere il modal
 * @param {string} filmId - ID del film da visualizzare
 */
const FilmPageComponent = ({ show, onHide, filmId }) => {
  // State per memorizzare i dettagli del film
  const [filmDetails, setFilmDetails] = useState(null);
  // State per gestire lo stato di caricamento
  const [loading, setLoading] = useState(true);

  // Effect per recuperare i dettagli del film quando il modal viene aperto
  useEffect(() => {
    /**
     * Funzione asincrona per recuperare i dettagli del film dall'API OMDB
     */
    const fetchFilmDetails = async () => {
      try {
        // Chiamata API a OMDB
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=3cccd910&i=${filmId}&plot=full`
        );
        const data = await response.json();
        // Aggiorna lo state solo se la risposta è valida
        if (data.Response === "True") {
          setFilmDetails(data);
        }
      } catch (error) {
        console.error('Errore nel recupero dei dettagli del film:', error);
      } finally {
        // Imposta loading a false sia in caso di successo che di errore
        setLoading(false);
      }
    };

    // Esegue il fetch solo quando il modal è visibile
    if (show) {
      fetchFilmDetails();
    }
  }, [show, filmId]);

  // Non renderizza nulla se il modal non deve essere mostrato
  if (!show) return null;
  
  // Mostra un loader durante il caricamento dei dati
  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered className="film-modal">
        <Modal.Body className="d-flex justify-content-center align-items-center bg-black" style={{ minHeight: '300px' }}>
          <l-mirage size="40" speed="2.5" color="red"></l-mirage>
        </Modal.Body>
      </Modal>
    );
  }
  
  // Non renderizza nulla se non ci sono dettagli del film
  if (!filmDetails) return null;

  // Renderizza il modal con i dettagli del film
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="film-modal">
      {/* Header del modal con titolo del film e anno */}
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="text-white">{filmDetails.Title} ({filmDetails.Year})</Modal.Title>
      </Modal.Header>
      
      {/* Body del modal con i dettagli del film */}
      <Modal.Body className="p-4 bg-black text-white">
        <Row>
          {/* Colonna sinistra con il poster del film */}
          <Col md={4} className="mb-3">
            <img 
              src={filmDetails.Poster} 
              alt={filmDetails.Title} 
              className="img-fluid rounded shadow"
              onError={(e) => {
                // Fallback image se il poster non è disponibile
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />
          </Col>
          
          {/* Colonna destra con trama e dettagli */}
          <Col md={8}>
            {/* Sezione trama */}
            <h5 className="text-white mb-3">Trama</h5>
            <p className="text-white">{filmDetails.Plot}</p>
            
            {/* Sezione dettagli tecnici */}
            <h5 className="text-white mb-3 mt-4">Dettagli</h5>
            <p className="mb-2"><strong className="text-white">Regista:</strong> <span className="text-white">{filmDetails.Director}</span></p>
            <p className="mb-2"><strong className="text-white">Attori:</strong> <span className="text-white">{filmDetails.Actors}</span></p>
            <p className="mb-2"><strong className="text-white">Genere:</strong> <span className="text-white">{filmDetails.Genre}</span></p>
            <p className="mb-4"><strong className="text-white">Durata:</strong> <span className="text-white">{filmDetails.Runtime}</span></p>
            
            {/* Sezione valutazioni con badge colorati */}
            <h5 className="text-white mb-3">Valutazioni</h5>
            {filmDetails.Ratings.map((rating, index) => (
              <Badge 
                key={index} 
                bg="danger" 
                className="me-2 mb-2"
              >
                {rating.Source}: {rating.Value}
              </Badge>
            ))}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default FilmPageComponent;
