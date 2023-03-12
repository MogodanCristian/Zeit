import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Error = styled.span`
  font-size: medium;
  color: red;
`

const CreateProjectModal = ({ show, onHide }) => {
  const today = new Date().toISOString().substr(0, 10);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState('00:00');
  const token = useSelector((state) => state.user.jwt); 
  const user = useSelector((state) => state.user.currentUser);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreate = () => {
    if (title.trim() === '' || description.trim() === '' || startDate.trim() === '' || startTime.trim() === '' || endDate.trim() === '' || endTime.trim() === '') {
      setError(true);
      setErrorMessage("You can't leave any field empty!")
    } else {
      console.log(user._id)
      const startDateTime = new Date(`${startDate}T${startTime}:00`).toISOString();
      const endDateTime = new Date(`${endDate}T${endTime}:00`).toISOString();
      if(startDateTime>endDateTime){
        setError(true);
        setErrorMessage("You can't set the start date higher than the end date!")
        return
      }
      console.log(startDateTime)
      console.log(token)
      const config = {
        headers: { 'auth-token': token }
      };
      const path = 'http://3.69.101.106:3080/api/projects/'+user._id
      console.log(path)
      axios.post(path,{
        title: title,
        description: description,
        start_date: startDateTime,
        end_date: endDateTime
      }, config).then(() => {
        onHide();
        window.location.reload();
      }).catch((error) => {
        console.log(error);
      });
    }
  };
  return (
    <>
    <Modal show={show} onHide={() => {
      setError(false);
      onHide();
  }}>
      <Modal.Header closeButton>
        <Modal.Title>Create Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle" className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter title..." onChange={(event) => setTitle(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter description..." onChange={(event) => setDescription(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formStartDate" className="mt-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" min={today} defaultValue={today} onChange={(event) => setStartDate(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formStartTime" className="mt-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" defaultValue="00:00" onChange={(event) => setStartTime(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEndDate" className="mt-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" min={today} defaultValue={today} onChange={(event) => setEndDate(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEndTime" className="mt-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" defaultValue="00:00" onChange={(event) => setEndTime(event.target.value)} />
          </Form.Group>
        </Form>
        {error && <Error>{errorMessage}</Error>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
        setError(false);
        onHide();
    }}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
  }  

export default CreateProjectModal
