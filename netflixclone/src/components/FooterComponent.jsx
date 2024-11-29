// Importazione delle dipendenze necessarie
import React from 'react';
// Importazione dei componenti Bootstrap necessari per il layout
import { Container, Row, Col } from 'react-bootstrap';
// Importazione delle icone social da react-icons
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs';

// Componente Footer che contiene la struttura del piè di pagina
const FooterComp = () => {
  return (
    // Footer con sfondo nero e testo grigio
    <footer className="bg-black text-secondary py-5">
      <Container>
        {/* Sezione delle icone social */}
        <Row className="mb-4">
          <Col>
            {/* Icone social con spaziatura e dimensione aumentata */}
            <BsFacebook className="me-3 fs-4" />
            <BsInstagram className="me-3 fs-4" />
            <BsTwitter className="me-3 fs-4" />
            <BsYoutube className="fs-4" />
          </Col>
        </Row>

        {/* Griglia dei link del footer organizzata in 4 colonne */}
        <Row>
          {/* Prima colonna di link */}
          <Col xs={12} sm={6} md={3}>
            <ul className="list-unstyled">
              <li><a href="#audio" className="text-secondary text-decoration-none">Audio and Subtitles</a></li>
              <li><a href="#media" className="text-secondary text-decoration-none">Media Center</a></li>
              <li><a href="#privacy" className="text-secondary text-decoration-none">Privacy</a></li>
              <li><a href="#contact" className="text-secondary text-decoration-none">Contact Us</a></li>
            </ul>
          </Col>
          
          {/* Seconda colonna di link */}
          <Col xs={12} sm={6} md={3}>
            <ul className="list-unstyled">
              <li><a href="#description" className="text-secondary text-decoration-none">Audio Description</a></li>
              <li><a href="#investor" className="text-secondary text-decoration-none">Investor Relations</a></li>
              <li><a href="#legal" className="text-secondary text-decoration-none">Legal Notices</a></li>
            </ul>
          </Col>

          {/* Terza colonna di link */}
          <Col xs={12} sm={6} md={3}>
            <ul className="list-unstyled">
              <li><a href="#help" className="text-secondary text-decoration-none">Help Center</a></li>
              <li><a href="#jobs" className="text-secondary text-decoration-none">Jobs</a></li>
              <li><a href="#cookies" className="text-secondary text-decoration-none">Cookie Preferences</a></li>
            </ul>
          </Col>

          {/* Quarta colonna di link */}
          <Col xs={12} sm={6} md={3}>
            <ul className="list-unstyled">
              <li><a href="#gift" className="text-secondary text-decoration-none">Gift Cards</a></li>
              <li><a href="#terms" className="text-secondary text-decoration-none">Terms of Use</a></li>
              <li><a href="#corporate" className="text-secondary text-decoration-none">Corporate Information</a></li>
            </ul>
          </Col>
        </Row>

        {/* Bottone del codice servizio */}
        <Row className="mt-4">
          <Col>
            <button className="btn btn-outline-secondary btn-sm">Service Code</button>
          </Col>
        </Row>

        {/* Informazioni sul copyright con anno dinamico */}
        <Row className="mt-4">
          <Col>
            <small>© 1997-{new Date().getFullYear()} Netflix, Inc.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

// Esportazione del componente per l'utilizzo in altre parti dell'applicazione
export default FooterComp;
