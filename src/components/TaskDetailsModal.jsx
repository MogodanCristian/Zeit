import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const TaskDetailsModal = ({show, onHide, _id}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt)
  const [task, setTask] = useState(null)
  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    // const path = apiUrl+'/tasks/ + _id' 
    const path = 'http://localhost:3000/api/tasks/' + _id
    console.log(_id)
    axios.get(path, config)
      .then(response => {
        setTask(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        {task && <Modal.Title>{task[0].title}</Modal.Title>}
      </Modal.Header>
      <Modal.Body>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TaskDetailsModal