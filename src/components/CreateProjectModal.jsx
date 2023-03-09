import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const CreateProjectModal = ({ show, onHide }) => {
  const today = new Date().toISOString().substr(0, 10);
  return (
    <Modal show={show} onHide={onHide}>
  <Modal.Header closeButton>
    <Modal.Title>Create Project</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formTitle" className="mt-3">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder="Enter title..." />
      </Form.Group>
      <Form.Group controlId="formDescription" className="mt-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="Enter description..." />
      </Form.Group>
      <Form.Group controlId="formStartDate" className="mt-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control type="date" min={today} defaultValue={today}/>
      </Form.Group>
      <Form.Group controlId="formStartTime" className="mt-3">
        <Form.Label>Start Time</Form.Label>
        <Form.Control type="time" defaultValue="00:00" />
      </Form.Group>
      <Form.Group controlId="formEndDate" className="mt-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control type="date" min={today} defaultValue={today}/>
      </Form.Group>
      <Form.Group controlId="formEndTime" className="mt-3">
        <Form.Label>End Time</Form.Label>
        <Form.Control type="time" defaultValue="00:00" />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" >Create</Button>
  </Modal.Footer>
</Modal>
  )
}

export default CreateProjectModal