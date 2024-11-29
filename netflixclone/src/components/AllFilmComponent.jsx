// Importazione delle dipendenze necessarie
import React, { useState, useEffect } from 'react';
import FilmCardComponent from './FilmCardComponent';
import { Row } from 'react-bootstrap';

// Componente principale che mostra una categoria di film
const AllFilmComponent = ({ category, title, contentType, searchQuery }) => {
  // State per gestire l'array dei film e lo stato di caricamento
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect hook per recuperare i film quando la categoria cambia
  useEffect(() => {
    // Funzione asincrona per chiamare l'API OMDB
    const fetchFilms = async () => {
      try {
        let searchResults = [];
        const type = contentType || 'movie'; // Se contentType non è specificato, usa 'movie'
        
        if (category === "search" && searchQuery) {
          setLoading(true);
          
          // Cerca per titolo
          const titleResponse = await fetch(
            `http://www.omdbapi.com/?apikey=3cccd910&s=${searchQuery}&type=${type}`
          );
          const titleData = await titleResponse.json();
          let titleResults = [];
          
          if (titleData.Response === "True") {
            // Ottieni dettagli completi per ogni risultato
            const detailedTitleResults = await Promise.all(
              titleData.Search.map(async (item) => {
                const detailResponse = await fetch(
                  `http://www.omdbapi.com/?apikey=3cccd910&i=${item.imdbID}`
                );
                return await detailResponse.json();
              })
            );
            titleResults = detailedTitleResults.filter(item => item.Response === "True");
          }

          // Cerca per genere
          const genrePages = [1, 2]; // Limita a 2 pagine per performance
          let genreResults = [];
          
          for (const page of genrePages) {
            const response = await fetch(
              `http://www.omdbapi.com/?apikey=3cccd910&s=${type}&type=${type}&page=${page}`
            );
            const data = await response.json();
            
            if (data.Response === "True") {
              const detailedResults = await Promise.all(
                data.Search.map(async (item) => {
                  const detailResponse = await fetch(
                    `http://www.omdbapi.com/?apikey=3cccd910&i=${item.imdbID}`
                  );
                  return await detailResponse.json();
                })
              );
              
              // Filtra per genere che include la query di ricerca
              const genreMatches = detailedResults.filter(item => 
                item.Response === "True" && 
                item.Genre && 
                item.Genre.toLowerCase().includes(searchQuery.toLowerCase())
              );
              
              genreResults.push(...genreMatches);
            }
          }

          // Combina e rimuovi duplicati
          const allResults = [...titleResults, ...genreResults];
          searchResults = [...new Map(allResults.map(item => [item.imdbID, item])).values()];

          // Ordina i risultati per rilevanza
          searchResults.sort((a, b) => {
            const aTitle = a.Title.toLowerCase();
            const bTitle = b.Title.toLowerCase();
            const query = searchQuery.toLowerCase();
            
            // Priorità ai titoli che iniziano con la query
            if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
            if (!aTitle.startsWith(query) && bTitle.startsWith(query)) return 1;
            
            // Poi per rating
            return parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0);
          });

          // Limita a 20 risultati per performance
          searchResults = searchResults.slice(0, 20);
        } else if (['Action', 'Comedy', 'Drama', 'Horror', 'Adventure'].includes(category)) {
          // Fetch di più pagine per ottenere più risultati
          const pages = [1, 2, 3, 4]; // Fetch di 4 pagine
          const allResults = [];
          
          for (const page of pages) {
            const response = await fetch(
              `http://www.omdbapi.com/?apikey=3cccd910&s=${type}&type=${type}&page=${page}`
            );
            const data = await response.json();
            
            if (data.Response === "True") {
              allResults.push(...data.Search);
            }
          }
          
          // Ottieni i dettagli per tutti i risultati
          const detailedResults = await Promise.all(
            allResults.map(async (item) => {
              const detailResponse = await fetch(
                `http://www.omdbapi.com/?apikey=3cccd910&i=${item.imdbID}`
              );
              return await detailResponse.json();
            })
          );
          
          // Filtra per genere e rimuovi eventuali duplicati
          searchResults = detailedResults
            .filter(item => item.Genre && item.Genre.includes(category))
            .filter((item, index, self) => 
              index === self.findIndex((t) => t.imdbID === item.imdbID)
            );
        } else if (category === "new-releases") {
          const years = ["2024", "2023", "2022"];
          const allResults = [];
          
          for (const year of years) {
            const response = await fetch(
              `http://www.omdbapi.com/?apikey=3cccd910&s=${type}&y=${year}&type=${type}`
            );
            const data = await response.json();
            if (data.Response === "True") {
              const yearResults = data.Search.filter(movie => 
                movie.Year === year
              );
              allResults.push(...yearResults);
            }
          }
          
          searchResults = allResults
            .sort((a, b) => b.Year - a.Year)
            .slice(0, 10);
        } else if (category === "top-10") {
          // Fetch per film/serie con rating alto
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=3cccd910&s=movie&type=${type}`
          );
          const data = await response.json();
          
          if (data.Response === "True") {
            // Ottieni i dettagli per i primi 20 risultati (per avere abbastanza film con rating alto)
            const detailedResults = await Promise.all(
              data.Search.slice(0, 20).map(async (item) => {
                const detailResponse = await fetch(
                  `http://www.omdbapi.com/?apikey=3cccd910&i=${item.imdbID}`
                );
                return await detailResponse.json();
              })
            );
            
            // Filtra per rating > 8 e prendi i primi 10
            searchResults = detailedResults
              .filter(movie => {
                const rating = parseFloat(movie.imdbRating);
                return !isNaN(rating) && rating > 8;
              })
              .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
              .slice(0, 10);
          }
        } else {
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=3cccd910&s=${category}&type=${type}`
          );
          const data = await response.json();
          if (data.Response === "True") {
            searchResults = data.Search;
          }
        }
        
        setFilms(searchResults);
      } catch (error) {
        console.error('Errore nel recupero dei film:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce per la ricerca
    const timeoutId = setTimeout(() => {
      fetchFilms();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [category, contentType, searchQuery]);

  // Mostra un messaggio di caricamento mentre i dati vengono recuperati
  if (loading) return <div className="text-white">Caricamento...</div>;

  // Rendering del componente
  return (
    <div className="film-category">
      <h2 className="section-title text-white text-start mb-4">{title}</h2>
      <div className="film-row">
        <Row className={`${['Action', 'Comedy', 'Drama', 'Horror', 'Adventure'].includes(category) 
          ? '' 
          : 'flex-nowrap overflow-auto'}`}
        >
          {films.map((film) => (
            <div key={film.imdbID}>
              <FilmCardComponent film={film} />
            </div>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AllFilmComponent;
