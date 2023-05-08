import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import BucketNavbar from '../components/BucketNavbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import styled from 'styled-components';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';

const GraphContainer = styled.div`
  height:500px;
  width:500px;
`

ChartJS.register(ArcElement, Tooltip, Legend);



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
    return decodedTitle;}

const Charts = () => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const projectID = getProjectID()
  const user = useSelector((state) => state.user.currentUser);
  const projectTitle = getProjectTitle()
  const token = useSelector((state) => state.user.jwt)
  const [progressCounts, setProgressCounts] = useState(null)

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/buckets/getBuckets/'+ projectID
    axios.get('http://localhost:3000/api/tasks/getTasksProgress/'+projectID, config)
      .then(response => {
        setProgressCounts(response.data.progressCounts)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  const options = {
    plugins: {
        legend: {
            labels: {
                color: '#000000',
                font: {
                    size: 20,
                }
            }
        }
    }
}
    var data = progressCounts ? {
        labels: ['Not Started', 'In Progress', 'Stuck', 'Done'],
        datasets: [
        {
        label: '# of Tasks',
        data: [
            progressCounts['Not Started'],
            progressCounts['In Progress'],
            progressCounts['Stuck'],
            progressCounts['Done'],
          ],
        backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            '#39e239',
            'rgba(255, 255, 0, 1)'

        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            '#39e239',
            'rgba(255, 255, 0, 1)'
        ],
        borderWidth: 1,
        },
    ]
}:
{
    labels: ['Not Started', 'In Progress', 'Stuck', 'Done'],
    datasets: [
    {
    label: '# of Tasks',
    data: [
        0,0,0,0     
      ],
    backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        '#39e239',
        'rgba(255, 255, 0, 1)'

    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        '#39e239',
        'rgba(255, 255, 0, 1)'
    ],
    borderWidth: 1,
    },
]
}

  return (
    <>
        <BucketNavbar title={projectTitle} _id={projectID}/>
        {progressCounts ? (
            <GraphContainer>
                <Pie data={data} options={options}/>
            </GraphContainer>
            ) : (
            <div>Loading chart...</div>
            )}
        
    </>
  )
}

export default Charts