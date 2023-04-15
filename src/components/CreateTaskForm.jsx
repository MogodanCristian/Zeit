import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const FormContainer = styled.div`
  border-radius: 5px;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  margin-top: 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid gray;
`;

const InputGroup = styled(Form.Group)`
  margin-bottom: 1rem;
`;

const Label = styled(Form.Label)`
  font-weight: bold;
`;

const StyledButton = styled(Button)`
    width: 100%;
`

const CreateTaskForm = ({bucketID, onTaskCreated, onHide}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);
  const inputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Low');

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleCreateTask = () => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/tasks/'+ bucketID
    axios.post(path, {
       title: title,
       priority: priority
      }, config)
    .then(response => {
      onTaskCreated(response.data)
    })
    .catch(error => {
      console.error('Error creating task', error);
    });
  }

  return (
    <FormContainer>
      <Form>
        <InputGroup>
          <Label>Title</Label>
          <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} ref={inputRef}/>
        </InputGroup>
        <InputGroup>
          <Label>Priority</Label>
          <Form.Control as="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </Form.Control>
        </InputGroup>
      </Form>
      <StyledButton variant="primary" type="submit" onClick={handleCreateTask}>Create Task</StyledButton>
    </FormContainer>
  );
};

export default CreateTaskForm;
