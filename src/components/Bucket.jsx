import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import EditBucketModal from './EditBucketModal';

const Container = styled.div`
  display: inline-block;
  width: 250px;
  height: 60vh;
  background-color:lightblue;
  overflow-y: auto;
  margin-left: 30px;
  vertical-align: top;
  &:last-child {
    margin-right: 30px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content:space-between;
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

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background-color: gray;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ThreeDots = styled.span`
  &::after {
    content:"\\22EF";
    font-size: 30px;
    margin-left: 5px;
    vertical-align: middle;
  }
`
const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    style={{ textDecoration: "none"}}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <ThreeDots/>
  </a>
));

const Bucket = ({ title, _id}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);
  const navigate = useNavigate()
  const user = useSelector((state)=> state.user.currentUser)
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEdit = () => setShowEditModal(false);
  const handleShowEdit = () => setShowEditModal(true);

  const handleCloseDelete = () => setShowConfirmDeleteModal(false);
  const handleShowDelete = () => setShowConfirmDeleteModal(true);
  const [showMenu, setShowMenu] = useState(false);

  const handleEditClick = () => {
    // handle edit click
  };

  const handleDelete = () => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/buckets/'+ _id
    axios.delete(path, config).then(response => {
      console.log(response);
      window.location.reload();
    }).catch(error => {
      console.log(error);
    });
  };
  
  return (
    <>
    <Container>
      <TitleContainer>
        <Title>{title}</Title>
        <Dropdown drop="left">
          <Dropdown.Toggle as={CustomToggle} />
          <Dropdown.Menu size="sm" title="" align="end" >
            <Dropdown.Item onClick={handleShowEdit}>Edit...</Dropdown.Item>
            <Dropdown.Item onClick={handleShowDelete}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </TitleContainer>
      <Separator />

      <Modal show={showConfirmDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the bucket "{title}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      <EditBucketModal 
        show={showEditModal} 
        onHide={handleCloseEdit} 
        defaultTitle={title} 
        _id={_id}/>
    </Container>
    </>
  );
};

export default Bucket;
