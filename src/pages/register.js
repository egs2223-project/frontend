import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function Register(){
    const navigate = useNavigate();
    const goToDoctorRegister = () => {
        navigate("/register/doctor");
    }

    const goToPatientRegister = () => {
        navigate("/register/patient");
    }

    return (
        <Container className='text-center'>
            <button type="button" class="btn btn-primary" onClick={goToDoctorRegister}>Doctor</button>
            <button type="button" class="btn btn-success" onClick={goToPatientRegister}>Patient</button>
        </Container>
    );

}

export default Register;