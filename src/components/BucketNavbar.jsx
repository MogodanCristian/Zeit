import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import AddEmployeeModal from '../components/AddEmployeeModal';
import ListEmployeesInProjectModal from './ListEmployeesInProjectModal';
import { useNavigate } from 'react-router-dom';

const BucketNavbar = ({title, _id}) => {
  const user = useSelector((state)=> state.user.currentUser)
  const navigate = useNavigate()
  const [showAddEmployeeModal, setShowAddEmployeeModal]=useState(false)
  const [showEmployeesModal, setShowEmployeesModal] = useState(false)

  const handleCloseAddEmployee = () => setShowAddEmployeeModal(false);
  const handleShowAddEmployee = () => setShowAddEmployeeModal(true);

  const handleCloseShowEmployees = () =>setShowEmployeesModal(false);
  const handleShowEmployeesModal = () => setShowEmployeesModal(true);
  return (
    <>
    <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand style={{fontSize:"25px"}}>{title}</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() =>{navigate('/projects/'+_id + '/'+title + '/buckets')}}>Board</Nav.Link>
            <Nav.Link>Grid</Nav.Link>
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