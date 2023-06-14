import React, { useState,useCallback} from "react";
import ReactFlow, { Controls, Background, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

const TasksGraph = ({ tasksData }) => {
  let x = 100;
  let y = 100;

  const initialEdges = [];
  const initialNodes = tasksData.tasks.map((task) => {
    const taskObject = {
      id: task._id,
      data: {
        label: task.title
      },
      position: {
        x: x,
        y: y
      }
    };

    x += 150;
    y += 50;
    if (task.previous) {
      const edge = {
        id: `${task._id}-${task.previous}`,
        source: task.previous,
        target: task._id
      };
      initialEdges.push(edge); // Use initialEdges here
    }
    return taskObject;
  });

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
  const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );

  return (
    <div style={{ height: '500px', width: '98%', border: '5px solid black', padding: '10px', marginLeft: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <span style={{ fontSize: '30px', marginTop: '40px' }}>The tasks and their relationship</span>
    </div>
  );
};

export default TasksGraph;
