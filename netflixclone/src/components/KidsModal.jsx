// Importazione delle dipendenze necessarie
//non aggiunto come componente per mancanza di tempo


import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Componenti Modal e Button da React Bootstrap
import { motion } from 'framer-motion'; // Libreria per le animazioni

/**
 * Componente Modal per la modalità bambini
 * @param {boolean} show - Controlla la visibilità del modal
 * @param {function} onHide - Funzione per chiudere il modal
 * @param {function} onAccept - Funzione chiamata quando si accetta la modalità bambini
 */
const KidsModal = ({ show, onHide, onAccept }) => {
  return (
    // Modal principale con sfondo scuro e centrato
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="kids-modal"
    >
      {/* Header del modal con titolo */}
      <Modal.Header closeButton className="bg-dark text-white border-0">
        <Modal.Title>
          <span role="img" aria-label="baby">👶</span> Modalità Bambini
        </Modal.Title>
      </Modal.Header>

      {/* Corpo del modal con animazione di entrata */}
      <Modal.Body className="bg-dark text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Stato iniziale dell'animazione
          animate={{ opacity: 1, y: 0 }} // Stato finale dell'animazione
          transition={{ duration: 0.3 }} // Durata dell'animazione
        >
          <p>Attivando la modalità bambini:</p>
          {/* Lista delle caratteristiche della modalità bambini */}
          <ul>
            <li>Verranno mostrati solo cartoni animati</li>
            <li>I contenuti saranno filtrati per età</li>
            <li>Saranno visibili solo contenuti con classificazione G, TV-Y, TV-Y7 e TV-G</li>
          </ul>
          {/* Messaggio informativo per la disattivazione */}
          <div className="alert alert-info">
            <small>
              <span role="img" aria-label="info">ℹ️</span> Per disattivare la modalità bambini, 
              clicca nuovamente sul pulsante BAMBINI nella barra di navigazione.
            </small>
          </div>
        </motion.div>
      </Modal.Body>

      {/* Footer del modal con pulsanti di azione */}
      <Modal.Footer className="bg-dark border-0">
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button 
          variant="warning" 
          onClick={onAccept}
          style={{ backgroundColor: '#ffd700' }} // Colore giallo oro per il pulsante di attivazione
        >
          Attiva Modalità Bambini
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default KidsModal;