// Importazione delle dipendenze necessarie da React e React Bootstrap
import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Badge } from 'react-bootstrap';

// Componente che mostra i dettagli di un film in un modal
const FilmPageComponent = ({ show, onHide, filmId }) => {
  // State per memorizzare i dettagli del film e lo stato di caricamento
  const [filmDetails, setFilmDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect hook per recuperare i dettagli del film quando il modal viene aperto
  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        // Chiamata API a OMDB per ottenere i dettagli del film
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=3cccd910&i=${filmId}&plot=full`
        );
        const data = await response.json();
        if (data.Response === "True") {
          setFilmDetails(data);
        }
      } catch (error) {
        console.error('Errore nel recupero dei dettagli del film:', error);
      } finally {
        setLoading(false);
      }
    };

    // Esegui la chiamata API solo quando il modal è visibile
    if (show) {
      fetchFilmDetails();
    }
  }, [show, filmId]);

  // Gestione dei diversi stati del componente
  if (!show) return null; // Non renderizzare nulla se il modal è nascosto
  if (loading) return <Modal show={show} onHide={onHide}><Modal.Body>Caricamento...</Modal.Body></Modal>;
  if (!filmDetails) return null;

  // Rendering del modal con i dettagli del film
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      {/* Header del modal con titolo del film e anno */}
      <Modal.Header closeButton>
        <Modal.Title>{filmDetails.Title} ({filmDetails.Year})</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row>
          {/* Colonna sinistra con il poster del film */}
          <Col md={4}>
            <img 
              src={filmDetails.Poster} 
              alt={filmDetails.Title} 
              className="img-fluid rounded"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />
          </Col>
          {/* Colonna destra con i dettagli del film */}
          <Col md={8}>
            {/* Sezione trama */}
            <h5 className="text-white mb-3">Trama</h5>
            <p className="text-muted">{filmDetails.Plot}</p>
            
            {/* Sezione dettagli tecnici */}
            <h5 className="text-white mb-3 mt-4">Dettagli</h5>
            <p className="mb-2"><strong className="text-white">Regista:</strong> <span className="text-muted">{filmDetails.Director}</span></p>
            <p className="mb-2"><strong className="text-white">Attori:</strong> <span className="text-muted">{filmDetails.Actors}</span></p>
            <p className="mb-2"><strong className="text-white">Genere:</strong> <span className="text-muted">{filmDetails.Genre}</span></p>
            <p className="mb-4"><strong className="text-white">Durata:</strong> <span className="text-muted">{filmDetails.Runtime}</span></p>
            
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
