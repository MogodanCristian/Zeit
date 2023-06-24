import React, { useState,useCallback} from "react";
import ReactFlow, { Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge} from 'reactflow';
import 'reactflow/dist/style.css';
import { MarkerType } from 'reactflow';
import './style.css'
import axios from "axios";
import { useSelector } from "react-redux";

const TasksGraph = ({ tasksData }) => {
  console.log(tasksData)
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const token = useSelector((state) => state.user.jwt)
  const apiUrl = env.VITE_ZEIT_API_URL;
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
        source: task._id,
        target: task.previous,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'black',
          width: 20,
          height:20
          
        },
        style: { stroke: 'black' },
      };
      initialEdges.push(edge);
    }
    return taskObject;
  });

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
  const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );
  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      style: { stroke: 'black' }, 
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'black',
        width: 20,
        height:20
        
      },
    };
    const config = {
      headers: { 'auth-token': token }
    };
    axios.put(apiUrl+ '/tasks/' +params.source,{
      previous: params.target
    },config)
    setEdges((eds) => addEdge(newEdge, eds));

  }, []);

  const removeRelationships = async () => {
    const config = {
      headers: { 'auth-token': token }
    };
  
    for (const task of tasksData.tasks) {
      const taskId = task._id;
  
      try {
        await axios.put(apiUrl + '/tasks/' + taskId, { previous: null }, config);
      } catch (error) {
        console.error(`Failed to remove relationship for task with ID ${taskId}`, error);
      }
    }
  
    window.location.reload();
  };

  return (
    <div style={{ height: '500px', width: '98%', border: '5px solid black', padding: '10px', marginLeft: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
      <span style={{ fontSize: '30px' }}>The tasks and their relationship</span>
      <button onClick={removeRelationships} style={{ fontSize: '16px' }}>Remove All Relationships</button>
    </div>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Background />
      <Controls />
    </ReactFlow>
  </div>
  );
};

export default TasksGraph;
