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

const ListEmployeesInProjectModal = ({ show, onHide}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt)
  const projectID = getProjectID()
  const [project, setProject] = useState("")
  const [employees, setEmployees] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState([]);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    // const path = apiUrl+'/users/' 
    const path = apiUrl + '/projects/'+ projectID +'/employees'
    axios.get(path, config)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error(error);
      });
      axios.get(apiUrl+'/projects/'+ projectID, config)
      .then(response =>{
        setProject(response.data)
      })
  }, []);

  const handleRemoveClick = (index, employee_id) => {
    setClickedIndexes([...clickedIndexes, index]);
    const config = {
        headers: { 'auth-token': token }
      };
     const path = apiUrl+'/projects/removeEmployee/' + projectID
     axios.patch(path,{
        employee_id: employee_id
      }, config).then(() => {
      }).catch((error) => {
        console.log(error);
      });
      axios.put('http://localhost:3000/api/tasks/setToUnassigned/' +projectID +'/'+employee_id)

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
        <p>Note that removing an employee will also make their assigned tasks unassigned.</p>
        {employees ? (
          employees.map((employee, index) => (
            <EmployeeBox key={index}>
              <div>{employee.first_name} {employee.last_name}</div>
              {clickedIndexes.includes(index) ? (
                <span style={{color:'red'}}>Removed</span>
              ) : (
                employee._id === project.manager_id ? <span>Manager</span> :
                (user.role === 'manager' && (
                  <Button variant="primary" size="sm" onClick={() => handleRemoveClick(index, employee._id)}>Remove</Button>
                ))
              )}
            </EmployeeBox>
          ))
        ) : (
          <div>No employees found.</div>
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

export default ListEmployeesInProjectModal;
