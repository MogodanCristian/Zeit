import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const StyledSupport = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const EmployeeMessage = styled.p`
  font-size: 18px;
`;

const AdminMessage = styled.p`
  font-size: 18px;
`;

const ManagerMessage = styled.p`
  font-size: 18px;
`;

const Support = () => {
  const userRole = useSelector((state) => state.user.currentUser.role);

  return (
    <div>
      <StyledSupport>
        {userRole === 'employee' && (
          <EmployeeMessage>
            Your most important role as an employee is to complete tasks. Click on a project card and start working on a task by selecting "In progress" from the progress dropdown. If you are stuck on a task, select "Stuck" to notify the project manager. If you have completed the task, select "Done".
          </EmployeeMessage>
        )}
        {userRole === 'admin' && (
          <AdminMessage>
            Your most important role as an admin is to edit user specific data and create employee accounts. Just click on the "Tools" option in the sidebar, and you will be redirected to a page containing your options. Just click on any option your work requires you to.
          </AdminMessage>
        )}
        {userRole === 'manager' && (
            <ManagerMessage>
                As a manager you can create new projects, edit existing projects, create task categories, called "buckets", create tasks, assign tasks, and edit task details. An algorithm is there for you in order to help you, the manager, in assigning the tasks to each employee. You can see the statistics of each project in the "Charts" page. Have fun! 
            </ManagerMessage>
        )}
      </StyledSupport>
    </div>
  );
};

export default Support;
