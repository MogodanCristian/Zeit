import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import MessageBox from '../components/MessageComponents/MessageBox';
import styled from 'styled-components';

const MessagesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Messages = () => {
const env = JSON.parse(JSON.stringify(import.meta.env));
const apiUrl = env.VITE_ZEIT_API_URL;
const token = useSelector((state) => state.user.jwt);
const user = useSelector((state) => state.user.currentUser);

const [messages, setMessages] = useState(null)

  useEffect(() => {
    const config = {
        headers: { 'auth-token': token }
      };
      axios.get('http://localhost:3000/api/messages/' +user._id,config).then(response => {
        setMessages(response.data)
        console.log(response.data)
      }).catch(error => {
        console.log(error);
      });
  }, [])
  return (
    <MessagesContainer>
    {messages && messages.length > 0 ? (
      messages.map(message => (
        <MessageBox
          key={message._id}
          subject={message.subject}
          body={message.body}
          timestamp={message.timestamp}
        />
      ))
    ) : (
      <p>No messages found.</p>
    )}
  </MessagesContainer>
  )
}

export default Messages