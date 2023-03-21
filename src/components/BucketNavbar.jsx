import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import AddEmployeeModal from '../components/AddEmployeeModal';
import ListEmployeesInProjectModal from './ListEmployeesInProjectModal';

const BucketNavbar = ({title}) => {
  const user = useSelector((state)=> state.user.currentUser)

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
          <Navbar.Brand>{title}</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link>Board</Nav.Link>
            <Nav.Link>Grid</Nav.Link>
            <Nav.Link>Charts</Nav.Link>
            {user.role === 'manager' && <Nav.Link onClick={handleShowAddEmployee}>Add Employees</Nav.Link>}
            {user.role === 'manager' && <Nav.Link onClick={handleShowEmployeesModal}>List Employees</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
      <AddEmployeeModal show={showAddEmployeeModal} onHide={handleCloseAddEmployee}/>
      <ListEmployeesInProjectModal show={showEmployeesModal} onHide={handleCloseShowEmployees}/>
     </>
  )
}

export default BucketNavbar