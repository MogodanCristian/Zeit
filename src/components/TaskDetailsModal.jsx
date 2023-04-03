import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const TaskDetailsModal = ({show, onHide, _id}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  
  const token = useSelector((state) => state.user.jwt)
  const user = useSelector((state) => state.user.currentUser);
  
  const [task, setTask] = useState(null)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [progress, setProgress] = useState('Not Started');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [repeat, setRepeat] = useState('does not repeat');
  
  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/tasks/' + _id
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
        <Modal.Title>Task Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
  {task ? (
    <Form>
      <Form.Group>
        <Form.Label>Title:</Form.Label>
        <Form.Control
          type="text"
          defaultValue={task[0].title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description:</Form.Label>
        <Form.Control
          as={"textarea"}
          rows={2}
          defaultValue={task[0].description}
          onChange={(e) =>
            setTask({ ...task, description: e.target.value })
          }
        />
      </Form.Group>
      <FormRow>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>Priority:</Form.Label>
          <Form.Select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </Form.Select>
        </Form.Group>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>Progress:</Form.Label>
          <Form.Select aria-label="Progress">
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </Form.Select>
        </Form.Group>
      </FormRow>

      <FormRow>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>Start Date:</Form.Label>
          <Form.Control
            type="date"
            defaultValue={task.startDate}
            onChange={(e) =>
              setTask({ ...task, startDate: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>Start Time</Form.Label>
          <Form.Control type="time" defaultValue="00:00"/>
        </Form.Group>
        </FormRow>
        
        <FormRow>
          <Form.Group style={{ width: "48%" }}>
            <Form.Label>End Date:</Form.Label>
            <Form.Control
              type="date"
              defaultValue={task.endDate}
              onChange={(e) =>
                setTask({ ...task, endDate: e.target.value })
              }
              />
          </Form.Group>
          <Form.Group style={{ width: "48%" }}>
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" defaultValue="00:00"/>
        </Form.Group>
        </FormRow>
        {user.role === 'employee' && <FormRow>
          <Button>Ask for help...</Button>
        </FormRow>}
    </Form>
  ) : (
    <p>Loading...</p>
  )}
  </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TaskDetailsModal