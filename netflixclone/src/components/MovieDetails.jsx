// Importazione delle dipendenze necessarie
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Per gestire i parametri URL e la navigazione
import { Container, Row, Col, Badge, Button } from 'react-bootstrap'; // Componenti Bootstrap
import LoaderComponent from './LoaderComponent'; // Componente di caricamento

/**
 * Componente che mostra i dettagli di un film specifico
 * Include informazioni dettagliate, commenti e film simili
 */
const MovieDetails = () => {
  // Recupera l'ID del film dall'URL
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  // Stati per gestire i dati e lo stato dell'applicazione
  const [movieDetails, setMovieDetails] = useState(null); // Dettagli del film
  const [comments, setComments] = useState([]); // Lista dei commenti
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(null); // Gestione errori
  const [similarMovies, setSimilarMovies] = useState([]); // Film simili

  // Token di autenticazione per l'API dei commenti
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzQ4Njk5NjA2ZmM4YzAwMTU2Yjg2ZWIiLCJpYXQiOjE3MzMzMjIxMDYsImV4cCI6MTczNDUzMTcwNn0.KlZQsVaSw1dl3kWegrIF0GXV2pUSZc28FxIDIGnrh24';

  // Effect per recuperare i dati del film quando cambia l'ID
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Recupera i dettagli del film dall'API OMDB
        const movieResponse = await fetch(
          `https://www.omdbapi.com/?apikey=3cccd910&i=${movieId}&plot=full`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        if (!movieResponse.ok) {
          throw new Error('Errore nel recupero dei dettagli del film');
        }

        const movieData = await movieResponse.json();
        
        if (movieData.Response === "False") {
          throw new Error(movieData.Error || 'Film non trovato');
        }

        setMovieDetails(movieData);

        // Recupera film simili basati sul primo genere del film
        if (movieData.Genre) {
          const firstGenre = movieData.Genre.split(',')[0].trim();
          const similarResponse = await fetch(
            `https://www.omdbapi.com/?apikey=3cccd910&s=${firstGenre}&type=movie`,
            {
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          if (similarResponse.ok) {
            const similarData = await similarResponse.json();
            if (similarData.Response === "True") {
              // Filtra il film corrente dalla lista dei film simili
              const filteredMovies = similarData.Search.filter(
                movie => movie.imdbID !== movieId
              );
              setSimilarMovies(filteredMovies);
            }
          }
        }

        // Recupera i commenti dall'API dedicata
        const commentsResponse = await fetch(
          `https://striveschool-api.herokuapp.com/api/comments/${movieId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        } else {
          console.warn('Errore nel recupero dei commenti');
          setComments([]);
        }
      } catch (error) {
        console.error('Errore:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  // Mostra il loader durante il caricamento
  if (loading) {
    return <LoaderComponent />;
  }

  // Mostra messaggio di errore se presente
  if (error) {
    return (
      <Container fluid className="bg-black min-vh-100 py-5 text-white">
        <div className="text-center">
          <h2>Errore</h2>
          <p>{error}</p>
          <Button variant="danger" onClick={() => window.history.back()}>
            Torna Indietro
          </Button>
        </div>
      </Container>
    );
  }

  // Non renderizza nulla se non ci sono dettagli
  if (!movieDetails) return null;

  // Rendering principale del componente
  return (
    <Container fluid className="bg-black min-vh-100 py-5">
      <Row className="text-white">
        {/* Colonna sinistra con poster del film */}
        <Col md={4} className="mb-4">
          <img
            src={movieDetails.Poster}
            alt={movieDetails.Title}
            className="img-fluid rounded shadow"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />
        </Col>

        {/* Colonna destra con dettagli del film */}
        <Col md={8}>
          <h1 className="mb-3">{movieDetails.Title} ({movieDetails.Year})</h1>
          <div className="mb-4">
            <Badge bg="danger" className="me-2">{movieDetails.Rated}</Badge>
            <Badge bg="secondary" className="me-2">{movieDetails.Runtime}</Badge>
            <Badge bg="secondary" className="me-2">{movieDetails.Genre}</Badge>
            <Badge bg="warning" text="dark">{movieDetails.imdbRating} ⭐</Badge>
          </div>

          <h4>Trama</h4>
          <p className="mb-4">{movieDetails.Plot}</p>

          <div className="mb-4">
            <p><strong>Regia:</strong> {movieDetails.Director}</p>
            <p><strong>Sceneggiatura:</strong> {movieDetails.Writer}</p>
            <p><strong>Cast:</strong> {movieDetails.Actors}</p>
          </div>

          {/* Sezione commenti */}
          <div className="comments-section mb-5">
            <h4 className="mb-3">Commenti ({comments.length})</h4>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="p-3 mb-2 bg-dark rounded">
                  <p className="mb-1">{comment.comment}</p>
                  <small className="text-muted">
                    Valutazione: {comment.rate}/5
                  </small>
                </div>
              ))
            ) : (
              <p>Nessun commento disponibile</p>
            )}
          </div>
        </Col>
      </Row>

      {/* Sezione film simili con scroll orizzontale */}
      {similarMovies.length > 0 && (
        <div className="similar-movies-section mt-5">
          <h3 className="text-white mb-4 text-start">Film Simili</h3>
          <Row className="flex-nowrap overflow-auto g-4">
            {similarMovies.map((movie) => (
              <Col key={movie.imdbID} className="col-auto">
                <div 
                  className="similar-movie-card" 
                  style={{ 
                    width: '250px',  // Larghezza fissa per uniformità
                    height: '400px', // Altezza fissa per uniformità
                    margin: 'auto',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/movie-details/${movie.imdbID}`)}
                >
                  <div className="position-relative h-100">
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="img-fluid rounded w-100 h-75 object-fit-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                      }}
                      style={{
                        minHeight: '300px' // Altezza minima per l'immagine
                      }}
                    />
                    <div className="movie-info p-2">
                      <h5 className="text-white mt-2 text-truncate">{movie.Title}</h5>
                      <p className="text-muted mb-0">{movie.Year}</p>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default MovieDetails;
