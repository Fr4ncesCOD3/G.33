// Importazione delle dipendenze necessarie
import './App.css';
import NavBar from './components/NavbarComponent';
import Footer from './components/FooterComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './components/MainPage';
import { useEffect, useState } from 'react';
import LoaderComponent from './components/LoaderComponent';
import ProfileSettings from './components/ProfileSettings';

/**
 * Componente principale dell'applicazione che gestisce la logica di navigazione
 * e lo stato globale dell'app
 */
function App() {
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
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
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

  // Rendering del layout principale dell'applicazione
  return (
    <div className="App">
      <NavBar 
        onHomeClick={resetToHome} 
        onTVSeriesClick={showTVSeries}
        onMoviesClick={showMovies}
        onSearch={handleSearch}
        onProfileClick={() => setShowProfile(true)}
      />
      <main className="bg-black" style={{ paddingTop: '5rem' }}>
        <MainPage 
          selectedGenre={selectedGenre} 
          setSelectedGenre={setSelectedGenre}
          contentType={contentType}
          searchQuery={searchQuery}
        />
      </main>
      <Footer />
    </div>
  );
}

// Esportazione del componente App
export default App;
