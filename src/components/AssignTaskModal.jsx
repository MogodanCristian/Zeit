import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from 'axios'

const EmployeeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
  height: 50px;
`

const AssignTaskModal = ({ show, onHide, _id }) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;

  const token = useSelector((state) => state.user.jwt);

  const [employees, setEmployees] = useState([]);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [task, setTask] = useState(null);

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token },
    };
    const path = 'http://localhost:3000/api/tasks/getProject/' + _id;
    axios
      .get(path, config)
      .then((response) => {
        const project = response.data;
        axios
          .get(apiUrl + '/tasks/' + _id, config)
          .then((detailsRes) => {
            setTask(detailsRes.data);
            setAssignedEmployeeId(detailsRes.data[0]?.assigned_to);
          })
          .catch((error) => {
            console.log(error);
          });

        axios
          .get(
            'http://localhost:3000/api/projects/getAvailableEmployees/' +
              project._id
          )
          .then((availableRes) => {
            setEmployees(availableRes.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAssignClick = (employee) => {
    setSelectedEmployee(employee);
    setAssignedEmployeeId(null);
  };

  const isEmployeeSelected = (employee) => {
    if (employee._id === assignedEmployeeId) {
      return true;
    }
    return employee === selectedEmployee;
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {employees.map((employee) => (
          <EmployeeBox key={employee.id}>
            <div>
              {employee.first_name} {employee.last_name}
            </div>
            {isEmployeeSelected(employee) ? (
              <span style={{ color: 'green'}}>✓ Assigned!</span>
            ) : (
              <Button variant="primary" onClick={() => handleAssignClick(employee)}>
                Assign
              </Button>
            )}
          </EmployeeBox>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onHide}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignTaskModal;

