import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CreateBucketModal = ({show, onHide,projectID}) => {
  const token = useSelector((state) => state.user.jwt);
  const [title, setTitle] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }

  const handleCreateBucket = () => {
    const config = {
        headers: { 'auth-token': token }
      };
    const path = 'http://3.69.101.106:3080/api/buckets/'+ projectID
    axios.post(path, { title: title }, config)
    .then(response => {
      onHide();
      window.location.reload();
    })
    .catch(error => {
      console.error('Error creating bucket:', error);
      onHide();
    });
  }

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Create Bucket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title..." value={title} onChange={handleTitleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateBucket}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreateBucketModal;
