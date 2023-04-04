import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Homepage() {

    const navigate = useNavigate();

    return (
            <Container className='text-center'>
                <h1 className='header'>DocTalk</h1>
                <h3 className='subheader'>Your online medical appointments!</h3>
                <div>
                    <Button variant='info' classname="mt-3" onClick={() => navigate("/appointments")}>View Appointments</Button>
                </div>
                <div>
                    <Button variant='info' className="mt-3" onClick={() => navigate("/createAppointment")}>New Appointment</Button>
                </div>
            </Container>
    );

}

export default Homepage;