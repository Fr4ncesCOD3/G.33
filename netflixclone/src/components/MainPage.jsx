// Importazione delle dipendenze necessarie
import React from 'react';
import AllFilmComponent from './AllFilmComponent'; // Componente per visualizzare le sezioni di film
import { Container } from 'react-bootstrap'; // Container di Bootstrap per il layout

// Componente principale che rappresenta la pagina principale dell'applicazione
const MainPage = () => {
  return (
    // Container fluido con padding orizzontale
    <Container fluid className="px-4">
      {/* Titolo principale della pagina */}
      <h1 className="main-title mb-4">TV Shows</h1>

      {/* Menu a tendina per i generi (da implementare la funzionalità) */}
      <div className="genres-dropdown mb-4">
        <button className="btn btn-outline-light">Genres <span className="caret"></span></button>
      </div>
      
      {/* Sezioni di film organizzate per categoria */}
      {/* Ogni AllFilmComponent riceve una categoria e un titolo da visualizzare */}
      <AllFilmComponent category="Trending" title="Trending Now" />
      <AllFilmComponent category="Popular" title="Watch It Again" />
      <AllFilmComponent category="New" title="New Releases" />
      <AllFilmComponent category="Comedy" title="Comedy Shows" />
      <AllFilmComponent category="Drama" title="Drama Series" />
      <AllFilmComponent category="Action" title="Action & Adventure" />
    </Container>
  );
};

// Esportazione del componente per l'utilizzo in altre parti dell'applicazione
export default MainPage;
