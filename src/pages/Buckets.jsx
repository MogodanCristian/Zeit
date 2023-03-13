import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import CreateBucketModal from '../components/CreateBucketModal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Bucket from '../components/Bucket';

const PageContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const BucketContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`


const ButtonContainer = styled.div`
  justify-content: center;
  align-items: center;
  display:flex;
  flex-direction: row;
  justify-content: space-evenly; /* add space between buttons */
  width: 50%; /* set width of container */
`

const StyledButton = styled(Button)`
  margin-top: 30px;
`
function getProjectID() {
  const url = window.location.href;
  const parts = url.split("/");
  const projectsIndex = parts.indexOf("projects");
  return parts[projectsIndex + 1];
}

const Buckets = () => {
  const projectID = getProjectID()
  const token = useSelector((state) => state.user.jwt)
  const user = useSelector((state)=> state.user.currentUser)
  const [buckets, setBuckets] = useState([]);
  const [showCreateBucketModal, setShowCreateBucketModal]=useState(false)
  const handleCloseCreateBucket = () => setShowCreateBucketModal(false);
  const handleShowCreateBucket = () => setShowCreateBucketModal(true);

  const handleAddUserToProject = () => {
    // handle add user to project logic
  }

  useEffect(() => {
    const config = {
      headers: { 'auth-token': token }
    };
    const path = 'http://3.69.101.106:3080/api/buckets/getBuckets/'+ projectID
    axios.get(path, config)
      .then(response => {
        setBuckets(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [projectID]);

  return (
    <>
    <PageContainer>
      <ButtonContainer>
        <StyledButton onClick={handleShowCreateBucket}>Create Bucket</StyledButton>
        <StyledButton onClick={handleAddUserToProject}>Add User to Project</StyledButton>
      </ButtonContainer>
      <BucketContainer>
        {buckets.map((item) =>(
          <Bucket
          title={item.title}
          />
        ))}
      </BucketContainer>
    </PageContainer>
    <CreateBucketModal show={showCreateBucketModal} onHide={handleCloseCreateBucket} projectID={projectID}/>
    </>
  );
}

export default Buckets;
