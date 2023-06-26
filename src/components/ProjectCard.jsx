import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditProjectModal from './EditProjectModal';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

function formatDate(dateString) {
  const startDate = new Date(dateString.substr(0, 10)).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const startTime = new Date(dateString.substr(0, 16));
  startTime.setHours(startTime.getHours() + 3);

  const formattedStartTime = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return startDate + ', ' + formattedStartTime;
}


const StyledCard = styled(Card)`
  margin: 20px;
  width: 18rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDropdownButton = styled(DropdownButton)`
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  
  .dropdown-toggle::after {
    color: transparent !important;
    box-shadow: none !important;
  }

  &:active, &:focus, &:hover {
    background-color: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }

  .dropdown-toggle {
    background-color: transparent !important;
    box-shadow: none !important;
    color: inherit !important;
  }

  &.show {
    background-color: transparent !important;
    box-shadow: none !important;
    color: inherit !important;

    .dropdown-toggle::after {
      color: inherit !important;
      box-shadow: none !important;
    }
  }
`;

const Exclamation = styled.span`
  color: red;
  font-size: 35px;
  font-family: "Pacifico";
`;

const ProjectCard = ({project,index, onDelete}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);
  const navigate = useNavigate()
  const user = useSelector((state)=> state.user.currentUser)
  const [bgColor, setBgColor] = useState(() => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 70) + 30;
    const lightness = Math.floor(Math.random() * 40) + 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  const [hasProblems,setHasProblems] = useState(false)

  const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false)

  const handleCloseEdit = () => setShowEditModal(false);
  const handleShowEdit = () => setShowEditModal(true);

  const handleCloseDelete = () => setShowConfirmDeleteModal(false);
  const handleShowDelete = () => setShowConfirmDeleteModal(true);

  useEffect(() => {
    const redShades = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
    const newBgColor = bgColor => {
    const hue = Math.floor(Math.random() * 360);
    return redShades.includes(hue) ? newBgColor(bgColor) : `hsl(${hue}, ${bgColor.slice(4)})`;
  };

  setBgColor(newBgColor(bgColor));
    const config = {
      headers: { 'auth-token': token }
    };
    axios.get(apiUrl+'/projects/'+ project._id +'/checkStuckTask', config)
    .then(response =>{
      setHasProblems(response.data.hasStuckTask)
    })
  }, [])
  
  const handleDelete = () => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/projects/'+ project._id
    axios.delete(path, config).then(response => {
      onDelete(project._id)
      handleCloseDelete()
    }).catch(error => {
      console.log(error);
    });
  };


  return (
    <StyledCard 
      text={'white'}
      style={{ width: '18rem', backgroundColor: bgColor }}
      className="mb-2"
    >
      <StyledCard.Header style={{flexDirection: "row", display:'flex', justifyContent:'space-between '}}>
        {index+1}.
       {user.role === 'manager' && <StyledDropdownButton id="dropdown-basic-button" title={'Options'}>
          <Dropdown.Item onClick={handleShowEdit}>Edit...</Dropdown.Item>
          <Dropdown.Item onClick={handleShowDelete}>Delete</Dropdown.Item>
        </StyledDropdownButton>}
      </StyledCard.Header>
      <StyledCard.Body onClick={() => {navigate('/projects/' + project._id + '/' + project.title + '/buckets')}}>
        <StyledCard.Title>{hasProblems && <Exclamation>!</Exclamation>} {project.title}</StyledCard.Title>
        {project.description.length > 20 ? (
            <Tooltip title={<span style={{fontSize:"15px"}}>{project.description}</span>} arrow>
              <StyledCard.Text>
                {project.description.slice(0, 50) + '...'}
              </StyledCard.Text>
            </Tooltip>)
         : (
          <StyledCard.Text>{project.description}</StyledCard.Text>
        )}
        <StyledCard.Text>
          Start Date: {formatDate(project.start_date)}
        </StyledCard.Text>
        <StyledCard.Text>
          End Date: {formatDate(project.end_date)}
        </StyledCard.Text>
      </StyledCard.Body>

      <Modal show={showConfirmDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this project?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      <EditProjectModal 
        show={showEditModal} 
        onHide={handleCloseEdit} 
        defaultTitle={project.title} 
        defaultDescription={project.description} 
        defaultStartDateTime={project.start_date}
        defaultEndDateTime={project.end_date}
        _id={project._id}/>
    </StyledCard>
  );
};

export default ProjectCard;