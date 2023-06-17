import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EmployeeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px 20px;
  margin-bottom: 10px;
`;

const EmployeeName = styled.div`
  font-size: 18px;
`;

const FireButton = styled(Button)`
  margin-left: 10px;
`;

const Error = styled.span`
  font-size: medium;
  color: red;
`;

const FireUserModal = ({
  show,
  onHide
}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);

  const user = useSelector((state) => state.user.currentUser);

  const config = {
    headers: { 'auth-token': token },
  };

  const [employees, setEmployees] = useState([]);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)

  useEffect(() => {
    axios
      .get(apiUrl+'/users/', config)
      .then((response) => {
        const activeEmployees = response.data.filter(
            (employee) => employee.account_active
          );
          setEmployees(activeEmployees);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = () => {
    if (employeeToDelete) {
      axios
        .delete(apiUrl+ '/users/' + employeeToDelete, config)
        .then((response) => {
            setShowConfirmDelete(false)
            window.location.reload()
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setEmployeeToDelete(null);
          
        });
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Edit employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employees.map((employee) => (
            <EmployeeBox key={employee.id}>
              <EmployeeName>
                {employee.first_name} {employee.last_name}
              </EmployeeName>
              {employee._id !== user._id && (
                <FireButton
                  variant="danger"
                  onClick={() => {
                    onHide();
                    setShowConfirmDelete(true)
                    setEmployeeToDelete(employee._id)
                    setFirstName(employee.first_name)
                    setLastName(employee.last_name)
                  }}
                >
                  Fire employee
                </FireButton>
              )}
            </EmployeeBox>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showConfirmDelete} onHide={() =>{setShowConfirmDelete(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to fire the employee "{firstName} {lastName}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() =>{setShowConfirmDelete(false)}}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FireUserModal;
