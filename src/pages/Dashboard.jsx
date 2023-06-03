import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PerformanceDetailsChart from '../components/Charts/PerformanceDetailsChart';
import styled from 'styled-components';

const PageContainer = styled.div`
  margin-left: 10px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Greeting = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const PerformanceLevel = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Dashboard = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [hasUnread, setHasUnread] = useState(false);
  const [employeePerformanceData, setEmployeePerformanceData] = useState(null);
  const [performanceLevel,setPerformanceLevel] = useState(null)
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/messages/' + user._id + '/hasUnread')
      .then((response) => {
        setHasUnread(response.data.hasUnread);

        if (response.data.hasUnread) {
          toast.info('You have unread messages!');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get('http://localhost:3000/api/users/getPerformanceDetails/' + user._id)
      .then((response) => {
        setEmployeePerformanceData(response.data);
      });
      axios.get('http://localhost:3000/api/users/performance/' + user._id).then((response) =>{
        setPerformanceLevel(response.data)
      })
  }, []);

  let performanceMessage = null;

  if (performanceLevel !== null) {
    switch (performanceLevel) {
      case 1:
        performanceMessage = 'low';
        break;
      case 2:
        performanceMessage = 'medium';
        break;
      case 3:
        performanceMessage = 'high';
        break;
      default:
        performanceMessage = 'unavailable';
        break;
    }
  }


  return (
    <PageContainer>
      <ToastContainer />
      <Greeting>Hello, {user.first_name} {user.last_name}! Here are your stats at the moment:</Greeting>
      {performanceMessage && <PerformanceLevel>Your performance level is {performanceMessage}.</PerformanceLevel>}
      {employeePerformanceData && <PerformanceDetailsChart employeeData={employeePerformanceData} />}
    </PageContainer>
  );
};

export default Dashboard;
