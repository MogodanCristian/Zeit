import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';

const EmployeeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
  height: 50px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const AssignTaskModal = ({ show, onHide, _id, priority, difficulty }) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;

  const token = useSelector((state) => state.user.jwt);

  const [employees, setEmployees] = useState([]);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [task, setTask] = useState(null);
  const [recommendedEmployee, setRecommendedEmployee] = useState(null);
  const [employeePerformance, setEmployeePerformance] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const priorityEnum = ['Low', 'Medium', 'High', 'Urgent'];
  const difficultyEnum = ['easy', 'medium', 'hard', 'very hard'];

  function calculateScore(priority, difficulty) {
    const priorityValue = priorityEnum.indexOf(priority) + 1;
    const difficultyValue = difficultyEnum.indexOf(difficulty) + 1;
    return priorityValue * difficultyValue;
  }

  function calculatePerformanceLevel(score) {
    if (score >= 1 && score < 4) {
      return 'Low Performance';
    } else if (score >= 4 && score < 9) {
      return 'Medium Performance';
    } else if (score >= 9 && score <= 16) {
      return 'High Performance';
    }
  }

  function calculatePerformanceLevelReverse(performance) {
    if (performance === 1) {
      return 'Low Performance';
    } else if (performance === 2) {
      return 'Medium Performance';
    } else if (performance === 3) {
      return 'High Performance';
    }
  }

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token },
    };

    const path = apiUrl + '/tasks/getProject/' + _id;
    axios
      .get(path, config)
      .then((response) => {
        const project = response.data;
        axios
          .get(apiUrl + '/tasks/' + _id, config)
          .then((detailsRes) => {
            setTask(detailsRes.data[0]);
            setAssignedEmployeeId(detailsRes.data[0]?.assigned_to);

            axios
              .post('http://localhost:3000/api/tasks/getRecommendedEmployee/' + _id, {
                priority: detailsRes.data[0].priority,
                difficulty: detailsRes.data[0].difficulty,
              })
              .then((recommendedRes) => {
                console.log(recommendedRes.data);
                setRecommendedEmployee(recommendedRes.data);
              });
          })
          .catch((error) => {
            console.log(error);
          });

        axios
          .get(apiUrl + '/projects/getAvailableEmployees/' + project._id)
          .then((availableRes) => {
            setEmployees(availableRes.data);

            const promises = availableRes.data.map(async (employee) => {
              const response = await axios.get(
                'http://localhost:3000/api/users/performance/' + employee._id
              );
              return {
                _id: employee._id,
                performance: response.data,
              };
            });

            Promise.all(promises)
              .then((data) => {
                setEmployeePerformance(data);
              })
              .catch((error) => {
                console.log(error);
              });
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

  const handleSaveChanges = () => {
    const config = {
      headers: { 'auth-token': token },
    };
    if (selectedEmployee) {
      axios
        .put(apiUrl + '/tasks/' + _id, {
          assigned_to: selectedEmployee._id,
        }, config)
        .then((response) => {})
        .catch((error) => {
          console.error(error);
        });
      axios
        .put(apiUrl + '/users/' + selectedEmployee._id, {
          is_workin: true,
        }, config)
        .then((response) => {})
        .catch((error) => {
          console.error(error);
        });
    }
    console.log(employeePerformance)
    onHide();
  };

  const performanceLevel = calculatePerformanceLevel(calculateScore(priority, difficulty));
  let spanStyle = { fontWeight: 'bold' };

  if (performanceLevel === 'Low Performance') {
    spanStyle.color = '#79C999';
  } else if (performanceLevel === 'Medium Performance') {
    spanStyle.color = '#FFD700';
  } else if (performanceLevel === 'High Performance') {
    spanStyle.color = '#FF0000';
  }

  return (
    <Modal show={show} onHide={handleSaveChanges}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormRow>
          <Form.Label>
            Performance requirements suggestion: <span style={spanStyle}>{performanceLevel}</span>
          </Form.Label>
        </FormRow>
        {employees.map((employee) => (
          <React.Fragment key={employee._id}>
            {employeePerformance && employeePerformance.find((perf) => perf._id === employee._id) ? (
              <Tooltip
                title={
                  <span style={{ fontSize: '15px' }}>
                    Performance: {calculatePerformanceLevelReverse(employeePerformance.find((perf) => perf._id === employee._id).performance)}
                  </span>
                }
                arrow
              >
                <EmployeeBox>
                  <div>
                    {employee.first_name} {employee.last_name}
                  </div>
                  {isEmployeeSelected(employee) ? (
                    <span style={{ color: 'green' }}>✓ Assigned!</span>
                  ) : (
                    <Button variant="primary" onClick={() => handleAssignClick(employee)}>
                      Assign
                    </Button>
                  )}
                </EmployeeBox>
              </Tooltip>
            ) : (
              <EmployeeBox>
                <div>
                  {employee.first_name} {employee.last_name}
                </div>
                {isEmployeeSelected(employee) ? (
                  <span style={{ color: 'green' }}>✓ Assigned!</span>
                ) : (
                  <Button variant="primary" onClick={() => handleAssignClick(employee)}>
                    Assign
                  </Button>
                )}
              </EmployeeBox>
            )}
          </React.Fragment>
        ))}

        <FormRow>
          <Form.Label>Suggested employee:</Form.Label>
        </FormRow>
        <EmployeeBox>
          {recommendedEmployee ? (
            <div>
              {recommendedEmployee.first_name} {recommendedEmployee.last_name}
            </div>
          ) : (
            <div>No employee to recommend...</div>
          )}
        </EmployeeBox>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSaveChanges}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignTaskModal;
