import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const BucketNavbar = ({title}) => {
  return (
    <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>{title}</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link>Board</Nav.Link>
            <Nav.Link>Grid</Nav.Link>
            <Nav.Link>Charts</Nav.Link>
            <Nav.Link>Add Employees</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}

export default BucketNavbar