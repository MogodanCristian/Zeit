import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { loginFailure, loginStart, loginSuccess, keepLogged } from '../redux/userReducer'; 
import jwt from 'jwt-decode'

const OuterContainer = styled.div`
 background-color: #060b26;`

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

  @media only screen and (max-width: 768px) {
    width: 90%;}
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
  width:100%;
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
  border-radius:10px;

  &:hover {
      background-color: #1a83ff;
    }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Checkbox = styled.input.attrs({type: 'checkbox'})`
  
`
const ForgotPassword = styled.span`
    margin-top: 10px;
    font-size: medium;
`

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedToggle, setKeepLoggedToggle]= useState(false)
  const { isFetching, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const user = useSelector((state)=> state.user.currentUser)

  const handlePersistance = () =>{
    setKeepLoggedToggle(!keepLoggedToggle)
  }
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
        console.log(user)
        if(keepLoggedToggle)
        {
          dispatch(keepLogged({user, token}))
        }
        dispatch(loginSuccess({user, token}))
        navigate("/")
        console.log(user)
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
              placeholder="Email"
              onChange={(e) => setUsername(e.target.value)}
              />
            <Input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              />
            <Button onClick={handleClick}>
              Login
            </Button>
            <CheckboxContainer>
              <Checkbox onChange={handlePersistance} checked={keepLoggedToggle}/>
              <span>Keep me logged in</span>
            </CheckboxContainer>
            <ForgotPassword>Forgot password? Click <Link to={'/forgot_password'}>here</Link>!
            </ForgotPassword>
          </Form>
        </Wrapper>
      </InnerContainer>
    </OuterContainer>
  )
}

export default Login
