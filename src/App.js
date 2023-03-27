import React from 'react';
import {Button, Container} from 'react-bootstrap';
// import {Routes, Route, useNavigate} from 'react-router-dom';
import './App.css';

let App = () => {
  return (
    <Container fluid>
      <Container className='text-center'>
        <h1 className='header'>DocTalk</h1>
        <Button variant='info' classname="mt-3" onClick={() => window.location.href='http://localhost:5000/'}>Sign In!</Button>
      </Container>
    </Container>
  );
}

export default App;