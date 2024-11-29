// Importazione delle dipendenze necessarie
import React from 'react';
import AllFilmComponent from './AllFilmComponent'; // Componente per visualizzare le sezioni di film
import { Container, Dropdown } from 'react-bootstrap'; // Aggiunto Dropdown di Bootstrap

// Componente principale che rappresenta la pagina principale dell'applicazione
const MainPage = ({ selectedGenre, setSelectedGenre, contentType, searchQuery, isKidsMode }) => {
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Adventure'];

  return (
    <>
      <div className="dynamic-title-container">
        <h1 className="main-title text-center">
          {searchQuery ? `Risultati per: ${searchQuery}` :
           isKidsMode ? '🌟 Area Bambini' :
           contentType === 'series' ? 'Serie TV' : 
           contentType === 'movie' ? 'Film' : 
           'TV Shows & Movies'}
        </h1>
        <div className="title-background"></div>
      </div>

      <Container fluid className="px-4">
        {searchQuery ? (
          <AllFilmComponent 
            category="search"
            title="Risultati della ricerca"
            contentType={contentType}
            searchQuery={searchQuery}
            isKidsMode={isKidsMode}
          />
        ) : (
          <>
            {!isKidsMode && (
              <Dropdown className="genres-dropdown mb-4">
                <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                  Genres
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {genres.map((genre) => (
                    <Dropdown.Item key={genre} onClick={() => setSelectedGenre(genre)}>
                      {genre}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {selectedGenre && !isKidsMode ? (
              <AllFilmComponent 
                category={selectedGenre} 
                title={`Genre: ${selectedGenre}`} 
                contentType={contentType}
                isKidsMode={isKidsMode}
              />
            ) : (
              <div className="film-sections">
                <AllFilmComponent 
                  category="animation"
                  title={isKidsMode ? "Cartoni Animati" : "Nuove Uscite"}
                  contentType={contentType}
                  isKidsMode={isKidsMode}
                />
                <AllFilmComponent 
                  category="disney"
                  title={isKidsMode ? "Disney" : "Top 10 Questo Mese"}
                  contentType={contentType}
                  isKidsMode={isKidsMode}
                />
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

// Esportazione del componente per l'utilizzo in altre parti dell'applicazione
export default MainPage;
