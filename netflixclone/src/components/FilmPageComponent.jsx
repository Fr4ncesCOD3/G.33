// Importazione delle dipendenze necessarie da React e React Bootstrap
import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Badge } from 'react-bootstrap';

// Componente che mostra i dettagli di un film in un modal
const FilmPageComponent = ({ show, onHide, filmId }) => {
  const [filmDetails, setFilmDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
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

    if (show) {
      fetchFilmDetails();
    }
  }, [show, filmId]);

  if (!show) return null;
  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered className="film-modal">
        <Modal.Body className="d-flex justify-content-center align-items-center bg-black" style={{ minHeight: '300px' }}>
          <l-mirage size="40" speed="2.5" color="red"></l-mirage>
        </Modal.Body>
      </Modal>
    );
  }
  if (!filmDetails) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="film-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="text-white">{filmDetails.Title} ({filmDetails.Year})</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-black text-white">
        <Row>
          <Col md={4} className="mb-3">
            <img 
              src={filmDetails.Poster} 
              alt={filmDetails.Title} 
              className="img-fluid rounded shadow"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />
          </Col>
          <Col md={8}>
            <h5 className="text-white mb-3">Trama</h5>
            <p className="text-white">{filmDetails.Plot}</p>
            
            <h5 className="text-white mb-3 mt-4">Dettagli</h5>
            <p className="mb-2"><strong className="text-white">Regista:</strong> <span className="text-white">{filmDetails.Director}</span></p>
            <p className="mb-2"><strong className="text-white">Attori:</strong> <span className="text-white">{filmDetails.Actors}</span></p>
            <p className="mb-2"><strong className="text-white">Genere:</strong> <span className="text-white">{filmDetails.Genre}</span></p>
            <p className="mb-4"><strong className="text-white">Durata:</strong> <span className="text-white">{filmDetails.Runtime}</span></p>
            
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
