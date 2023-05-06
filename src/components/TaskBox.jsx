import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import styled from 'styled-components';

const TaskBoxContainer = styled(Card)`
  margin-bottom: 20px;
`;

const TaskBoxTitle = styled(Card.Title)`
  margin-bottom: 0;
`;

const TaskBoxDescription = styled(Card.Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TaskBox = ({ task, isAssigned, assignTask }) => {
  const handleClick = () => {
    assignTask(task);
  }

  return (
    <TaskBoxContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Card.Body>
          <TaskBoxTitle>Title: {task.title || 'Not set'}</TaskBoxTitle>
          <TaskBoxDescription>Description: {task.description || 'Not set'}</TaskBoxDescription>
          <Card.Text>Progress: {task.progress || 'Not set'}</Card.Text>
          <Card.Subtitle className="mb-2 text-muted">Priority: {task.priority || 'Not set'}</Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">Difficulty: {task.difficulty || 'Not set'}</Card.Subtitle>
        </Card.Body>
        {isAssigned ? (
          <span style={{ color: 'green', marginRight: '10px' }}>Assigned!</span>
        ) : (
          <Button variant="primary" style={{ marginRight: '10px' }} onClick={handleClick}>
            Assign
          </Button>
        )}
      </div>
    </TaskBoxContainer>
  );
};

export default TaskBox;