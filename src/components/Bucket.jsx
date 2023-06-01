import React, { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Task from './Task';
import ThreeDotsToggle from './ThreeDotsToggle';
import CreateTaskForm from './CreateTaskForm';
import Tooltip from '@mui/material/Tooltip';

const Container = styled.div`
  display: inline-block;
  width: 300px;
  height: 65vh;
  background-color: transparent;
  overflow-y: auto;
  margin-left: 30px;
  vertical-align: top;
  &:last-child {
    margin-right: 30px;
  }
  border-radius: 5px;
  padding: 10px;
  border: 1px solid gray;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
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

const EditingTitle = styled.input`
  font-size: 24px;
  font-weight: 300;
  margin: 10px;
  max-width: 200px;
  border: none;
  background-color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &:focus {
    outline: none;
    border: none;
  }
`;

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background-color: gray;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const AddTask = styled.button`
  width: 100%;
  height: 30px;
  background-color: gray;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: #333;
  }
`;

const TaskContainer = styled.div``;

const TooltipTitle = styled(Title)`
  white-space: nowrap ;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Bucket = ({ title, _id, onDelete, projectTitle, modifyIsTaskCreated }) => {
  const inputRef = useRef(null);

  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editClicked, setEditClicked] = useState(false);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isTaskMoved, setIsTaskMoved] = useState(false);

  const modifyTaskMoved = () => {
    setIsTaskMoved(!isTaskMoved);
  };

  const handleCloseDelete = () => setShowConfirmDeleteModal(false);
  const handleShowDelete = () => setShowConfirmDeleteModal(true);

  const handleShowCreateTaskForm = () => setShowCreateTaskForm(true);
  const handleCloseCreateTaskForm = () => setShowCreateTaskForm(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      updateTitle();
      setEditClicked(false);
    }
  };

  const updateTitle = () => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl + '/buckets/' + _id;
    const body = {
      title: newTitle
    };
    axios
      .put(path, body, config)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    modifyIsTaskCreated();
    handleCloseCreateTaskForm();
  };

  const handleBlur = () => {
    setEditClicked(false);
    if (newTitle !== title) {
      updateTitle();
    }
  };

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl + '/tasks/getTasks/' + _id;
    axios
      .get(path, config)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [_id, isTaskMoved, tasks]);

  useEffect(() => {
    if (editClicked) {
      inputRef.current.focus();
    }
  }, [editClicked]);

  const handleDelete = () => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl + '/buckets/' + _id;
    axios
      .delete(path, config)
      .then((response) => {
        onDelete(_id);
        handleCloseDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = () => {
    setEditClicked(true);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const removeFromBucket = (taskID) => {
    setTasks(tasks.filter((task) => task._id !== taskID));
  };

  return (
    <>
      <Container>
        <TitleContainer>
          {editClicked ? (
            <EditingTitle
              onKeyDown={handleKeyPress}
              defaultValue={title}
              ref={inputRef}
              onBlur={handleBlur}
              onChange={handleTitleChange}
            />
          ) : (
            <Tooltip title={title.length > 20 ? title : ''}>
              <TooltipTitle>{newTitle}</TooltipTitle>
            </Tooltip>
          )}
          <Dropdown drop="left">
            <Dropdown.Toggle as={ThreeDotsToggle} />
            <Dropdown.Menu size="sm" title="" align="end">
              <Dropdown.Item onClick={handleEdit}>Edit...</Dropdown.Item>
              <Dropdown.Item onClick={handleShowDelete}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </TitleContainer>
        <Separator />
        <AddTask onClick={() => setShowCreateTaskForm(!showCreateTaskForm)}>
          + Add task
        </AddTask>
        {showCreateTaskForm && (
          <CreateTaskForm
            bucketID={_id}
            onTaskCreated={handleTaskCreated}
            onHide={handleCloseCreateTaskForm}
          />
        )}
        <TaskContainer>
          {tasks.map((item, index) => {
            const handleRemoveFromBucket = () => removeFromBucket(item._id);
            return (
              <Task
                title={item.title}
                key={item._id}
                _id={item._id}
                progress={item.progress}
                removeFromBucket={handleRemoveFromBucket}
                bucketTitle={title}
                projectTitle={projectTitle}
                modifyIsTaskMoved={modifyTaskMoved}
                isTaskMoved={isTaskMoved}
              />
            );
          })}
        </TaskContainer>
        <Modal show={showConfirmDeleteModal} onHide={handleCloseDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the bucket "{title}"?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Bucket;
