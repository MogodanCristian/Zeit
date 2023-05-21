import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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

const MessageBox = ({ subject, body, timestamp }) => {
  const formattedTimestamp = new Date(timestamp).toLocaleString('en-US', {
    timeZone: 'Europe/Bucharest',
  });

  const handleDeleteMessage = () => {
    // Handle delete logic here
    console.log('Delete message clicked');
  };

  return (
    <MessageBoxContainer>
      <ContentContainer>
        <Subject>{subject}</Subject>
        <Body>{body}</Body>
        <Timestamp>Sent at: {formattedTimestamp}</Timestamp>
      </ContentContainer>
      <TrashIcon icon={faTrashAlt} onClick={handleDeleteMessage} />
    </MessageBoxContainer>
  );
};

export default MessageBox;
