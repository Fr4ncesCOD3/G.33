import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import FilmCardComponent from './FilmCardComponent';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileSettings = ({ onBack }) => {
  const [userProfile, setUserProfile] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    avatar: localStorage.getItem('userAvatar') || '/avatar.png'
  });

  const [savedFilms, setSavedFilms] = useState(
    JSON.parse(localStorage.getItem('savedFilms')) || []
  );

  const [showAlert, setShowAlert] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', userProfile.name);
    localStorage.setItem('userEmail', userProfile.email);
    localStorage.setItem('userAvatar', userProfile.avatar);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleRemoveFilm = (filmId) => {
    const updatedFilms = savedFilms.filter(film => film.imdbID !== filmId);
    setSavedFilms(updatedFilms);
    localStorage.setItem('savedFilms', JSON.stringify(updatedFilms));
  };

  return (
    <Container fluid className="py-5 bg-black text-white">
      <Button variant="outline-light" onClick={onBack} className="mb-4">
        ← Torna alla Home
      </Button>

      {showAlert && (
        <Alert variant="success" className="mb-4">
          Profilo aggiornato con successo!
        </Alert>
      )}

      <Row>
        <Col md={4} className="mb-4">
          <div className="profile-section p-4 bg-dark rounded">
            <h2 className="mb-4">Impostazioni Profilo</h2>
            <Form onSubmit={handleProfileUpdate}>
              <div className="text-center mb-4">
                <img 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Button variant="danger" type="submit" className="w-100">
                Salva Modifiche
              </Button>
            </Form>
          </div>
        </Col>

        <Col md={8}>
          <div className="saved-films-section">
            <h2 className="mb-4">La Mia Lista</h2>
            <div className="film-carousel">
              <Row className="flex-nowrap overflow-auto">
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

export default ProfileSettings;
