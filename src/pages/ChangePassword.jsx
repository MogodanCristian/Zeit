import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
  height: 50vh+20px;
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
  width: fit-content;
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

const Error = styled.p`
  font-size: medium;
  color: red;
`
function getUserIdFromUrl(url) {
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split('/');
  return pathSegments[pathSegments.length - 1];
}

const ChangePassword = () => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword]=useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [allDone,setAllDone] = useState(false)
  return (
    <OuterContainer>
    <InnerContainer>
      <Wrapper>
        <Title>Change password</Title>
        <Form>
          <Input
            placeholder="Password"
            type="password"
            onChange={(e) =>{setPassword(e.target.value)}}
            />
          <Input
            placeholder="Confirm password"
            type="password"
            onChange={(e) =>{setConfirmPassword(e.target.value)}}
            />
          <Button onClick={(e)=>{
            e.preventDefault( )
            if(password && confirmPassword)
            {
              if(password === confirmPassword){
                const _id=getUserIdFromUrl(window.location.href);
                axios.patch('http://localhost:3000/api/users/changePassword/'+_id,{
                  password: password
                }).then(response =>{
                 if(response.status === 200)
                 {
                  setAllDone(true)
                  setErrorMessage('')
                 }
                })
              }
              else{
                setErrorMessage("Passwords don't match!")
                setAllDone(false)
              }
            }
          }}>Change</Button>
        </Form>
        {errorMessage && <Error>{errorMessage}</Error>}
        {allDone && <span>Password changed succesfully!</span>}
        {allDone && <Button style={{marginTop:"10px"}}onClick={(e) =>{
          e.preventDefault()
          navigate('/login')
        }}>Move to login</Button>}
      </Wrapper>
    </InnerContainer>
  </OuterContainer>
  )
}

export default ChangePassword