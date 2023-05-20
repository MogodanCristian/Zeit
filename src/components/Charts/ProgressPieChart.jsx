import React from 'react'
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const GraphContainer = styled.div`
  height:500px;
  width:500px;
`

ChartJS.register(ArcElement, Tooltip, Legend);


const ProgressPieChart = ({progressCounts}) => {
    const options = {
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
        aspectRatio:1
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
      {progressCounts ? (
        <GraphContainer>
          <div style={{alignItems:'center', justifyContent:'center',textAlign:'center'}}>
            <Pie data={data} options={options} />
            <span style={{fontSize:"30px"}}>Progress Chart</span>
          </div>
        </GraphContainer>
      ) : (
        <div>Loading chart...</div>
      )}
    </>
  )
}

export default ProgressPieChart