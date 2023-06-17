import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import CreateBucketModal from '../components/CreateBucketModal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Bucket from '../components/Bucket';
import BucketNavbar from '../components/BucketNavbar';
import AssignTasksAutomaticallyModal from '../components/AssignTasksAutomaticallyModal';


const PageContainer = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const NoBucketsMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24px;
  font-weight: bold;
`;

const BucketContainer = styled.div`
  margin-top: ${props => props.role === 'employee' ? '70px' : '30px'};
  display: block;
  height: 69vh;
  white-space: nowrap;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    height: 15px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }
  text-align: left;
`;


const ButtonContainer = styled.div`
  justify-content: center;
  align-items: center;
  display:flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const StyledButton = styled(Button)`
  margin-top: 20px;
`
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

const Buckets = () => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const projectID = getProjectID()
  const user = useSelector((state) => state.user.currentUser);
  const projectTitle = getProjectTitle()
  const token = useSelector((state) => state.user.jwt)
  const [buckets, setBuckets] = useState([]);
  const [showCreateBucketModal, setShowCreateBucketModal]=useState(false)
  const [showAssignAutomatically, setShowAssignAutomatically] = useState(false)
  const [isTaskCreated, setIsTaskCreated] = useState(false)
  
  const handleCloseCreateBucket = () => setShowCreateBucketModal(false);
  const handleShowCreateBucket = () => setShowCreateBucketModal(true);

  const handleBucketCreated = (newBucket) =>{
    setBuckets([...buckets, newBucket])
  }

  const handleBucketDeletion = (bucketID) =>{
    setBuckets(buckets.filter(bucket => bucket._id !== bucketID))
  }

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = apiUrl+'/buckets/getBuckets/'+ projectID
    if(user.role === 'employee'){
      axios.get(apiUrl+ '/buckets/getEmployeeBuckets/'+projectID+'/'+user._id)
      .then(response =>{
        setBuckets(response.data)
      })
    }
    else{
      axios.get(path, config)
      .then(response => {
        setBuckets(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }
    
  }, [projectID]);

  return (
    <>
    <PageContainer>
      <BucketNavbar title={projectTitle} _id={projectID}/>
      {user.role === 'manager' && <ButtonContainer>
        <StyledButton onClick={handleShowCreateBucket}>Create Bucket</StyledButton>
        <StyledButton onClick={()=>setShowAssignAutomatically(true)}>Assign tasks automatically...</StyledButton>
      </ButtonContainer>}
      <BucketContainer role={user.role}>
      {buckets.length === 0 ? (
            <NoBucketsMessage>No buckets to display!</NoBucketsMessage  >
          ) : (
            buckets.map((item, index) => (
              <Bucket
                title={item.title}
                _id={item._id}
                key={index}
                onDelete={handleBucketDeletion}
                projectTitle={projectTitle}
                modifyIsTaskCreated={() => setIsTaskCreated(!isTaskCreated)}
                projectID={projectID}
              />
            ))
          )}
      </BucketContainer>
    </PageContainer>
    <CreateBucketModal 
      show={showCreateBucketModal} 
      onHide={handleCloseCreateBucket} 
      projectID={projectID} 
      onBucketCreated={handleBucketCreated}/>

    <AssignTasksAutomaticallyModal
      showModal={showAssignAutomatically}
      onHide={() =>setShowAssignAutomatically(false)}
      projectID={projectID}
      isTaskCreated={isTaskCreated}
    />
    </>
    
  );
}

export default Buckets;
