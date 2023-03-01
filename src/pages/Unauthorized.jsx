import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css"
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: #333;
`

const Description = styled.p`
  font-size: 1.5rem;
  color: #555;
`

const Unauthorized = () => {
  return (
    <Container>
      <Title>Unauthorized</Title>
      <Description>You do not have permission to access this page. Click the button below to go back to the dashboard.</Description>
      <Link to={'/'}>
          <Button>Go back to the dashboard</Button>
      </Link>
    </Container>
  )
}

export default Unauthorized