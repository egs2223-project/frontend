import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Context } from '../App';

function Homepage() {

    const navigate = useNavigate();
    const { ctx, set_ctx } = React.useContext(Context);

    React.useEffect(() => {
        if(ctx.status !== "authenticated") {
            navigate("/");
        }
    }, [ctx.status, navigate]);

    return (
        <Container className='text-center'>
            <img src={require('../logo.png')} width="200" ></img>
            <h1 className='header'>DocTalk</h1>
            <h3 className='subheader'>Your online medical appointments!</h3>
            <Container fluid>
                <Button className="mt-12" variant='info' onClick={() => navigate("/appointments")}>View Appointments</Button>
                {
                    ctx.user_role === "Patient" &&
                    <Button className="mt-12" variant='info' onClick={() => navigate("/createAppointment")}>New Appointment</Button>
                }
                <Button className="mt-12" variant='info' onClick={() => navigate("/profile")}>Profile</Button>
            </Container>
        </Container>
    );
}

export default Homepage;