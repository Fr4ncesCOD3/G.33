// Importazione delle dipendenze necessarie
import React, { useState, useEffect } from 'react';
import FilmCardComponent from './FilmCardComponent';
import { Row } from 'react-bootstrap';

/**
 * Componente principale che mostra una categoria di film
 * @param {string} category - La categoria dei film da visualizzare (es. "Action", "Comedy", ecc.)
 * @param {string} title - Il titolo da mostrare sopra la lista dei film
 * @param {string} contentType - Il tipo di contenuto da mostrare ("movie" o "series")
 * @param {string} searchQuery - La query di ricerca inserita dall'utente
 */
const AllFilmComponent = ({ category, title, contentType, searchQuery }) => {
  // State per gestire l'array dei film e lo stato di caricamento
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect hook che si attiva quando cambiano category, contentType o searchQuery
  useEffect(() => {
    /**
     * Funzione asincrona per recuperare i film dall'API OMDB
     * Gestisce diverse logiche di ricerca in base alla categoria selezionata
     */
    const fetchFilms = async () => {
      try {
        let searchResults = [];
        // Se contentType non è specificato, usa 'movie' come default
        const type = contentType || 'movie';
        
        // Logica per la ricerca per titolo o genere
        if (category === "search" && searchQuery) {
          setLoading(true);
          
          // Prima cerca per titolo
          const titleResponse = await fetch(
            `http://www.omdbapi.com/?apikey=3cccd910&s=${searchQuery}&type=${type}`
          );
          const titleData = await titleResponse.json();
          let titleResults = [];
          
          // Se trova risultati, ottiene i dettagli completi per ogni film
          if (titleData.Response === "True") {
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

          // Poi cerca per genere (limitato a 2 pagine per performance)
          const genrePages = [1, 2];
          let genreResults = [];
          
          for (const page of genrePages) {
            const response = await fetch(
              `http://www.omdbapi.com/?apikey=3cccd910&s=${type}&type=${type}&page=${page}`
            );
            const data = await response.json();
            
            if (data.Response === "True") {
              // Ottiene dettagli completi per ogni risultato
              const detailedResults = await Promise.all(
                data.Search.map(async (item) => {
                  const detailResponse = await fetch(
                    `http://www.omdbapi.com/?apikey=3cccd910&i=${item.imdbID}`
                  );
                  return await detailResponse.json();
                })
              );
              
              // Filtra i risultati che hanno il genere cercato
              const genreMatches = detailedResults.filter(item => 
                item.Response === "True" && 
                item.Genre && 
                item.Genre.toLowerCase().includes(searchQuery.toLowerCase())
              );
              
              genreResults.push(...genreMatches);
            }
          }

          // Combina risultati e rimuove duplicati
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
            
            // Poi ordina per rating
            return parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0);
          });

          // Limita a 20 risultati per performance
          searchResults = searchResults.slice(0, 20);
        } 
        // Logica per categorie specifiche (Action, Comedy, ecc.)
        else if (['Action', 'Comedy', 'Drama', 'Horror', 'Adventure'].includes(category)) {
          // Fetch di 4 pagine per avere più risultati
          const pages = [1, 2, 3, 4];
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
          
          // Ottiene dettagli completi e filtra per genere
          const detailedResults = await Promise.all(
            allResults.map(async (item) => {
              const detailResponse = await fetch(
                `http://www.omdbapi.com/?apikey=3cccd910&i=${item.imdbID}`
              );
              return await detailResponse.json();
            })
          );
          
          // Filtra per genere e rimuove duplicati
          searchResults = detailedResults
            .filter(item => item.Genre && item.Genre.includes(category))
            .filter((item, index, self) => 
              index === self.findIndex((t) => t.imdbID === item.imdbID)
            );
        }
        // Logica per nuove uscite
        else if (category === "new-releases") {
          const years = ["2024", "2023", "2022"];
          const allResults = [];
          
          // Cerca film degli ultimi 3 anni
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
          
          // Ordina per anno e prende i primi 10
          searchResults = allResults
            .sort((a, b) => b.Year - a.Year)
            .slice(0, 10);
        }
        // Logica per top 10
        else if (category === "top-10") {
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=3cccd910&s=movie&type=${type}`
          );
          const data = await response.json();
          
          if (data.Response === "True") {
            // Ottiene dettagli per i primi 20 risultati
            const detailedResults = await Promise.all(
              data.Search.slice(0, 20).map(async (item) => {
                const detailResponse = await fetch(
                  `http://www.omdbapi.com/?apikey=3cccd910&i=${item.imdbID}`
                );
                return await detailResponse.json();
              })
            );
            
            // Filtra per rating > 8 e prende i top 10
            searchResults = detailedResults
              .filter(movie => {
                const rating = parseFloat(movie.imdbRating);
                return !isNaN(rating) && rating > 8;
              })
              .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
              .slice(0, 10);
          }
        }
        // Logica default per altre categorie
        else {
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

    // Implementa un debounce di 300ms per la ricerca
    const timeoutId = setTimeout(() => {
      fetchFilms();
    }, 300);

    // Cleanup function per cancellare il timeout
    return () => clearTimeout(timeoutId);
  }, [category, contentType, searchQuery]);

  // Mostra loader durante il caricamento
  if (loading) return <div className="text-white">Caricamento...</div>;

  // Rendering del componente con la lista dei film
  return (
    <div className="film-category">
      <h2 className="section-title text-white text-start mb-4">{title}</h2>
      <div className="film-row">
        <Row className={`${['Action', 'Comedy', 'Drama', 'Horror', 'Adventure'].includes(category) 
          ? '' // Layout normale per categorie specifiche
          : 'flex-nowrap overflow-auto'}`} // Layout scrollabile per altre categorie
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
