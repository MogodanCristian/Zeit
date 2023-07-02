import React from 'react';
import styled from 'styled-components';
import logo from './logo.png';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row; 
`;

const LogoImage = styled.img`
  width: 85px;
  height: auto;
`;

const SubText = styled.h2`
  font-size: 20px;
  color: white;
  margin-top: 5px;
  text-align: center;
`;

const AppName = styled.h1`
  font-size: 50px;
  margin-top: 10px;
  color: white;
  display: inline;
`;

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
`;

const Logo = () => {
  return (
    <OuterContainer>
      <LogoContainer>
        <AppName>Zeit</AppName>
        <LogoImage src={logo} alt="Zeit Logo" />
      </LogoContainer>
      <SubText>Time to get to work!</SubText>
    </OuterContainer>
  );
}

export default Logo;
