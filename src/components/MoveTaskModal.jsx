import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const MoveTaskModal = ({ show, onHide, taskID, modifyIsTaskMoved,isTaskMoved}) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [message, setMessage] = useState("")

  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);
  const config = {
    headers: { 'auth-token': token }
  };

  useEffect(() => {
    axios.get('http://localhost:3000/api/tasks/getProject/' + taskID, config).then((response) => {
      setCurrentProject(response.data);
    });
    axios.get('http://localhost:3000/api/projects', config).then((response) => {
      setProjects(response.data);
    });
    axios.get('http://localhost:3000/api/buckets', config).then((response) => {
      setBuckets(response.data);
    });
  }, []);

  const handleProjectChange = (e) => {
    const selectedProject = projects.find((project) => project.title === e.target.value);
    setCurrentProject(selectedProject);
    setSelectedBucket(null); 
  };

  const handleBucketChange = (e) => {
    const selectedBucket = buckets.find((bucket) => bucket.title === e.target.value);
    setSelectedBucket(selectedBucket);
  };

  const handleTaskMove = () => {
    if (selectedBucket) {
      axios.post('http://localhost:3000/api/tasks/moveTask/' + selectedBucket._id + '/'+ taskID)
      .then(response =>{
        if(response.status === 200)
        {
          setMessage("Task moved successfully!")
          modifyIsTaskMoved()
        }
      })
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Move task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="projectSelect">
            <Form.Label>Select Project</Form.Label>
            {currentProject && <Form.Select onChange={handleProjectChange} defaultValue={currentProject.title}>
              {projects.map((project) => (
                <option key={project._id} value={project.title}>
                  {project.title}
                </option>
              ))}
            </Form.Select>}
          </Form.Group>

          <div style={{ marginBottom: '20px' }}></div>

          <Form.Group controlId="bucketSelect">
            <Form.Label>Select Bucket</Form.Label>
            {currentProject && currentProject.buckets.length === 0 ? (
              <p>No buckets available in the selected project.</p>
            ) : (
              <Form.Select onChange={handleBucketChange}>
                <option value="">Select a bucket</option>
                {buckets
                  .filter((bucket) => currentProject && currentProject.buckets.includes(bucket._id))
                  .map((bucket) => (
                    <option key={bucket._id} value={bucket.title}>
                      {bucket.title}
                    </option>
                  ))}
              </Form.Select>
            )}
          </Form.Group>
        </Form>
        {message && <span style={{color:'green'}}>{message}</span>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleTaskMove}>
          Move
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MoveTaskModal;
