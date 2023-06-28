import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PerformanceDetailsChart from '../components/Charts/PerformanceDetailsChart';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  margin-left: 5%;
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
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const user = useSelector((state) => state.user.currentUser);
  const [hasUnread, setHasUnread] = useState(false);
  const [employeePerformanceData, setEmployeePerformanceData] = useState(null);
  const [performanceLevel,setPerformanceLevel] = useState(null)

  const CustomToastWithLink = () => (
    <div>
      You have unread messages! Click <Link to="/messages">here</Link> to read them!
    </div>
  );
  useEffect(() => {
    axios
      .get(apiUrl+'/messages/' + user._id + '/hasUnread')
      .then((response) => {
        setHasUnread(response.data.hasUnread);

        if (response.data.hasUnread) {
          toast.info(CustomToastWithLink);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(apiUrl+'/users/getPerformanceDetails/' + user._id)
      .then((response) => {
        setEmployeePerformanceData(response.data);
        console.log(response.data)
      });
      axios.get(apiUrl+'/users/performance/' + user._id).then((response) =>{
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
      <ToastContainer/>
      <Greeting>Hello, {user.first_name} {user.last_name}! Here are your stats at the moment:</Greeting>
      {performanceMessage && <PerformanceLevel>Your performance level is {performanceMessage}.</PerformanceLevel>}
      {employeePerformanceData && <PerformanceDetailsChart employeeData={employeePerformanceData} />}
    </PageContainer>
  );
};

export default Dashboard;
