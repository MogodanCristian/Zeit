import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import AddEmployeeModal from '../components/AddEmployeeModal';
import ListEmployeesInProjectModal from './ListEmployeesInProjectModal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const SmallRoundButton = styled.button`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0;
  border: none;
  color: #000000;
  font-size: 16px;
  cursor: pointer;
  margin-left: 20px;
`;

const BucketNavbar = ({title, _id}) => {
  const user = useSelector((state)=> state.user.currentUser)
  const navigate = useNavigate()
  const [showAddEmployeeModal, setShowAddEmployeeModal]=useState(false)
  const [showEmployeesModal, setShowEmployeesModal] = useState(false)

  const handleCloseAddEmployee = () => setShowAddEmployeeModal(false);
  const handleShowAddEmployee = () => setShowAddEmployeeModal(true);

  const handleCloseShowEmployees = () =>setShowEmployeesModal(false);
  const handleShowEmployeesModal = () => setShowEmployeesModal(true);

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <>
    <Navbar bg="light" variant="light">
        <SmallRoundButton onClick={handleGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </SmallRoundButton>
        <Container>
          <Navbar.Brand style={{fontSize:"25px"}}>{title}</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() =>{navigate('/projects/'+_id + '/'+title + '/buckets')}}>Board</Nav.Link>
            <Nav.Link onClick={() =>{navigate('/projects/'+_id + '/'+title + '/charts')}}>Charts</Nav.Link>
            {user.role === 'manager' && <Nav.Link onClick={handleShowAddEmployee}>Add Employees</Nav.Link>}
           <Nav.Link onClick={handleShowEmployeesModal}>List Employees</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <AddEmployeeModal show={showAddEmployeeModal} onHide={handleCloseAddEmployee}/>
      <ListEmployeesInProjectModal show={showEmployeesModal} onHide={handleCloseShowEmployees}/>
     </>
  )
}

export default BucketNavbar