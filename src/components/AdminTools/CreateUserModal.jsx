import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Error = styled.span`
  font-size: medium;
  color: red;
`


const CreateUserModal = ({ show, onHide }) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [password, setPassword] = useState('');
  const [allGood, setAllGood] = useState(false)
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const generatePassword = () => {
    const length = 10;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?';
    let result = '';
    result += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    result += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    for (let i = 4; i < length; i++) {
      const chars = uppercase + lowercase + numbers + specialChars;
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return result;
  };
  

  const handleSubmit = () => {
    if (!firstName || !lastName || !email) {
      setError(true);
      setErrorMessage("Please fill in all required fields.");
      return;
  };
    const config = {
      headers: { 'auth-token': token }
    };
    const path = 'http://localhost:3000/api/users/register'
    axios.post(path, {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: role
      }, config)
    .then(response => {
      if(response.status  === 200)
      {
        setAllGood(true)
      }
    })
    .catch(error => {
      console.error('Error creating task', error);
    });
}

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group style={{marginTop:"10px"}} controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={handleFirstNameChange} />
          </Form.Group>
          <Form.Group style={{marginTop:"20px"}} controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={handleLastNameChange} />
          </Form.Group>
          <Form.Group style={{marginTop:"20px"}} controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmailChange} />
          </Form.Group>
          <Form.Group style={{marginTop:"20px"}} controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" value={role} onChange={handleRoleChange}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>
          <Form.Group style={{marginTop:"20px"}} controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="text" placeholder="Generated password" value={password} readOnly />
            <Button style={{marginTop:"20px"}} variant="primary" onClick={() => setPassword(generatePassword())}>
              Generate Password
            </Button>
          </Form.Group>
        </Form>
        {error && <Error>{errorMessage}</Error>}
        {allGood && <span>User creat cu succes!</span>}
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Create User
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateUserModal
