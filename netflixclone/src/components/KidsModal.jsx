import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const KidsModal = ({ show, onHide, onAccept }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="kids-modal"
    >
      <Modal.Header closeButton className="bg-dark text-white border-0">
        <Modal.Title>
          <span role="img" aria-label="baby">👶</span> Modalità Bambini
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p>Attivando la modalità bambini:</p>
          <ul>
            <li>Verranno mostrati solo cartoni animati</li>
            <li>I contenuti saranno filtrati per età</li>
            <li>Saranno visibili solo contenuti con classificazione G, TV-Y, TV-Y7 e TV-G</li>
          </ul>
          <div className="alert alert-info">
            <small>
              <span role="img" aria-label="info">ℹ️</span> Per disattivare la modalità bambini, 
              clicca nuovamente sul pulsante BAMBINI nella barra di navigazione.
            </small>
          </div>
        </motion.div>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-0">
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button 
          variant="warning" 
          onClick={onAccept}
          style={{ backgroundColor: '#ffd700' }}
        >
          Attiva Modalità Bambini
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default KidsModal;