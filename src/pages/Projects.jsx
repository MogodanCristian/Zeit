import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button'
import "bootstrap/dist/css/bootstrap.min.css"
import styled from 'styled-components';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

const PageContainer = styled.div`
  justify-content: center;
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
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const user = useSelector((state)=> state.user.currentUser)
  const token = useSelector((state) => state.user.jwt)
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const handleCloseForm = () => setShowCreateForm(false);
  const handleShowForm = () => setShowCreateForm(true);

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/projects/find/'+ user._id
    axios.get(path, config)
      .then(response => {
        setProjects(response.data);
        if(response.data.length === 0)
        {
          setIsEmpty(true)
        }
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
     <CreateProjectModal show={showCreateForm} onHide={handleCloseForm}/>
    <CardContainer>
      {projects.map((item,index) => (
        <ProjectCard 
        _id = {item._id}
        title={item.title}
        description = {item.description}
        start_date = {item.start_date}
        end_date = {item.end_date}
        index= {index}
        key={index}
        />
      ))}
      {isEmpty &&
      <div style={{fontSize: "30px"}}>There are no projects to show!</div>}
      </CardContainer>
      </PageContainer>
    </>
  );
}

export default Projects
