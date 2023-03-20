import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Error = styled.span`
  font-size: medium;
  color: red;`

const EditBucketModal = ({show, onHide, _id, defaultTitle,}) => {
  const env = JSON.parse(JSON.stringify(import.meta.env));
  const apiUrl = env.VITE_ZEIT_API_URL;
  const [title, setTitle] = useState(defaultTitle);
  const token = useSelector((state) => state.user.jwt); 
  const user = useSelector((state) => state.user.currentUser);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModified, setIsModified] = useState(false)

  const handleCreate = () => {
    if (title.trim() === '') {
      setError(true);
      setErrorMessage("You can't leave any field empty!")
    } else {
      if(!isModified)
      {
        setError(true)
        setErrorMessage("You actually have to modify something while updating your project!")
        return
      }
      const config = {
        headers: { 'auth-token': token }
      };
      const path = apiUrl+'/buckets/'+_id
      console.log(path)
      axios.put(path,{
        title: title
      }, config).then(() => {
        onHide();
        window.location.reload();
      }).catch((error) => {
        console.log(error);
      });
    }
  };
  return (
    <>
    <Modal show={show} onHide={() => {
        setError(false);
        onHide();
}}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle" className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control defaultValue={defaultTitle} type="text" placeholder="Enter title..." onChange={(event) => {
                setTitle(event.target.value)
                setIsModified(true)
            }
        }/>
          </Form.Group>
        </Form>
        {error && <Error>{errorMessage}</Error>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
            setError(false);
            onHide();
        }   }>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Save...
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default EditBucketModal