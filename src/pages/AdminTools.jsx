import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'
import CreateUserModal from '../components/AdminTools/CreateUserModal'
import ShowAllUsersModal from '../components/AdminTools/ShowAllUsersModal'

const StyledButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: 250px;
`

const StyledButton = styled(Button)`
  font-size: 1.5rem;
  margin: 0 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0;
  &:hover,
  &:focus {
    background-color: #007bff !important;
    border-color: #007bff !important;
    box-shadow: none !important;
  }
`

const AdminTools = () => {
  const handleEditUser = () => {
    // code to edit user details goes here
    console.log('Edit User button clicked')
  }

  const handleDeleteUser = () => {
    // code to delete a user goes here
    console.log('Delete User button clicked')
  }
  const [showCreateUser, setShowCreateUser] = useState(false)
  const handleCloseForm = () => setShowCreateUser(false);
  const handleShowForm = () => setShowCreateUser(true);

  const [showAllUsers, setShowAllUsers] = useState(false)
  const handleShowUsersModal = () => setShowAllUsers(true)
  const handleCloseUsersModal = () => setShowAllUsers(false)
  return (
    <>
      <StyledButtonContainer>
        <StyledButton variant="secondary" onClick={handleShowForm}>Create New User</StyledButton>
        <StyledButton variant="secondary" onClick={handleShowUsersModal}>Show All Users</StyledButton>
        <StyledButton variant="secondary" onClick={handleEditUser}>Edit User Details</StyledButton>
        <StyledButton variant="danger" onClick={handleDeleteUser}>Delete User</StyledButton>
      </StyledButtonContainer>
      <CreateUserModal show={showCreateUser} onHide={handleCloseForm}/>
      <ShowAllUsersModal show={showAllUsers} onHide={handleCloseUsersModal}/>
    </>
  )
}

export default AdminTools
