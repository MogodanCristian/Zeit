import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const AssignTasksAutomaticallyModal = ({ showModal, onHide, projectID }) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);
  const [tasks, setTasks] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token },
    };
    axios.get('http://localhost:3000/api/projects/' + projectID + '/getUnassignedTasks', config)
      .then((res) => {
        setTasks(res.data);
      });
  }, []);

  const handleAssign = async () => {
    const config = {
      headers: { 'auth-token': token },
    };

    if (tasks) {
      try {
        for (const task of tasks) {
          const response = await axios.post('http://localhost:3000/api/tasks/getRecommendedEmployee/' + task._id, {
            priority: task.priority,
            difficulty: task.difficulty,
          }, config);

          await axios.put('http://localhost:3000/api/tasks/' + task._id, {
            assigned_to: response.data._id,
          }, config);
        }

        setMessage("All tasks have been assigned successfully!");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClose = async () => {
    await handleAssign();
    onHide();
  };

  return (
    <Modal show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Assignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to assign all the unassigned tasks automatically? This operation will be based upon the employee performance.</Modal.Body>
      {message && <span style={{ color: 'green' }}>{message}</span>}
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Assign...
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignTasksAutomaticallyModal;
