import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EmployeeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
`;

const ShowAllUsersModal = ({show, onHide}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);

  const config = {
    headers: { 'auth-token': token }
  };

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get(apiUrl+'/users/', config)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>All Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employees.map(employee => (
            <EmployeeBox>
              <div>{employee.first_name} {employee.last_name}</div>
            </EmployeeBox>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default ShowAllUsersModal;
