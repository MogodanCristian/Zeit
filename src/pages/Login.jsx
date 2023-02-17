import React, { useState } from 'react'
import styled from 'styled-components'
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { loginFailure, loginStart, loginSuccess } from '../redux/userReducer'; 
import jwt from 'jwt-decode'

const OuterContainer = styled.div``

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
  height: 50vh;
  align-items: center;
  flex-direction: column;
  display: flex;
  border-radius: 10px;
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
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 50%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius:10px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Checkbox = styled.input.attrs({type: 'checkbox'})`
  
`

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const user = useSelector((state)=> state.user.currentUser)
  
  const handleClick = (e) => {
    e.preventDefault();
    dispatch(loginStart())
    try {
       axios.post("http://3.69.101.106:3080/api/auth/login", {
        email: username,
        password: password
      }).then((response) =>{
        const token = response.data;
        const user = jwt(token)
        dispatch(loginSuccess(user))
        navigate("/")
      })
    } catch (error) {
      dispatch(loginFailure())
    }
  };

  return (
    <OuterContainer>
      <InnerContainer>
        <Wrapper>
          <Title>SIGN IN</Title>
          <Form>
            <Input
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              />
            <Input
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              />
            <Button onClick={handleClick}>
              Login
            </Button>
            <CheckboxContainer>
              <Checkbox/>
              <span>Keep me logged in</span>
            </CheckboxContainer>
          </Form>
        </Wrapper>
      </InnerContainer>
    </OuterContainer>
  )
}

export default Login
