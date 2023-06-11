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

const EditButton = styled(Button)`
  margin-left: 10px;
`;

const Error = styled.span`
  font-size: medium;
  color: red;
`;

const EditUserModal = ({
  show,
  onHide,
  makeVisible,
  namesChanged,
  modifyNamesChanged,
}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);
  const [employeeDetails, setEmployeeDetails] = useState(false);
  const [allGood, setAllGood] = useState(false);
  const [error, setError] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [errorMessage, setErrorMessage] = useState('');
  const [employeeID, setEmployeeID] = useState(null);

  const user = useSelector((state) => state.user.currentUser);

  const config = {
    headers: { 'auth-token': token },
  };

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/users/', config)
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

  const handleSubmit = () => {
    if (employeeID) {
      axios
        .put('http://localhost:3000/api/users/' + employeeID, {
          first_name: firstName,
          last_name: lastName,
          email: email,
          role: role,
        }, config)
        .then((response) => {
          if (response.status === 200) {
            setAllGood(true);
            modifyNamesChanged();
            onHide()
          }
        });
    }
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const getEmployeeDetails = (employee) => {
    const config = {
      headers: { 'auth-token': token },
    };
    axios
      .get('http://localhost:3000/api/users/getDetails/' + employee._id, config)
      .then((response) => {
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
        setRole(response.data.role);
        setEmployeeID(response.data._id);
      });
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Edit employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employees.map((employee) => (
            <EmployeeBox key={employee._id}>
              <EmployeeName>
                {employee.first_name} {employee.last_name}
              </EmployeeName>
              {employee._id !== user._id && (
                <EditButton
                  variant="primary"
                  onClick={() => {
                    setEmployeeDetails(true);
                    onHide();
                    getEmployeeDetails(employee);
                  }}
                >
                  Edit
                </EditButton>
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

      <Modal show={employeeDetails} onHide={() => setEmployeeDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group style={{ marginTop: '10px' }} controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </Form.Group>
            <Form.Group style={{ marginTop: '20px' }} controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </Form.Group>
            <Form.Group style={{ marginTop: '20px' }} controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>
            <Form.Group style={{ marginTop: '20px' }} controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>

          </Form>
          {error && <Error>{errorMessage}</Error>}
          {allGood && (
            <span style={{ color: 'green' }}>User editat cu succes!</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setEmployeeDetails(false);
              makeVisible();
              setAllGood(false);
            }}
          >
            Back
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Edit User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditUserModal;
