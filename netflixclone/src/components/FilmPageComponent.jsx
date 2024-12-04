// Importazione delle dipendenze necessarie
import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Badge, Alert, Form, Button } from 'react-bootstrap';

/**
 * Componente che mostra i dettagli di un film in un modal
 * @param {boolean} show - Controlla la visibilità del modal
 * @param {function} onHide - Funzione per chiudere il modal
 * @param {string} filmId - ID del film da visualizzare
 */
const FilmPageComponent = ({ show, onHide, filmId }) => {
  // State per memorizzare i dettagli del film
  const [filmDetails, setFilmDetails] = useState(null);
  // State per gestire i commenti
  const [comments, setComments] = useState([]);
  // State per gestire lo stato di caricamento
  const [loading, setLoading] = useState(true);
  // State per gestire eventuali errori
  const [error, setError] = useState(null);
  // State per gestire il nuovo commento
  const [newComment, setNewComment] = useState({ comment: '', rate: '5' });

  // Token di autenticazione per le API dei commenti
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzQ4Njk5NjA2ZmM4YzAwMTU2Yjg2ZWIiLCJpYXQiOjE3MzMzMjIxMDYsImV4cCI6MTczNDUzMTcwNn0.KlZQsVaSw1dl3kWegrIF0GXV2pUSZc28FxIDIGnrh24';

  // Effect per recuperare i dettagli del film e i commenti quando il modal viene aperto
  useEffect(() => {
    /**
     * Funzione asincrona per recuperare i dettagli del film e i commenti dall'API OMDB e API dei commenti
     * Migliorata la gestione degli errori e aggiunto supporto HTTPS
     */
    const fetchData = async () => {
      if (!show || !filmId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch del film con HTTPS per maggiore sicurezza
        const filmResponse = await fetch(
          `https://www.omdbapi.com/?apikey=3cccd910&i=${filmId}&plot=full`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        if (!filmResponse.ok) {
          throw new Error(`HTTP error! status: ${filmResponse.status}`);
        }

        const filmData = await filmResponse.json();

        if (filmData.Response === "True") {
          setFilmDetails(filmData);

          // Fetch dei commenti con gestione errori migliorata
          try {
            const commentsResponse = await fetch(
              `https://striveschool-api.herokuapp.com/api/comments/${filmId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );

            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              setComments(commentsData);
            } else if (commentsResponse.status === 401) {
              // Gestione specifica per token non valido
              console.warn('Token non valido o scaduto per i commenti');
              setComments([]);
            } else {
              throw new Error('Errore nel recupero dei commenti');
            }
          } catch (commentError) {
            console.error('Errore commenti:', commentError);
            setComments([]);
          }
        } else {
          throw new Error(filmData.Error || 'Film non trovato');
        }
      } catch (error) {
        console.error('Errore:', error);
        setError(error.message || 'Si è verificato un errore durante il caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function migliorata
    return () => {
      setFilmDetails(null);
      setComments([]);
      setError(null);
      setLoading(false);
    };
  }, [show, filmId, token]);

  // Gestione invio nuovo commento con validazione e gestione errori migliorata
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://striveschool-api.herokuapp.com/api/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: newComment.comment,
          rate: newComment.rate,
          elementId: filmId
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token non valido o scaduto');
        }
        throw new Error('Errore nell\'invio del commento');
      }

      const newCommentData = await response.json();
      // Aggiorna i commenti in modo immutabile
      setComments(prev => [...prev, newCommentData]);
      // Reset del form dopo l'invio
      setNewComment({ comment: '', rate: '5' });
    } catch (error) {
      console.error('Errore invio commento:', error);
      setError(error.message);
    }
  };

  // Eliminazione commento con gestione errori migliorata
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `https://striveschool-api.herokuapp.com/api/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Errore nella cancellazione del commento');
      }

      // Aggiorna i commenti rimuovendo quello cancellato
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (error) {
      setError(error.message);
    }
  };

  // Ottimizzazione del rendering condizionale
  if (!show) return null;
  
  // Mostra un loader durante il caricamento dei dati
  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered className="film-modal">
        <Modal.Body className="d-flex justify-content-center align-items-center bg-black" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
  
  // Mostra un messaggio di errore se ci sono errori
  if (error) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered className="film-modal">
        <Modal.Body className="bg-black text-white">
          <Alert variant="danger">
            {error}
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }
  
  // Ottimizzazione del rendering condizionale
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
            {filmDetails.Ratings && filmDetails.Ratings.length > 0 && (
              <>
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
              </>
            )}
            
            {/* Sezione commenti migliorata con form e lista */}
            <Col xs={12} className="mt-4">
              <h5 className="text-white mb-3">Commenti</h5>
              
              {/* Form nuovo commento con validazione */}
              <Form onSubmit={handleSubmitComment} className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    value={newComment.comment}
                    onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                    placeholder="Scrivi un commento..."
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select
                    value={newComment.rate}
                    onChange={(e) => setNewComment({...newComment, rate: e.target.value})}
                    className="bg-dark text-white border-secondary"
                  >
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num}>{num} stelle</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button variant="danger" type="submit">
                  Invia Commento
                </Button>
              </Form>

              {/* Lista commenti con pulsante elimina */}
              {comments.map((comment) => (
                <div key={comment._id} className="p-3 mb-2 bg-dark rounded">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="mb-1">{comment.comment}</p>
                      <small className="text-muted">
                        Valutazione: {comment.rate}/5
                      </small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </Col>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default FilmPageComponent;
