// Importazione delle dipendenze necessarie da React e React Bootstrap
import React from 'react';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
// Importazione delle icone dalla libreria react-icons
import { BsBell, BsSearch } from 'react-icons/bs';

// Componente della barra di navigazione principale
const NavbarComponent = () => {
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
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#series">Serie TV</Nav.Link>
            <Nav.Link href="#movies">Film</Nav.Link>
            <Nav.Link href="#new">Nuovi Arrivi</Nav.Link>
            <Nav.Link href="#mylist">La mia lista</Nav.Link>
          </Nav>

          {/* Menu destro con ricerca, sezione bambini, notifiche e profilo */}
          <Nav className="d-flex align-items-center">
            {/* Form di ricerca con icona */}
            <Form className="d-flex mx-2">
              <Button variant="outline-light">
                <BsSearch />
              </Button>
            </Form>
            {/* Link alla sezione bambini */}
            <Nav.Link href="#kids">BAMBINI</Nav.Link>
            {/* Icona notifiche */}
            <Nav.Link href="#notifications">
              <BsBell />
            </Nav.Link>
            {/* Avatar profilo utente */}
            <Nav.Link href="#profile">
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
