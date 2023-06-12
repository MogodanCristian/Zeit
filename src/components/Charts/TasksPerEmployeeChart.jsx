import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphContainer = styled.div`
  height:500px;
  width:500px;
`

const TasksPerEmployeeChart = ({employeeData}) => {
  const chartData = {
    labels: Object.keys(employeeData),
    datasets: [
      {
        label: 'easy',
        data: Object.values(employeeData).map((value) => value['easy']),
        backgroundColor: 'rgb(53, 162, 235)',
      },
      {
        label: 'medium',
        data: Object.values(employeeData).map((value) => value['medium']),
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'hard',
        data: Object.values(employeeData).map((value) => value['hard']),
        backgroundColor: 'rgb(255, 205, 86)',
      },
      {
        label: 'very hard',
        data: Object.values(employeeData).map((value) => value['very hard']),
        backgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    aspectRatio:1,
    plugins: {
      legend: {
          labels: {
              color: '#000000',
              font: {
                  size: 20,
              }
          }
      },
  },
  };


  return (
    <GraphContainer>
      <div style={{alignItems:'center', justifyContent:'center',textAlign:'center'}}>
          <Bar data={chartData} options={options} />
          <span style={{fontSize:"30px"}}>Number of tasks that haven't been completed yet</span>
      </div>
    </GraphContainer>
    
  )
}

export default TasksPerEmployeeChart