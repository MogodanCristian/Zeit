import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-block;
  width: 250px;
  height: 74vh;
  overflow-y: auto;
  margin-left: 30px;
  vertical-align: top;
  &:last-child {
    margin-right: 30px;
  }

`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  margin: 10px;
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background-color: gray;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Bucket = ({title}) => {
  return (
    <Container>
      <Title>{title.length > 50 ? title.substring(0, 50) + '...' : title}</Title>
      <Separator />
    </Container>
  );
};

export default Bucket;
