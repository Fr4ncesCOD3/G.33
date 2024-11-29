// Importazione delle dipendenze necessarie
import React from 'react';
import AllFilmComponent from './AllFilmComponent'; // Componente per visualizzare le sezioni di film
import { Container, Dropdown } from 'react-bootstrap'; // Componenti Bootstrap per il layout

/**
 * Componente principale che rappresenta la pagina principale dell'applicazione
 * @param {string} selectedGenre - Genere selezionato per il filtro
 * @param {function} setSelectedGenre - Funzione per aggiornare il genere selezionato
 * @param {string} contentType - Tipo di contenuto (film/serie)
 * @param {string} searchQuery - Query di ricerca inserita dall'utente
 * @param {boolean} isKidsMode - Flag per la modalità bambini
 */
const MainPage = ({ selectedGenre, setSelectedGenre, contentType, searchQuery, isKidsMode }) => {
  // Array dei generi disponibili per il filtro
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Adventure'];

  return (
    <>
      {/* Container per il titolo dinamico della pagina */}
      <div className="dynamic-title-container">
        <h1 className="main-title text-center">
          {/* Logica per mostrare il titolo appropriato in base ai parametri */}
          {searchQuery ? `Risultati per: ${searchQuery}` :
           isKidsMode ? '🌟 Area Bambini' :
           contentType === 'series' ? 'Serie TV' : 
           contentType === 'movie' ? 'Film' : 
           'TV Shows & Movies'}
        </h1>
        <div className="title-background"></div>
      </div>

      {/* Container principale per il contenuto */}
      <Container fluid className="px-4">
        {/* Rendering condizionale basato sulla presenza di una query di ricerca */}
        {searchQuery ? (
          // Mostra i risultati della ricerca
          <AllFilmComponent 
            category="search"
            title="Risultati della ricerca"
            contentType={contentType}
            searchQuery={searchQuery}
            isKidsMode={isKidsMode}
          />
        ) : (
          <>
            {/* Dropdown per la selezione del genere (nascosto in modalità bambini) */}
            {!isKidsMode && (
              <Dropdown className="genres-dropdown mb-4">
                <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                  Genres
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {/* Mapping dei generi disponibili */}
                  {genres.map((genre) => (
                    <Dropdown.Item key={genre} onClick={() => setSelectedGenre(genre)}>
                      {genre}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Rendering condizionale basato sul genere selezionato e modalità bambini */}
            {selectedGenre && !isKidsMode ? (
              // Mostra film del genere selezionato
              <AllFilmComponent 
                category={selectedGenre} 
                title={`Genre: ${selectedGenre}`} 
                contentType={contentType}
                isKidsMode={isKidsMode}
              />
            ) : (
              // Mostra le sezioni predefinite
              <div className="film-sections">
                {/* Prima sezione: Cartoni Animati/Nuove Uscite */}
                <AllFilmComponent 
                  category="animation"
                  title={isKidsMode ? "Cartoni Animati" : "Nuove Uscite"}
                  contentType={contentType}
                  isKidsMode={isKidsMode}
                />
                {/* Seconda sezione: Disney/Top 10 */}
                <AllFilmComponent 
                  category="disney"
                  title={isKidsMode ? "Disney" : "Top 10 Questo Mese"}
                  contentType={contentType}
                  isKidsMode={isKidsMode}
                />
                {/* Terza sezione: Pixar/In Arrivo */}
                <AllFilmComponent 
                  category="pixar"
                  title={isKidsMode ? "Pixar" : "In Arrivo"}
                  contentType={contentType}
                  isKidsMode={isKidsMode}
                />
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
};

// Esportazione del componente
export default MainPage;
