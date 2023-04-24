import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from 'axios'

const EmployeeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
`

const AssignTaskModal = ({ show, onHide , _id}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  
  const token = useSelector((state) => state.user.jwt)

  const [employees, setEmployees] = useState([])
  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = 'http://localhost:3000/api/tasks/getProject/'+ _id
    axios.get(path, config).then(response => {
      const project = response.data
      axios.get('http://localhost:3000/api/projects/getAvailableEmployees/' + project._id).then(availableRes =>{
        setEmployees(availableRes.data)
      }).catch(error => {
      console.log(error);
    });
    }).catch(error => {
      console.log(error);
    });
  }, [])
  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          employees.map((item) => (
            <EmployeeBox>
              <div>{item.first_name} {item.last_name}</div>
            </EmployeeBox>
        ))}
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

export default AssignTaskModal
