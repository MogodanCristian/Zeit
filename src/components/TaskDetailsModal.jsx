import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const EmployeeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
`

const ErrorMessage = styled.span`
  color:red;
`

const TaskDetailsModal = ({show, onHide, _id, handleTaskUpdate, handleCheck, Uncheck, showAssignTask, showSetPrevious, showAddAssistants, handleStuck, Unstuck}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  
  const token = useSelector((state) => state.user.jwt)
  const user = useSelector((state) => state.user.currentUser);
  
  const [task, setTask] = useState(null)
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(null);
  const [isModified, setIsModified] = useState(false)
  const [completedBy, setCompletedBy] = useState(null)
  const [isAssignedTo, setIsAssignedTo] = useState(null)
  const [previous, setPrevious] = useState(null)

  const [startDate, setStartDate] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [endTime, setEndTime] = useState(null)

  const [priority, setPriority] = useState(null)
  const [difficulty, setDifficulty] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)

  const [isProgressModified, setIsProgressModified] = useState(false)

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/tasks/' + _id
    axios.get(path, config)
      .then(response => {
        console.log(response.data)
        setTask(response.data)
        setPriority(response.data[0].priority)
        setDifficulty(response.data[0].difficulty)
        if(response.data[0].start_date){

          const startDate = response.data[0].start_date;
          const startDateTime = new Date(startDate);
          const currentDateTime = new Date();

          startDateTime.setHours(startDateTime.getHours() - 3);
          if (startDateTime < currentDateTime) {
            setProgress('In Progress');
          } else {
            setProgress(response.data[0].progress);
          }
        }
        else{
          setProgress('Not Started')
        }
        if (response.data[0].start_date) {
          setStartDate(response.data[0].start_date.substr(0, 10));
          setStartTime(response.data[0].start_date.slice(11, 16));
        }
        
        if (response.data[0].end_date) {
          setEndDate(response.data[0].end_date.substr(0, 10));
          setEndTime(response.data[0].end_date.slice(11, 16));

          const endDate = response.data[0].end_date;
          const endDateTime = new Date(endDate);
          const currentDateTime = new Date();

          endDateTime.setHours(endDateTime.getHours() - 3);
          if (endDateTime < currentDateTime) {
            setErrorMessage("The project is past the deadline!!!")
          }
        }

        if(response.data[0].completed_by){
        axios.get(apiUrl + '/users/getDetails/' + response.data[0].completed_by, config)
        .then(userResponse => {
          setCompletedBy(userResponse.data)
        })
        .catch(userError => {
          console.error(userError);
        });}
        if(response.data[0].assigned_to){ 
        axios.get(apiUrl + '/users/getDetails/' + response.data[0].assigned_to, config)
        .then(userResponse =>{
          setIsAssignedTo(userResponse.data)
        }).catch(userError =>{
          console.error(userError)
        })}

        if(response.data[0].previous)
        {
          axios.get(apiUrl+'/tasks/'+response.data[0].previous, config)
          .then(previousTaskRes =>{
            setPrevious(previousTaskRes.data)
          }) 
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  

  const handleSaveChanges = async() => {
    if (isModified) {
      handleTaskUpdate(title);
    }
    if (progress === "Done") {
      handleCheck();
      Unstuck();
    } else if (progress === "Stuck" && isProgressModified) {
      await handleStuck();
      Uncheck();
      setIsProgressModified(false)
    } else {
      Uncheck();
      Unstuck();
    }
    const config = {
      headers: { 'auth-token': token }
    };
  
    let startDateTime = null;
    let endDateTime = null;
  
    if (startDate && startTime) {
      startDateTime = new Date(`${startDate}T${startTime}:00`);
      startDateTime.setHours(startDateTime.getHours() + 3); 
      startDateTime = startDateTime.toISOString();
    }
  
    if (endDate && endTime) {
      endDateTime = new Date(`${endDate}T${endTime}:00`);
      endDateTime.setHours(endDateTime.getHours() + 3); 
      endDateTime = endDateTime.toISOString();
    }
  
    setTask({ ...task, start_date: startDateTime, end_date: endDateTime });
  
    const path = apiUrl + '/tasks/' + _id;
  
    axios.put(path, { ...task, start_date: startDateTime, end_date: endDateTime }, config)
      .catch(error => {
        console.error(error);
      });
  }
  const handleAssignTask = () => {

    handleSaveChanges();
    showAssignTask(priority, difficulty);
    onHide();
  };

  
  return (
    <>
    
    <Modal show={show} onHide={()=>{
      handleSaveChanges()
      setErrorMessage()
      onHide()
    }}>
      <Modal.Header closeButton>
        <Modal.Title>Task Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
  {task ? (
    <Form>
      <Form.Group>
        <Form.Label>Title:</Form.Label>
        <Form.Control
          type="text"
          defaultValue={task[0].title}
          disabled={user.role === 'employee'}
          onChange={(e) => {
            setTask({ ...task, title: e.target.value })
            setIsModified(true)
            setTitle(e.target.value)
          }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description:</Form.Label>
        <Form.Control
          as={"textarea"}
          rows={2}
          defaultValue={task[0].description}
          disabled={user.role === 'employee'}
          onChange={(e) =>{
            setTask({ ...task, description: e.target.value })
          }
          }
        />
      </Form.Group>

      <FormRow style={{marginBottom:"30px"}}>
        <Form.Group style={{ width: "31%" }}>
          <Form.Label>Priority:</Form.Label>
          <Form.Select aria-label="Priority" disabled={user.role === 'employee'} defaultValue={task[0].priority} onChange={(e) => {
            setTask({ ...task, priority: e.target.value })
            setPriority(e.target.value)
          }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </Form.Select>
        </Form.Group>
        <Form.Group style={{ width: "31%" }}>
          <Form.Label>Progress:</Form.Label>
          <Form.Select aria-label="Progress" defaultValue={progress} disabled={isAssignedTo === null} onChange={(e) => {
            setTask({ ...task, progress: e.target.value })
            setProgress(e.target.value)
            setIsProgressModified(true)
          }
        }>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Stuck">Stuck</option>
            <option value="Done">Done</option>
          </Form.Select>
        </Form.Group>
        <Form.Group style={{ width: "31%" }}>
          <Form.Label>Difficulty:</Form.Label>
          <Form.Select aria-label="Difficulty" defaultValue={task[0].difficulty} disabled={user.role === 'employee'} onChange={(e) => {
            setTask({ ...task, difficulty: e.target.value })
            setDifficulty(e.target.value)
          }}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="very hard">Very Hard</option>
          </Form.Select>
        </Form.Group>
      </FormRow>

      <FormRow>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>Start Date:</Form.Label>
          <Form.Control
            type="date"
            defaultValue={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={user.role === 'employee'}
          />
        </Form.Group>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="time"
            defaultValue={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={user.role === 'employee'}
          />
        </Form.Group>
      </FormRow>

      <FormRow>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>End Date:</Form.Label>
          <Form.Control
            type="date"
            defaultValue={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={user.role === 'employee'}
          />
        </Form.Group>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="time"
            defaultValue={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={user.role === 'employee'}
          />
        </Form.Group>
      </FormRow>
        
       {user.role === 'manager' && <FormRow>
          <Button style={{
            width:"31%",
            marginTop:"20px"
        }}  onClick={handleAssignTask}>Assign task...</Button>

          <Button style={{
            width:"31%",
            marginTop:"20px"
        }} onClick={() =>{
          showSetPrevious()
          handleSaveChanges()
          onHide()
        }}>Set previous...</Button>
        <Button style={{
            width:"31%",
            marginTop:"20px"
        }} onClick={() =>{
          showAddAssistants()
          handleSaveChanges()
          onHide()
        }}
        disabled={isAssignedTo === null}
        >Add assistants...</Button>
        </FormRow>}
        
        <FormRow>
          <Form.Label>Previous task that must be completed:</Form.Label> 
        </FormRow>
        <EmployeeBox>
          {
            previous? (
              <div>{previous[0].title}</div>
            ) :
            <div>No task set as previous.</div>
          }
        </EmployeeBox>

        <FormRow>
          <Form.Label>Finished by:</Form.Label>
        </FormRow>
        <EmployeeBox>
        {completedBy? (
          <div>{completedBy.first_name} {completedBy.last_name}</div>
            )
          :
          <div>No one yet...</div>}
        </EmployeeBox>
        <FormRow>
          <Form.Label>Assigned to:</Form.Label>
        </FormRow>
        <EmployeeBox>
        {isAssignedTo? (
          <div>{isAssignedTo.first_name} {isAssignedTo.last_name}</div>
            )
          :
          <div>No one yet...</div>}
        </EmployeeBox>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Form>
  ) : (
    <p>Loading...</p>
  )}
  </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{
          handleSaveChanges()
          setErrorMessage("")
          onHide()
        }}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default TaskDetailsModal