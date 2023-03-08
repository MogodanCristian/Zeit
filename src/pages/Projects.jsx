import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import "bootstrap/dist/css/bootstrap.min.css"
import styled from 'styled-components';
import ProjectCard from '../components/ProjectCard';

const PageContainer = styled.div`
  justify-content: center;
  z-index: -1;
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledButton = styled(Button)`
  margin-top: 30px;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 20px;
  flex-wrap: wrap;
  justify-content: center;
  justify-content: space-evenly;
`

const Projects = () => {
  const user = useSelector((state)=> state.user.currentUser)
  const token = useSelector((state) => state.user.jwt)
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const handleCloseForm = () => setShowCreateForm(false);
  const handleShowForm = () => setShowCreateForm(true);

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = 'http://localhost:3000/api/projects/find/'+ user._id
    console.log(path)
    axios.get(path, config)
      .then(response => {
        setProjects(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  return (
    <>
    <PageContainer>
    { user.role === 'manager' &&
    <StyledButton onClick={handleShowForm}>Create a new project</StyledButton>
    }
     <Modal show={showCreateForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>Create Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle" className="mt-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title..." />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter description..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm}>
            Close
          </Button>
          <Button variant="primary">Create</Button>
        </Modal.Footer>
    </Modal>
    <CardContainer>
      {projects.map((item,index) => (
        <ProjectCard 
        title={item.title}
        description = {item.description}
        start_date = {item.start_date}
        end_date = {item.end_date}
        index= {index}
        key={index}
        />
      ))}
      </CardContainer>
      </PageContainer>
    </>
  );
}

export default Projects
