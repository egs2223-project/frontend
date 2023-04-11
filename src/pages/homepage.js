import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Homepage() {

    const navigate = useNavigate();

    return (
        <Container className='text-center'>
            <h1 className='header'>DocTalk</h1>
            <h3 className='subheader'>Your online medical appointments!</h3>
            <Container fluid>
                <Button class="btn-outline-primary" variant='info' classname="mt-12" onClick={() => navigate("/appointments")}>View Appointments</Button>
                <Button class="btn-outline-primary" variant='info' className="mt-12" onClick={() => navigate("/createAppointment")}>New Appointment</Button>
                <Button class="btn-outline-primary" variant='info' className="mt-12" onClick={() => navigate("/profile")}>Profile</Button>
            </Container>
        </Container>
    );
}

export default Homepage;