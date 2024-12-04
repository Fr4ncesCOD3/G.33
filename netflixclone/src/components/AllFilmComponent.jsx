// Importazione delle dipendenze necessarie
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Aggiungiamo una cache per memorizzare i risultati
  const cache = useMemo(() => new Map(), []);
  const cacheKey = `${category}-${contentType}-${searchQuery}-${page}`;

  // Effect hook che si attiva quando cambiano category, contentType o searchQuery
  useEffect(() => {
    /**
     * Funzione asincrona per recuperare i film dall'API OMDB
     * Gestisce diverse logiche di ricerca in base alla categoria selezionata
     */
    const fetchFilms = async () => {
      try {
        // Controlla se i risultati sono già in cache
        if (cache.has(cacheKey)) {
          setFilms(cache.get(cacheKey));
          setLoading(false);
          return;
        }

        let searchResults = [];
        // Se contentType non è specificato, usa 'movie' come default
        const type = contentType || 'movie';
        
        // Implementazione della fetch con batch di richieste
        const fetchBatch = async (query, pageNum) => {
          try {
            const type = contentType === 'series' ? 'series' : 'movie';
            const searchTerm = query || category || type;
            
            const response = await fetch(
              `https://www.omdbapi.com/?apikey=3cccd910&s=${searchTerm}&type=${type}&page=${pageNum}`,
              {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                mode: 'cors',
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.Response === "False") {
              setHasMore(false);
              if (pageNum === 1) {
                setFilms([]);
              }
              return [];
            }

            return data.Search || [];
          } catch (error) {
            console.error('Errore nel recupero dei film:', error);
            setError('Si è verificato un errore nel caricamento dei film.');
            return [];
          }
        };

        // Logica per la ricerca per titolo o genere
        if (category === "search" && searchQuery) {
          // Batch le richieste di ricerca
          const batchSize = 5;
          const searchUrls = Array.from({ length: batchSize }, (_, i) => 
            `http://www.omdbapi.com/?apikey=3cccd910&s=${searchQuery}&type=${type}&page=${page + i}`
          );

          const batchResults = await fetchBatch(searchQuery, page);
          searchResults = batchResults.flatMap(data => data.Search || []);

        } else if (['Action', 'Comedy', 'Drama', 'Horror', 'Adventure'].includes(category)) {
          // Implementa lazy loading per i generi
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=3cccd910&s=${type}&type=${type}&page=${page}`
          );
          const data = await response.json();
          
          if (data.Response === "True") {
            searchResults = data.Search;
            setHasMore(data.totalResults > page * 10);
          }
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
        
        // Salva i risultati in cache
        cache.set(cacheKey, searchResults);
        setFilms(prevFilms => [...prevFilms, ...searchResults]);
        
      } catch (error) {
        console.error('Errore nel recupero dei film:', error);
      } finally {
        setLoading(false);
      }
    };

    // Implementa debounce più efficiente
    const debounceTimeout = setTimeout(fetchFilms, 300);
    return () => clearTimeout(debounceTimeout);
  }, [category, contentType, searchQuery, page, cacheKey, cache]);

  // Implementa infinite scroll
  const handleScroll = useCallback((e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollWidth - (scrollLeft + clientWidth) < 200 && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Funzione per generare una chiave unica per ogni film
  const generateUniqueKey = (film, index) => {
    return `${film.imdbID}-${index}`;
  };

  // Mostra loader durante il caricamento
  if (loading) return <div className="text-white">Caricamento...</div>;

  // Rendering del componente con la lista dei film
  return (
    <div className="film-category">
      <h2 className="section-title text-white text-start mb-4">{title}</h2>
      <div className="film-row">
        <Row 
          className={`${['Action', 'Comedy', 'Drama', 'Horror', 'Adventure'].includes(category) 
            ? '' : 'flex-nowrap overflow-auto'}`}
          onScroll={handleScroll}
        >
          {films.map((film, index) => (
            <div key={generateUniqueKey(film, index)}>
              <FilmCardComponent film={film} />
            </div>
          ))}
          {loading && <div className="loading-spinner">Caricamento...</div>}
        </Row>
      </div>
    </div>
  );
};

export default AllFilmComponent;
