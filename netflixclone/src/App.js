// Importazione delle dipendenze necessarie
import './App.css';
import NavBar from './components/NavbarComponent';
import Footer from './components/FooterComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './components/MainPage';
import { useEffect } from 'react';

// Componente principale dell'applicazione
function App() {
  // Effect hook per gestire l'aspetto della navbar durante lo scroll
  useEffect(() => {
    // Funzione che gestisce l'evento di scroll
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      // Aggiunge/rimuove la classe 'scrolled' in base alla posizione dello scroll
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    // Aggiunge l'event listener per lo scroll
    window.addEventListener('scroll', handleScroll);
    // Cleanup: rimuove l'event listener quando il componente viene smontato
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rendering del layout principale dell'applicazione
  return (
    <div className="App">
      {/* Barra di navigazione */}
      <NavBar />
      {/* Contenuto principale con padding superiore per evitare sovrapposizioni con la navbar */}
      <main style={{ paddingTop: '5rem' }}>
        <MainPage />
      </main>
      {/* Footer dell'applicazione */}
      <Footer />
    </div>
  );
}

// Esportazione del componente App
export default App;
