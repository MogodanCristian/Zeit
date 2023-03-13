import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: 80%;
  background-color: green;
  flex-wrap: wrap;
  min-width: fit-content;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Bucket = ({title}) => {
  return (
    <Container>
        <Title>{title}</Title>
    </Container>
  )
}

export default Bucket