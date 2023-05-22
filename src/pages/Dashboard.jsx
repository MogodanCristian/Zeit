import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [hasUnread, setHasUnread] = useState(false);

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
  }, []);

  return (
    <div>
      <p>Hello, {user.first_name} {user.last_name}!</p>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;