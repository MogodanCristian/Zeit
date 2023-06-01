import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EmployeeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 15px;
`;

const AddAssistantsModal = ({ show, onHide, taskID }) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);

  const [employees, setEmployees] = useState([]);
  const [addedEmployees, setAddedEmployees] = useState([]);

  const config = {
    headers: { 'auth-token': token },
  };

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/tasks/getProject/' + taskID, config)
      .then((response) => {
        axios
          .get(
            'http://localhost:3000/api/projects/' +
              response.data._id +
              '/employees',
            config
          )
          .then((employeeRes) => {
            setEmployees(employeeRes.data);
          });
      })
      axios.get('http://localhost:3000/api/tasks/'+taskID, config)
      .then(response =>{  
        console.log(response.data[0].assisted_by)
        setAddedEmployees(response.data[0].assisted_by)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddAssistant = (employee) => {
    setAddedEmployees((prevEmployees) => [...prevEmployees, employee._id]);
  };

  const handleRemoveAssistant = (employee) => {
    setAddedEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp !== employee._id)
    );
  };

  const isEmployeeAdded = (employee) => {
    for(let i in addedEmployees)
    {
      if(addedEmployees[i] == employee._id)
      return true
    }
    return false
  };

  const handleSubmit = () =>{
    console.log(addedEmployees)
    axios.put('http://localhost:3000/api/tasks/'+taskID,{
      assisted_by: addedEmployees
    },config)
      .then(response =>{
        console.log(response)
        if(response.status === 200)
        {
          onHide()
        }
      })
  }
  
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Assistants</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {employees &&
          employees.map((employee) => (
            <EmployeeBox key={employee._id}>
              <span>
                {employee.first_name} {employee.last_name}
              </span>
              {!isEmployeeAdded(employee) && addedEmployees ? (
                <Button
                  variant="primary"
                  onClick={() => handleAddAssistant(employee)}
                >
                  Add Assistant
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={() => handleRemoveAssistant(employee)}
          >
            Remove
          </Button>
              )}
            </EmployeeBox>
          ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAssistantsModal;
