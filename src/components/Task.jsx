import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import ThreeDotsToggle from './ThreeDotsToggle';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 250px;
  height: 50px;
  border: 1px solid gray;
  padding: 10px;
  justify-content: space-between;
  margin-top: 10px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;
const Title = styled.span``;

const Task = ({title}) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };
  
    return (
      <Container>
        <Checkbox
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <Title>{title}</Title>
        <Dropdown drop="left">
          <Dropdown.Toggle as={ThreeDotsToggle} />
          <Dropdown.Menu size="sm" title="" align="end" >
            <Dropdown.Item>Edit...</Dropdown.Item>
            <Dropdown.Item>Delete</Dropdown.Item>
            <Dropdown.Item>Move</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    );
}

export default Task