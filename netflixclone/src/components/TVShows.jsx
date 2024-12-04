// Importazione delle dipendenze necessarie
import React from 'react';
import { Container } from 'react-bootstrap'; // Per il layout responsive
import AllFilmComponent from './AllFilmComponent'; // Componente per visualizzare le sezioni di serie TV

/**
 * Componente che gestisce la visualizzazione delle Serie TV
 * Mostra diverse categorie di serie utilizzando il componente AllFilmComponent
 */
const TVShows = () => {
  return (
    // Container fluido con sfondo nero e padding
    <Container fluid className="bg-black min-vh-100 py-5">
      {/* Titolo principale della pagina */}
      <h1 className="text-white mb-4">Serie TV</h1>

      {/* Sezione delle serie TV popolari */}
      <AllFilmComponent 
        category="series" // Categoria generica per serie TV
        title="Serie TV Popolari" // Titolo della sezione
        contentType="series" // Tipo di contenuto specifico per serie
      />

      {/* Sezione delle serie TV drammatiche */}
      <AllFilmComponent 
        category="drama" // Categoria specifica per drama
        title="Drama" // Titolo della sezione
        contentType="series" // Mantiene il tipo di contenuto come serie
      />

      {/* Sezione delle serie TV comiche */}
      <AllFilmComponent 
        category="comedy" // Categoria specifica per comedy
        title="Comedy" // Titolo della sezione
        contentType="series" // Mantiene il tipo di contenuto come serie
      />
    </Container>
  );
};

// Esportazione del componente per l'utilizzo in altre parti dell'applicazione
export default TVShows; 