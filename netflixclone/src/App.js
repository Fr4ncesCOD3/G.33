// Importazione delle dipendenze necessarie
import './App.css';
import NavBar from './components/NavbarComponent';
import Footer from './components/FooterComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './components/MainPage';
import { useEffect, useState } from 'react';
import LoaderComponent from './components/LoaderComponent';
import ProfileSettings from './components/ProfileSettings';
import KidsModal from './components/KidsModal';

// Componente principale dell'applicazione
function App() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Semplice timeout per il loader iniziale
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);

    // Gestione scroll navbar
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const resetToHome = () => {
    setSelectedGenre(null);
    setContentType(null);
  };

  const showTVSeries = () => {
    setContentType('series');
    setSelectedGenre(null);
  };

  const showMovies = () => {
    setContentType('movie');
    setSelectedGenre(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre(null);
  };

  // Mostra il loader solo durante il caricamento iniziale
  if (isInitialLoading) {
    return <LoaderComponent error={false} />;
  }

  // Mostra la pagina di errore solo se offline
  if (!isOnline) {
    return <LoaderComponent error={true} />;
  }

  if (showProfile) {
    return <ProfileSettings onBack={() => setShowProfile(false)} />;
  }

  // Mostra l'applicazione normale
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
