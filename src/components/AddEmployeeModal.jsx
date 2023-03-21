import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const EmployeeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
`

function getProjectID() {
  const url = window.location.href;
  const parts = url.split("/");
  const projectsIndex = parts.indexOf("projects");
  return parts[projectsIndex + 1];
}

const AddEmployeeModal = ({ show, onHide}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt)
  const projectID = getProjectID()
  const [employees, setEmployees] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState([]);

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    // const path = apiUrl+'/users/' 
    const path = 'http://localhost:3000/api/users/availableEmployees/'+projectID
    axios.get(path, config)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleAddClick = (index, employee_id) => {
    setClickedIndexes([...clickedIndexes, index]);
    console.log(employee_id)
    const config = {
        headers: { 'auth-token': token }
      };
     const path = apiUrl+'/projects/addEmployee/' + projectID
     axios.patch(path,{
        employee_id: employee_id
      }, config).then(() => {
        console.log(response)
      }).catch((error) => {
        console.log(error);
      });

  }

  return (
    <Modal show={show} onHide={() =>{
        if(clickedIndexes.length !== 0)
        {
            window.location.reload()
        }
        onHide()
    }}>
      <Modal.Header closeButton>
        <Modal.Title>List of Employees</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {employees.length === 0 ? (
          <p>No employees available.</p>
        ) : (
          employees.map((employee, index) => (
            <EmployeeBox key={index}>
              <div>{employee.first_name} {employee.last_name}</div>
              {clickedIndexes.includes(index) ? (
                <span style={{color:'green'}}>✓ Added</span>
              ) : (
                <Button variant="primary" size="sm" onClick={() => handleAddClick(index, employee._id)}>Add</Button>
              )}
            </EmployeeBox>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() =>{
        if(clickedIndexes.length !== 0)
        {
            window.location.reload()
        }
        onHide()
    }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEmployeeModal;
