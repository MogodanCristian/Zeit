import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
`;

const Message = styled.p`
  font-size: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <Message>As an admin, go to the tools page to start working.</Message>
      <Link to="/tools">
        <Button>Go to Admin Tools</Button>
      </Link>
    </DashboardContainer>
  );
};

export default AdminDashboard;
