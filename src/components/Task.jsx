import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import ThreeDotsToggle from './ThreeDotsToggle';
import MuiCheckbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskDetailsModal from './TaskDetailsModal';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  border: 1px solid gray;
  padding: 10px;
  justify-content: space-between;
  margin-top: 10px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const Title = styled.span`
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 30px);
`;

const Task = ({ title, _id, progress}) => {
  const [titleState, setTitleState] = useState(title)
  const [isChecked, setIsChecked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if(progress === "Done"){
      setIsChecked(true)
    }
  }, [])
  
  const showDetailsPage = () =>{
    setShowDetails(true)
  }

  const hideDetailsPage = () =>{
    setShowDetails(false);
  }
  const handleTaskUpdate = (taskName)=>{
    setTitleState(taskName)
  }
  const setToChecked = () =>{
    setIsChecked(true)
  }
  const Uncheck =() =>{
    setIsChecked(false)
  }
  return (
    <>
    <Container >
      <MuiCheckbox
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleIcon />}
        checked={isChecked}
      />
      <Title onClick={showDetailsPage}>{titleState}</Title>
      <Dropdown drop="left">
        <Dropdown.Toggle as={ThreeDotsToggle} />
        <Dropdown.Menu size="sm" title="" align="end">
          <Dropdown.Item>Edit...</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
          <Dropdown.Item>Move</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
    {showDetails && <TaskDetailsModal 
      show={showDetails} 
      onHide={hideDetailsPage} 
      _id={_id} 
      handleTaskUpdate={handleTaskUpdate}
      handleCheck={setToChecked}
      uncheck={Uncheck}/>}
    </>
  );
};

export default Task;
