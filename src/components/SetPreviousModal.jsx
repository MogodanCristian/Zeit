import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios';
import { useSelector } from 'react-redux';
import TaskBox from './TaskBox';

const SetPreviousModal = ({ show, onHide, _id}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt)

  const [tasks, setTasks] = useState([])
  const [assigned, setAssigned] = useState(null)

  const assignTask = (task) => {
    setAssigned(task);
  }

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    axios.get('http://localhost:3000/api/tasks/getRemainingTasks/' +_id)
    .then(res => {
      setTasks(res.data)
      console.log(res.data)
      axios.get(apiUrl + '/tasks/' + _id, config).then(originalTask =>{
        console.log(originalTask.data)
        setAssigned(res.data.find(task => originalTask.data[0].previous === task._id))
      })
    })
  }, [])
  const handleSaveChanges = () =>{
    if(assigned){
      const config = {
        headers: { 'auth-token': token }
      };
      axios.put(apiUrl+ '/tasks/' +_id,{
        previous: assigned._id
      }, config)
    }
    else{
      const config = {
        headers: { 'auth-token': token }
      };
      axios.put(apiUrl+ '/tasks/' +_id,{
        previous: null
      }, config)
    }
}
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Set Previous</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {tasks.length !== 0 ? 
        (tasks.map(task => (
          <TaskBox key={task._id} task={task} isAssigned={assigned && assigned._id === task._id} assignTask={assignTask}/>
        )))
      : <span>No tasks yet!</span>}
      <Button onClick={() => {
        setAssigned(null)
      }}>Set no task as previous...</Button>
    </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={() =>{
          handleSaveChanges()
          onHide()
        }}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


export default SetPreviousModal
