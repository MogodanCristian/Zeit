import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal } from 'react-bootstrap';
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
import MoveTaskModal from './MoveTaskModal';
import Tooltip from '@mui/material/Tooltip';

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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: calc(100% - 120px);
`;

const Exclamation = styled.span`
  color: red;
  font-size: 25px;
  font-family: "Pacifico";
`;

const Task = ({ title, _id, progress, removeFromBucket, bucketTitle, projectTitle, isTaskMoved,modifyIsTaskMoved}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  
  const token = useSelector((state) => state.user.jwt)
  const user = useSelector((state) => state.user.currentUser);

  const [titleState, setTitleState] = useState(title)
  const [isChecked, setIsChecked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isStuck, setIsStuck] = useState(false)
  const [priority, setPriority] = useState(null)
  const [difficulty, setDifficulty] = useState(null)

  const [showAssignTask, setShowAssignTask] = useState(false)
  const [showSetPrevious, setShowSetPrevious] = useState(false)
  const [showAddAssistants, setShowAddAssistants] = useState(false)

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)

  useEffect(() => {
    if(progress === "Done"){
      setIsChecked(true)
      setIsStuck(false)
    }
    if(progress === "Stuck"){
      setIsStuck(true)
    }
    else{
      setIsStuck(false)
    }
  }, [isTaskMoved,progress])
  
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
      completed_by: user,
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
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleStuck = async () => {
    console.log("Am intrat")
    setIsStuck(true);
    const config = {
      headers: { 'auth-token': token },
    };
    const path = apiUrl + '/tasks/' + _id;
    const subject = 'Help needed!';
    const body =
      'The employee ' +
      user.first_name +
      ' ' +
      user.last_name +
      ' is currently having problems with the task "' +
      title +
      '", from the bucket of tasks called "' +
      bucketTitle +
      '" and the project "' +
      projectTitle +
      '". Go investigate and take some measures regarding the issue.';
  
    try {
      const response = await axios.get(apiUrl + '/projects/' + projectTitle + '/getManager', config);
      if (user._id !== response.data.manager_id) {
        const messageRes = await axios.post(apiUrl + '/messages', {
          subject: subject,
          body: body,
          user: response.data.manager_id,
        }, config);
        console.log(messageRes)
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleUnstuck = () =>{
    setIsStuck(false)
  }

  const handleDelete = () =>{
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/tasks/' + _id;
    axios.delete(path,config)
    .then(response => {

    }).catch(error => {
        console.error(error);
      });
      removeFromBucket(_id)
  } 
  return (
    <>
    <Container >
      <MuiCheckbox
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleIcon />}
        checked={isChecked}
      />
      <div>
        {isStuck &&<Exclamation>!</Exclamation>}
        <Tooltip title={titleState.length > 20 ? titleState : ''}>
          <Title style={{textDecoration: isChecked? 'line-through' : 'none'}} onClick={showDetailsPage}>
            {titleState.length > 20 ? titleState.substring(0,20) + '...' : titleState}
          </Title>
        </Tooltip>
        
      </div>
      
      <Dropdown drop="left">
        <Dropdown.Toggle as={ThreeDotsToggle} />
        <Dropdown.Menu size="sm" title="" align="end">
          <Dropdown.Item onClick={() => setShowConfirmDelete(true)}>Delete</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowMoveModal(true)}>Move</Dropdown.Item>
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
      showAssignTask={(priority, difficulty) =>{
        setPriority(priority)
        setDifficulty(difficulty)
        setShowAssignTask(true)
      }}
      showSetPrevious={() =>{setShowSetPrevious(true)}}
      showAddAssistants={() =>{setShowAddAssistants(true)}}
      handleStuck={handleStuck}
      Unstuck={handleUnstuck}/>}
      {showAssignTask && <AssignTaskModal
        show={showAssignTask}
        onHide={() => {
          setShowAssignTask(false)
          showDetailsPage()
        }}
        _id={_id}
        priority={priority}
        difficulty={difficulty}
        taskTitle={title}
        projectTitle={projectTitle}
      />}
      {showSetPrevious && <SetPreviousModal
          show={showSetPrevious}
          onHide={() =>{
            setShowSetPrevious(false)
            showDetailsPage();
          }}
          _id={_id}
          />
      }
      {showAddAssistants && <AddAssistatsModal
          show={showAddAssistants}
          onHide={() =>{
            setShowAddAssistants(false)
            showDetailsPage()
          }}
          taskID={_id}
          taskTitle={title}
          projectTitle={projectTitle}
          
        />
      }
        <MoveTaskModal show={showMoveModal} 
          onHide={() =>setShowMoveModal(false)} 
          taskID={_id} 
          modifyIsTaskMoved={modifyIsTaskMoved} 
          isTaskMoved={isTaskMoved}/>

        <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete the task "{title}"?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() =>{
                handleDelete()
                setShowConfirmDelete(false)
              }}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

    </>
    
  );
};

export default Task;
