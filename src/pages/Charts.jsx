import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BucketNavbar from '../components/BucketNavbar';
import axios from 'axios';
import ProgressPieChart from '../components/Charts/ProgressPieChart';
import TasksPerEmployeeChart from '../components/Charts/TasksPerEmployeeChart';

function getProjectID() {
  const url = window.location.href;
  const parts = url.split("/");
  const projectsIndex = parts.indexOf("projects");
  return parts[projectsIndex + 1];
}

function getProjectTitle() {
  const url = window.location.href;
  const parts = url.split("/");
  const projectsIndex = parts.indexOf("projects");
  const encodedTitle = parts[projectsIndex + 2];
  const decodedTitle = decodeURIComponent(encodedTitle.replace(/\+/g, " "));
  return decodedTitle;
}

const Charts = () => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const projectID = getProjectID();
  const user = useSelector((state) => state.user.currentUser);
  const projectTitle = getProjectTitle();
  const token = useSelector((state) => state.user.jwt);

  const [employeeData, setEmployeeData] = useState(null);
  const [progressCounts, setProgressCounts] = useState(null);

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl + '/buckets/getBuckets/' + projectID;
    axios.get('http://localhost:3000/api/tasks/getTasksProgress/' + projectID, config)
      .then(response => {
        setProgressCounts(response.data.progressCounts);
      })
      .catch(error => {
        console.error(error);
      });
    axios.get('http://localhost:3000/api/projects/' + projectID + '/tasksData', config)
      .then(response => {
        setEmployeeData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <BucketNavbar title={projectTitle} _id={projectID} />
      <div style={{ display: 'flex' ,marginTop:'30px'}}>
        <div style={{ flex: 1 }}>
          {progressCounts && <ProgressPieChart progressCounts={progressCounts} />}
        </div>
        <div style={{ flex: 1 }}>
          {employeeData && <TasksPerEmployeeChart employeeData={employeeData} />}
        </div>
      </div>
    </>
  );
};

export default Charts;