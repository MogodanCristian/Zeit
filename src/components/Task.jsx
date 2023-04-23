import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import ThreeDotsToggle from './ThreeDotsToggle';
import MuiCheckbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskDetailsModal from './TaskDetailsModal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AssignTaskModal from './AssignTaskModal';
import SetPreviousModal from './SetPreviousModal';
import AddAssistatsModal from './AddAssistantsModal';

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
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  
  const token = useSelector((state) => state.user.jwt)
  const user = useSelector((state) => state.user.currentUser);

  const [titleState, setTitleState] = useState(title)
  const [isChecked, setIsChecked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [showAssignTask, setShowAssignTask] = useState(false)
  const [showSetPrevious, setShowSetPrevious] = useState(false)
  const [showAddAssistants, setShowAddAssistants] = useState(false)

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
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/tasks/' + _id;

    axios.put(path,{
      completed_by: user
    }, config)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  const Uncheck =() =>{
    setIsChecked(false)
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/tasks/' + _id;

    axios.put(path,{
      completed_by: null
    }, config)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  return (
    <>
    <Container >
      <MuiCheckbox
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleIcon />}
        checked={isChecked}
      />
      <Title style={{textDecoration: isChecked? 'line-through' : 'none'}} onClick={showDetailsPage}>{titleState}</Title>
      <Dropdown drop="left">
        <Dropdown.Toggle as={ThreeDotsToggle} />
        <Dropdown.Menu size="sm" title="" align="end">
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
      Uncheck={Uncheck}
      showAssignTask={() =>{setShowAssignTask(true)}}
      showSetPrevious={() =>{setShowSetPrevious(true)}}
      showAddAssistants={() =>{setShowAddAssistants(true)}}/>}
      {showAssignTask && <AssignTaskModal
        show={showAssignTask}
        onHide={() => {
          setShowAssignTask(false)
          showDetailsPage()
        }}
      />}
      {showSetPrevious && <SetPreviousModal
          show={showSetPrevious}
          onHide={() =>{
            setShowSetPrevious(false)
            showDetailsPage();
          }}
          />
      }
      {showAddAssistants && <AddAssistatsModal
          show={showAddAssistants}
          onHide={() =>{
            setShowAddAssistants(false)
            showDetailsPage()
          }}
        />
      }
    </>
    
  );
};

export default Task;
