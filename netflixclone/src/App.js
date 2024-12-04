// Importazione delle dipendenze necessarie
import './App.css';
import NavBar from './components/NavbarComponent';
import Footer from './components/FooterComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './components/MainPage';
import { useEffect, useState } from 'react';
import LoaderComponent from './components/LoaderComponent';
import ProfileSettings from './components/ProfileSettings';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TVShows from './components/TVShows';
import MovieDetails from './components/MovieDetails';

/**
 * Componente principale dell'applicazione che gestisce la logica di navigazione
 * e lo stato globale dell'app
 */
function App() {
  // STATO DELL'APPLICAZIONE
  // Stato per il genere selezionato dei film/serie
  const [selectedGenre, setSelectedGenre] = useState(null);
  // Stato per il tipo di contenuto (film o serie)
  const [contentType, setContentType] = useState(null);
  // Stato per verificare la connessione internet
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // Stato per mostrare il loader all'avvio dell'app
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // Stato per la query di ricerca
  const [searchQuery, setSearchQuery] = useState('');
  // Stato per mostrare/nascondere le impostazioni del profilo
  const [showProfile, setShowProfile] = useState(false);

  // EFFETTI COLLATERALI
  useEffect(() => {
    // Gestori eventi per lo stato online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Aggiunta listener per monitorare lo stato della connessione
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Timer per mostrare il loader iniziale per 1.5 secondi
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);

    // Funzione per gestire l'effetto di scroll sulla navbar
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    // Aggiunta listener per lo scroll
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup dei listener e del timer
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // FUNZIONI DI GESTIONE DELLA NAVIGAZIONE
  /**
   * Resetta l'app alla home page
   */
  const resetToHome = () => {
    setSelectedGenre(null);
    setContentType(null);
  };

  /**
   * Imposta la visualizzazione delle serie TV
   */
  const showTVSeries = () => {
    setContentType('series');
    setSelectedGenre(null);
  };

  /**
   * Imposta la visualizzazione dei film
   */
  const showMovies = () => {
    setContentType('movie');
    setSelectedGenre(null);
  };

  /**
   * Gestisce la ricerca dei contenuti
   * @param {string} query - La query di ricerca inserita dall'utente
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre(null);
  };

  // GESTIONE STATI CONDIZIONALI
  // Mostra il loader durante il caricamento iniziale
  if (isInitialLoading) {
    return <LoaderComponent error={false} />;
  }

  // Mostra la pagina di errore se non c'è connessione
  if (!isOnline) {
    return <LoaderComponent error={true} />;
  }

  // Mostra le impostazioni del profilo se richiesto
  if (showProfile) {
    return <ProfileSettings onBack={() => setShowProfile(false)} />;
  }

  // RENDERING DELL'APPLICAZIONE
  // Rendering del layout principale dell'applicazione con React Router
  return (
    <BrowserRouter>
      <div className="App">
        {/* Navbar con gestione degli eventi di navigazione */}
        <NavBar 
          onHomeClick={resetToHome} 
          onTVSeriesClick={showTVSeries}
          onMoviesClick={showMovies}
          onSearch={handleSearch}
          onProfileClick={() => setShowProfile(true)}
        />
        {/* Contenuto principale con routing */}
        <main className="bg-black" style={{ paddingTop: '5rem' }}>
          <Routes>
            {/* Route per la home page */}
            <Route path="/" element={
              <MainPage 
                selectedGenre={selectedGenre} 
                setSelectedGenre={setSelectedGenre}
                contentType={contentType}
                searchQuery={searchQuery}
              />
            } />
            {/* Route per le serie TV */}
            <Route path="/tv-shows" element={<TVShows />} />
            {/* Route per i dettagli del film */}
            <Route path="/movie-details/:movieId" element={<MovieDetails />} />
            {/* Route per le impostazioni del profilo */}
            <Route path="/profile-settings" element={<ProfileSettings onBack={() => setShowProfile(false)} />} />
          </Routes>
        </main>
        {/* Footer dell'applicazione */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Esportazione del componente App
export default App;
