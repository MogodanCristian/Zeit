import React from 'react'
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector((state) => state.user.currentUser)
  console.log(user)
  return (
    <div>
      <p>User ID: {user._id}</p>
    </div>
  )
}

export default Dashboard
