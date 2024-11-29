// Importazione delle dipendenze necessarie
import React, { useState, useEffect } from 'react';
import FilmCardComponent from './FilmCardComponent';
import { Row } from 'react-bootstrap';

// Componente principale che mostra una categoria di film
const AllFilmComponent = ({ category, title }) => {
  // State per gestire l'array dei film e lo stato di caricamento
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect hook per recuperare i film quando la categoria cambia
  useEffect(() => {
    // Funzione asincrona per chiamare l'API OMDB
    const fetchFilms = async () => {
      try {
        // Chiamata API a OMDB con la categoria specificata
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=3cccd910&s=${category}`
        );
        const data = await response.json();
        // Se la risposta è valida, aggiorna lo state dei film
        if (data.Response === "True") {
          setFilms(data.Search);
        }
      } catch (error) {
        console.error('Errore nel recupero dei film:', error);
      } finally {
        // Imposta loading a false sia in caso di successo che di errore
        setLoading(false);
      }
    };

    fetchFilms();
  }, [category]); // Dipendenza dall'prop category

  // Mostra un messaggio di caricamento mentre i dati vengono recuperati
  if (loading) return <div className="text-white">Caricamento...</div>;

  // Rendering del componente
  return (
    <div className="film-category mb-5">
      <h2 className="section-title">{title}</h2>
      <div className="film-row">
        {/* Riga scrollabile orizzontalmente con i film */}
        <Row className="flex-nowrap overflow-auto g-3">
          {/* Mapping dell'array dei film per creare le card */}
          {films.map((film) => (
            <div key={film.imdbID} className="col-7 col-sm-4 col-md-3 col-lg-3">
              <FilmCardComponent film={film} />
            </div>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AllFilmComponent;
