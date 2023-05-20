import React, { useState, useEffect } from 'react';
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

const TaskDetailsModal = ({show, onHide, _id, handleTaskUpdate, handleCheck, Uncheck, showAssignTask, showSetPrevious, showAddAssistants, handleStuck, Unstuck}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  
  const token = useSelector((state) => state.user.jwt)
  
  const [task, setTask] = useState(null)
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState('Not Started');
  const [isModified, setIsModified] = useState(false)
  const [completedBy, setCompletedBy] = useState(null)
  const [isAssignedTo, setIsAssignedTo] = useState(null)
  const [previous, setPrevious] = useState(null)
  
  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/tasks/' + _id
    console.log(_id)
    axios.get(path, config)
      .then(response => {
        setTask(response.data)
        setProgress(response.data[0].progress)
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

  const handleSaveChanges = () => {
    if(isModified)
      {
        handleTaskUpdate(title);
      }
    if(progress === "Done")
    {
      handleCheck()
      Unstuck()
    }
    else if(progress === "Stuck"){
      handleStuck()
      Uncheck()
    }
    else{
      Uncheck()
      Unstuck()
    }
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/tasks/' + _id;

    axios.put(path, task, config)
      .then(response => {
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <>
    
    <Modal show={show} onHide={()=>{
      handleSaveChanges()
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
          onChange={(e) =>{
            setTask({ ...task, description: e.target.value })
            console.log(task)
          }
          }
        />
      </Form.Group>

      <FormRow style={{marginBottom:"30px"}}>
        <Form.Group style={{ width: "31%" }}>
          <Form.Label>Priority:</Form.Label>
          <Form.Select aria-label="Priority" defaultValue={task[0].priority} onChange={(e) => {
            setTask({ ...task, priority: e.target.value })
          }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </Form.Select>
        </Form.Group>
        <Form.Group style={{ width: "31%" }}>
          <Form.Label>Progress:</Form.Label>
          <Form.Select aria-label="Progress" defaultValue={task[0].progress} disabled={isAssignedTo === null ? true : false} onChange={(e) => {
            setTask({ ...task, progress: e.target.value })
            setProgress(e.target.value)
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
          <Form.Select aria-label="Difficulty" defaultValue={task[0].difficulty} onChange={(e) => {
            setTask({ ...task, difficulty: e.target.value })
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
            defaultValue={task.startDate}
            onChange={(e) =>
              setTask({ ...task, startDate: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group style={{ width: "48%" }}>
          <Form.Label>Start Time</Form.Label>
          <Form.Control type="time" defaultValue="00:00"/>
        </Form.Group>
        </FormRow>
        
        <FormRow>
          <Form.Group style={{ width: "48%" }}>
            <Form.Label>End Date:</Form.Label>
            <Form.Control
              type="date"
              defaultValue={task.endDate}
              onChange={(e) =>
                setTask({ ...task, endDate: e.target.value })
              }
              />
          </Form.Group>
          <Form.Group style={{ width: "48%" }}>
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" defaultValue="00:00"/>
        </Form.Group>
        </FormRow>
        
        <FormRow>
          <Button style={{
            width:"31%",
            marginTop:"20px"
        }} onClick={() => {
          showAssignTask()
          handleSaveChanges()
          onHide()
        }}>Assign task...</Button>

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
        }}>Add assistants...</Button>
        </FormRow>
        
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
    </Form>
  ) : (
    <p>Loading...</p>
  )}
  </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{
          handleSaveChanges()
          onHide()
        }}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default TaskDetailsModal