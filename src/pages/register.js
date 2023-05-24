import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Context } from '../App';

function Register(){
    const {ctx, set_ctx} = React.useContext(Context)
    const navigate = useNavigate();
    const goToDoctorRegister = () => {
        navigate("/register/doctor");
    }

    const goToPatientRegister = () => {
        navigate("/register/patient");
    }

    React.useEffect(() => {
        if(ctx.status !== "unregistered") {
            navigate("/");
        }
    }, [ctx.status, navigate]);

    return (
        <Container fluid>
            <Container className='text-center'>
                <img src={require('../logo.png')} width="200" ></img>
                <Container>
                    <button type="button" className="btn btn-primary" onClick={goToDoctorRegister}>Doctor</button>
                    <button type="button" className="btn btn-success" onClick={goToPatientRegister}>Patient</button>
                </Container>
            </Container>
        </Container>
    );

}

export default Register;