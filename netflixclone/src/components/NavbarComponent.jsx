// Importazione delle dipendenze necessarie da React e React Bootstrap
import React, { useState } from 'react';
import { Navbar, Nav, Container, Form } from 'react-bootstrap';
// Importazione delle icone dalla libreria react-icons
import { BsBell, BsSearch, BsX } from 'react-icons/bs';

// Componente della barra di navigazione principale
const NavbarComponent = ({ 
  onHomeClick, 
  onTVSeriesClick, 
  onMoviesClick, 
  onSearch, 
  onProfileClick,
  onKidsClick,
  isKidsMode 
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      onSearch(''); // Reset ricerca
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Passa la query al componente padre
  };

  return (
    // Navbar con sfondo nero, variante scura ed espandibile su schermi grandi
    <Navbar bg="black" variant="dark" expand="lg" className="py-2">
      {/* Container fluido per contenere tutti gli elementi della navbar */}
      <Container fluid>
        {/* Logo Netflix con link alla home */}
        <Navbar.Brand href="#home">
          <img
            src="/netflix_logo.png"
            height="30"
            alt="Netflix Logo"
          />
        </Navbar.Brand>

        {/* Pulsante hamburger per menu mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Contenuto collassabile della navbar */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Menu principale con link di navigazione */}
          <Nav className="me-auto">
            <Nav.Link onClick={onHomeClick}>Home</Nav.Link>
            <Nav.Link onClick={onTVSeriesClick}>Serie TV</Nav.Link>
            <Nav.Link onClick={onMoviesClick}>Film</Nav.Link>
            <Nav.Link href="#new">Nuovi Arrivi</Nav.Link>
            <Nav.Link href="#mylist">La mia lista</Nav.Link>
          </Nav>

          {/* Menu destro con ricerca, sezione bambini, notifiche e profilo */}
          <Nav className="d-flex align-items-center">
            <div className="search-container d-flex align-items-center">
              {showSearch && (
                <Form.Control
                  type="text"
                  placeholder="Titoli, persone, generi"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                  autoFocus
                />
              )}
              <div 
                className="search-icon-container" 
                onClick={handleSearchClick}
              >
                {showSearch ? <BsX size={20} /> : <BsSearch size={20} />}
              </div>
            </div>
            <Nav.Link 
              onClick={onKidsClick}
              className={`kids-mode-link ${isKidsMode ? 'active' : ''}`}
              style={{
                transition: 'all 0.3s ease',
                color: isKidsMode ? '#ffd700' : 'rgba(255,255,255,0.55)'
              }}
            >
              {isKidsMode ? '👶 BAMBINI' : 'BAMBINI'}
            </Nav.Link>
            {/* Icona notifiche */}
            <Nav.Link href="#notifications">
              <BsBell />
            </Nav.Link>
            {/* Avatar profilo utente */}
            <Nav.Link onClick={onProfileClick} className="d-flex align-items-center">
              <img
                src="/avatar.png"
                width="30"
                height="30"
                className="rounded"
                alt="Profile"
              />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Esportazione del componente per l'utilizzo in altre parti dell'applicazione
export default NavbarComponent;
