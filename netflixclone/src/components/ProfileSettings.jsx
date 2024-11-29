// Importazione delle dipendenze necessarie
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import FilmCardComponent from './FilmCardComponent';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Componente per la gestione delle impostazioni del profilo utente
 * @param {function} onBack - Funzione per tornare alla pagina precedente
 */
const ProfileSettings = ({ onBack }) => {
  // Stato per i dati del profilo utente, inizializzato dal localStorage
  const [userProfile, setUserProfile] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    avatar: localStorage.getItem('userAvatar') || '/avatar.png'
  });

  // Stato per i film salvati dall'utente, inizializzato dal localStorage
  const [savedFilms, setSavedFilms] = useState(
    JSON.parse(localStorage.getItem('savedFilms')) || []
  );

  // Stato per mostrare l'alert di conferma
  const [showAlert, setShowAlert] = useState(false);

  /**
   * param serve per prevenire il comportamento di default del form
   * se non viene passato l'evento e.preventDefault() il form viene inviato e si va su una nuova pagina
   * @param {Event} e - Evento del form
   */
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Salvataggio dei dati nel localStorage
    localStorage.setItem('userName', userProfile.name);
    localStorage.setItem('userEmail', userProfile.email);
    localStorage.setItem('userAvatar', userProfile.avatar);
    // Mostra l'alert di conferma per 3 secondi
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  /**
   * Rimuove un film dalla lista dei salvati
   * @param {string} filmId - ID del film da rimuovere
   */
  const handleRemoveFilm = (filmId) => {
    const updatedFilms = savedFilms.filter(film => film.imdbID !== filmId);
    setSavedFilms(updatedFilms);
    localStorage.setItem('savedFilms', JSON.stringify(updatedFilms));
  };

  return (
    // Container principale con sfondo nero e testo bianco
    <Container fluid className="py-5 bg-black text-white">
      {/* Pulsante per tornare alla home */}
      <Button variant="outline-light" onClick={onBack} className="mb-4">
        ← Torna alla Home
      </Button>

      {/* Alert di conferma aggiornamento profilo */}
      {showAlert && (
        <Alert variant="success" className="mb-4">
          Profilo aggiornato con successo!
        </Alert>
      )}

      <Row>
        {/* Colonna sinistra: Impostazioni profilo */}
        <Col md={4} className="mb-4">
          <div className="profile-section p-4 bg-dark rounded">
            <h2 className="mb-4">Impostazioni Profilo</h2>
            <Form onSubmit={handleProfileUpdate}>
              {/* Avatar utente */}
              <div className="text-center mb-4">
                <img 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              
              {/* Campo nome utente */}
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              {/* Campo email utente */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              {/* Pulsante salva modifiche */}
              <Button variant="danger" type="submit" className="w-100">
                Salva Modifiche
              </Button>
            </Form>
          </div>
        </Col>

        {/* Colonna destra: Lista film salvati */}
        <Col md={8}>
          <div className="saved-films-section">
            <h2 className="mb-4">La Mia Lista</h2>
            <div className="film-carousel">
              <Row className="flex-nowrap overflow-auto">
                {/* Animazione per la lista dei film */}
                <AnimatePresence>
                  {savedFilms.map(film => (
                    <motion.div
                      key={film.imdbID}
                      className="col-auto"
                      layout
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FilmCardComponent 
                        film={film} 
                        onRemove={handleRemoveFilm}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

// Esportazione del componente
export default ProfileSettings;
