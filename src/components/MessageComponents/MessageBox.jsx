import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

const MessageBoxContainer = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:80vw;
  margin-top:20px;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
`;

const Subject = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const Body = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
`;

const Timestamp = styled.p`
  font-size: 12px;
  color: #888;
`;

const TrashIcon = styled(FontAwesomeIcon)`
  color: #888;
  cursor: pointer;
  font-size: 20px;
`;

const MessageBox = ({ subject, body, timestamp, handleDelete,_id}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const token = useSelector((state) => state.user.jwt);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const handleCloseDelete = () => setShowConfirmDeleteModal(false);
  const handleShowDelete = () => setShowConfirmDeleteModal(true);
  
  const formattedTimestamp = new Date(timestamp).toLocaleString('en-US', {
    timeZone: 'Europe/Bucharest',
  });

  const handleDeleteMessage = () => {
    const config = {
      headers: { 'auth-token': token }
    };
  
    axios.delete(apiUrl+ '/messages/'+_id,config).catch(error =>{
      console.error(error);
    })
    handleDelete(_id)
  };

  return (
    <>
    <MessageBoxContainer>
      <ContentContainer>
        <Subject>{subject}</Subject>
        <Body>{body}</Body>
        <Timestamp>Sent at: {formattedTimestamp}</Timestamp>
      </ContentContainer>
      <TrashIcon icon={faTrashAlt} onClick={handleShowDelete} />
    </MessageBoxContainer>

    <Modal show={showConfirmDeleteModal} onHide={handleCloseDelete}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Delete</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to delete this message?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseDelete}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDeleteMessage}>
        Delete
      </Button>
    </Modal.Footer>
    </Modal>
</>
  );
};

export default MessageBox;
