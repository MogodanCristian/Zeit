import React from 'react';
import Card from 'react-bootstrap/Card';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import "bootstrap/dist/css/bootstrap.min.css";

const StyledCard = styled(Card)`
  margin: 20px;
`;

const StyledDropdownButton = styled(DropdownButton)`
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  --bs-btn-color: #fff;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: transparent !important;
    --bs-btn-hover-border-color: transparent !important;
    --bs-btn-focus-shadow-rgb: 49,132,253;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: transparent !important;
    --bs-btn-active-border-color: transparent !important;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #fff;
    --bs-btn-disabled-bg: transparent !important;
    --bs-btn-disabled-border-color: transparent !important;
  
  .dropdown-toggle::after {
    color: transparent !important;
    box-shadow: none !important;
  }

  &:active, &:focus, &:hover {
    background-color: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }

  .dropdown-toggle {
    background-color: transparent !important;
    box-shadow: none !important;
    color: inherit !important;
  }

  &.show {
    background-color: transparent !important;
    box-shadow: none !important;
    color: inherit !important;

    .dropdown-toggle::after {
      color: inherit !important;
      box-shadow: none !important;
    }
  }
`;

const ProjectCard = ({title, description, index}) => {
  const randomColor = `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 70) + 30}%, ${Math.floor(Math.random() * 40) + 10}%)`;
  return (
    <StyledCard 
      text={'white'}
      style={{ width: '18rem', backgroundColor: randomColor}}
      className="mb-2"
    >
      <StyledCard.Header>
        <StyledDropdownButton id="dropdown-basic-button"title={'Options'}>
          <Dropdown.Item href="#action/1">Action</Dropdown.Item>
          <Dropdown.Item href="#action/2">Another action</Dropdown.Item>
          <Dropdown.Item href="#action/3">Something else</Dropdown.Item>
        </StyledDropdownButton>
      </StyledCard.Header>
      <StyledCard.Body>
        <StyledCard.Title>{title} </StyledCard.Title>
        <StyledCard.Text>
          {description}
        </StyledCard.Text>
      </StyledCard.Body>
    </StyledCard>
  );
};
export default ProjectCard;