import React from 'react'
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap'

const AddAssistantsModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Assistants</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Modal content goes here</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onHide}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddAssistantsModal
