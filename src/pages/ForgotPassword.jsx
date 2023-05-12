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
  height: 50vh+20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 10px;

  @media only screen and (max-width: 768px) {
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: medium;
  min-width: 40%;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: fit-content;
  padding: 15px 20px;
  margin-bottom: 20px;
  border: none;
  border-radius: 10px;
  background-color: #122dc2;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #1a83ff;
  }
`;

const Error = styled.p`
  font-size: medium;
  color: red;
`


function generateCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

const ForgotPassword = () => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('')
  const [codeField, setCodeField] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if(email){
      let dummyCode = generateCode()
      setCode(dummyCode)
      axios.post('http://localhost:3000/api/users/sendEmail/forgotPassword',{
        recip: email,
        subject: "Password change",
        content: 'Your password change code is ' + dummyCode
      }).then(response =>{
        console.log(response)
      })
      setIsSubmitted(true);
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <OuterContainer>
      <InnerContainer>
        <Wrapper>
          <Title>Forgot password</Title>
          <Form>
            <Input type="email" placeholder="Enter recovery email" value={email} onChange={handleEmailChange} />
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
           {isSubmitted && <Input onChange={(e) =>{setCodeField(e.target.value)}}placeholder='Enter recovery code'/>}
           {isSubmitted && <Button onClick={(e) =>{
            e.preventDefault()
            if(code)
            {
              if(code === codeField)
              {
                console.log(email)
                axios.post('http://localhost:3000/api/users/findByEmail', {
                  email:email
                }).then(response =>{
                  if(response.data){
                    navigate('/changePassword/'+response.data._id)
                  }
                  else{
                    setErrorMessage("You are not registered!")
                  }
                })
              }
            }
           }}>Submit code</Button>}
          </Form>
          {errorMessage && <Error>{errorMessage}</Error>}
        </Wrapper>
      </InnerContainer>
    </OuterContainer>
  );
};

export default ForgotPassword;
