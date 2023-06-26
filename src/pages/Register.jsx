import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const OuterContainer = styled.div`
  background-color: #060b26;
`;

const InnerContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: white;
  height: 50vh + 20px;
  align-items: center;
  flex-direction: column;
  display: flex;
  border-radius: 10px;

  @media only screen and (max-width: 768px) {
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  width: 100%;
  margin: 20px 0;
  padding: 10px;
  font-size: medium;
`;

const Button = styled.button`
  width: 100px;
  border: none;
  padding: 15px 20px;
  background-color: #122dc2;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  border-radius: 10px;

  &:hover {
    background-color: #1a83ff;
  }
`;

const Error = styled.p`
  font-size: medium;
  color: red;
`;

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;

  const [errorPresence, setErrorPresence] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [allOK, setAllOK] = useState(false);
  const navigate = useNavigate()

  const handleClick = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      setErrorPresence(true);
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setErrorPresence(true);
      return;
    } else if (!isPasswordValid(password)) {
      setErrorMessage(getPasswordErrorMessage(password));
      setErrorPresence(true);
      return;
    } else {
      setErrorPresence(false);
      setErrorMessage('');
      axios
        .post(apiUrl + '/users/register', {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          role: 'admin',
        })
        .then((res) => {
          if (res.status === 200) {
            setAllOK(true);
          }
        });
    }
  };
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  const getPasswordErrorMessage = (password) => {
    if (password.length < 8) {
      return 'Password must contain at least 8 characters.';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one numeric digit (0-9).';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter (a-z).';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter (A-Z).';
    }
    if (!/(?=.*[^a-zA-Z0-9])/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    if (/\s/.test(password)) {
      return 'Password must not contain any whitespace.';
    }
    return 'Invalid password.';
  };

  const handleNavigateToLogin = () => {
    navigate('/login')
  };

  return (
    <OuterContainer>
      <InnerContainer>
        <Wrapper>
          <Title>Register</Title>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder='First Name'
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder='Last Name'
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='Password'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder='Confirm Password'
              type='password'
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button onClick={handleClick}>Register</Button>
            {errorPresence && <Error>{errorMessage}</Error>}
            {allOK && (
              <Button onClick={handleNavigateToLogin}>Navigate to Login</Button>
            )}
          </Form>
        </Wrapper>
      </InnerContainer>
    </OuterContainer>
  );
};

export default Register;
