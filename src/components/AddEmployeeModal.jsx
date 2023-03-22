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

const SearchInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
  width: 100%;
`;

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
  const [allEmployees, setAllEmployees] = useState([]);
  const [displayedEmployees, setDisplayedEmployees] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = 'http://localhost:3000/api/users/availableEmployees/'+projectID;
    axios.get(path, config)
      .then(response => {
        const employeesWithAddedField = response.data.map(employee => ({ ...employee, added: false }));
        setAllEmployees(employeesWithAddedField);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === "") {
      setDisplayedEmployees([]);
    } else {
      const filteredEmployees = allEmployees.filter((employee) => {
        const fullName = employee.first_name + " " + employee.last_name;
        return fullName.toLowerCase().includes(query.toLowerCase());
      });
      setDisplayedEmployees(filteredEmployees);
    }
  };
  const handleAddClick = (index, employee_id) => {
    const updatedEmployees = [...displayedEmployees];
    updatedEmployees[index] = { ...updatedEmployees[index], added: true };
    setDisplayedEmployees(updatedEmployees);

    const updatedAllEmployees = allEmployees.map((employee) => {
      if (employee._id === employee_id) {
        return { ...employee, added: true };
      } else {
        return employee;
      }
    });
    setAllEmployees(updatedAllEmployees);

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
    <Modal show={show} onHide={() => {
      const employeeAdded = allEmployees.some((employee) => employee.added);
      if (employeeAdded) {
        window.location.reload();
      }
      setDisplayedEmployees([])
      onHide()
    }}>
      <Modal.Header closeButton>
        <Modal.Title>List of Employees</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchInput placeholder='Search the name of employees...' onChange={handleSearch}/>
        {displayedEmployees.length === 0 ? 
        (
          <p>No employees to display.</p>
        ) : 
        (
          displayedEmployees.map((employee, index) => (
            <EmployeeBox key={index}>
              <div>{employee.first_name} {employee.last_name}</div>
              {
                employee.added ? (
                <span style={{color:'green'}}>✓ Added</span>
              ) : (
                <Button variant="primary" size="sm" onClick={() => handleAddClick(index, employee._id)}>Add</Button>
              )}
            </EmployeeBox>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          const employeeAdded = allEmployees.some((employee) => employee.added);
          if (employeeAdded) {
            window.location.reload();
          }
          setDisplayedEmployees([])
          onHide()
        }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEmployeeModal;
