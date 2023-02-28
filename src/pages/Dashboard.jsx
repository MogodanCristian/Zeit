import React from 'react'
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector((state) => state.user.currentUser)
  console.log(user)
  return (
    <div>
      <p>Hello, {user.first_name} {user.last_name}!</p>
    </div>
  )
}

export default Dashboard
