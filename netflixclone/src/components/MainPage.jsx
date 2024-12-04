// Importazione delle dipendenze necessarie
import React, { useState, useEffect } from 'react';
import AllFilmComponent from './AllFilmComponent'; // Componente per visualizzare le sezioni di film
import { Container } from 'react-bootstrap'; // Componenti Bootstrap per il layout

/**
 * Componente principale che rappresenta la pagina principale dell'applicazione
 * @param {string} selectedGenre - Genere selezionato per il filtro
 * @param {function} setSelectedGenre - Funzione per aggiornare il genere selezionato
 * @param {string} contentType - Tipo di contenuto (film/serie)
 * @param {string} searchQuery - Query di ricerca inserita dall'utente
 */
const MainPage = ({ selectedGenre, setSelectedGenre, contentType, searchQuery }) => {
  // Stato per memorizzare i film in cache per ogni tipo di contenuto
  const [cachedFilms, setCachedFilms] = useState({});

  // Array di categorie per la home page
  const categories = [
    { id: 'popular', title: 'Film Popolari', query: 'movie' },
    { id: 'action', title: 'Film d\'Azione', query: 'action' },
    { id: 'comedy', title: 'Commedie', query: 'comedy' },
    { id: 'drama', title: 'Drammatici', query: 'drama' },
    { id: 'horror', title: 'Horror', query: 'horror' },
    { id: 'scifi', title: 'Fantascienza', query: 'sci-fi' }
  ];

  // Effect per recuperare e memorizzare i film in cache
  // Si attiva quando cambia il tipo di contenuto
  useEffect(() => {
    const fetchFilms = async () => {
      // Verifica se i film sono già in cache per questo tipo di contenuto
      if (cachedFilms[contentType]) {
        return;
      }

      try {
        // Chiamata API per recuperare i film
        const response = await fetch(`https://www.omdbapi.com/?apikey=3cccd910&s=${contentType}`);
        const data = await response.json();
        if (data.Response === "True") {
          // Aggiorna la cache con i nuovi film mantenendo quelli esistenti
          setCachedFilms(prev => ({ ...prev, [contentType]: data.Search }));
        }
      } catch (error) {
        console.error('Errore nel recupero dei film:', error);
      }
    };

    fetchFilms();
  }, [contentType, cachedFilms]);

  // Se c'è una ricerca in corso, mostra solo i risultati della ricerca
  if (searchQuery) {
    return (
      <Container fluid className="px-4">
        <AllFilmComponent 
          category={searchQuery}
          title={`Risultati per: ${searchQuery}`}
          contentType={contentType}
          searchQuery={searchQuery}
        />
      </Container>
    );
  }

  // Se è selezionato un genere specifico, mostra solo quel genere
  if (selectedGenre) {
    return (
      <Container fluid className="px-4">
        <AllFilmComponent 
          category={selectedGenre}
          title={`Genere: ${selectedGenre}`}
          contentType={contentType}
        />
      </Container>
    );
  }

  // Altrimenti mostra tutte le categorie nella home
  return (
    <Container fluid className="px-4">
      {categories.map(category => (
        <div key={category.id} className="mb-5">
          <AllFilmComponent 
            category={category.query}
            title={category.title}
            contentType="movie"
          />
        </div>
      ))}
    </Container>
  );
};

// Esportazione del componente
export default MainPage;
