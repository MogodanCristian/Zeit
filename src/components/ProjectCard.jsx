import React, { useState } from 'react';
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

function formatDate(dateString) {
  const startDate = new Date(dateString.substr(0, 10)).toLocaleString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
  })
  const startTime = dateString.slice(11, 16);
  return startDate + ", " + startTime
}


const StyledCard = styled(Card)`
  margin: 20px;
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

const ProjectCard = ({_id,title, description, start_date, end_date, index}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);
  const navigate = useNavigate()
  const user = useSelector((state)=> state.user.currentUser)
  const [bgColor, setBgColor] = useState(`hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 70) + 30}%, ${Math.floor(Math.random() * 40) + 10}%)`);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEdit = () => setShowEditModal(false);
  const handleShowEdit = () => setShowEditModal(true);

  const handleCloseDelete = () => setShowConfirmDeleteModal(false);
  const handleShowDelete = () => setShowConfirmDeleteModal(true);

  const handleDelete = () => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/projects/'+ _id
    axios.delete(path, config).then(response => {
      console.log(response);
      window.location.reload();
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
      <StyledCard.Header style={{flexDirection: "row", display:'flex', justifyContent:'space-between'}}>
        {index+1}. 
       {user.role === 'manager' && <StyledDropdownButton id="dropdown-basic-button" title={'Options'}>
          <Dropdown.Item onClick={handleShowEdit}>Edit...</Dropdown.Item>
          <Dropdown.Item onClick={handleShowDelete}>Delete</Dropdown.Item>
        </StyledDropdownButton>}
      </StyledCard.Header>
      <StyledCard.Body onClick={()=>{navigate('/projects/'+_id + '/'+ title + '/buckets')}}>
        <StyledCard.Title>{title} </StyledCard.Title>
        <StyledCard.Text>
          {description}
        </StyledCard.Text>
        <StyledCard.Text>
          Start Date: {formatDate(start_date)}
        </StyledCard.Text>
        <StyledCard.Text>
          End Date: {formatDate(end_date)}
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
        defaultTitle={title} 
        defaultDescription={description} 
        defaultStartDateTime={start_date}
        defaultEndDateTime={end_date}
        _id={_id}/>
    </StyledCard>
  );
};

export default ProjectCard;