import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import "bootstrap/dist/css/bootstrap.min.css";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
}

const StyledCard = styled(Card)`
  margin: 20px;
`;

const StyledDropdownButton = styled(DropdownButton)`
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  
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

const ProjectCard = ({title, description, start_date, end_date, index}) => {
  const [bgColor, setBgColor] = useState(`hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 70) + 30}%, ${Math.floor(Math.random() * 40) + 10}%)`);
  
  return (
    <StyledCard 
      text={'white'}
      style={{ width: '18rem', backgroundColor: bgColor }}
      className="mb-2"
    >
      <StyledCard.Header>
        <StyledDropdownButton id="dropdown-basic-button"title={'Options'}>
          <Dropdown.Item href="#action/1">Edit...</Dropdown.Item>
          <Dropdown.Item href="#action/2">Delete</Dropdown.Item>
        </StyledDropdownButton>
      </StyledCard.Header>
      <StyledCard.Body>
        <StyledCard.Title>{title} </StyledCard.Title>
        <StyledCard.Text>
          {description}
        </StyledCard.Text>
        <StyledCard.Text>
          Start Date: {formatDate(start_date)}
        </StyledCard.Text>
        <StyledCard.Text>
          End Date: {formatDate(end_date)}
        </StyledCard.Text>
      </StyledCard.Body>
    </StyledCard>
  );
};
export default ProjectCard;