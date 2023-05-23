import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Context } from '../App';


function Home() {

    const { ctx, set_ctx } = React.useContext(Context);
    const navigate = useNavigate();
    
    console.log("Home context status: " + ctx.status);

    React.useEffect(() => {
        if (ctx.status === "unregistered") {
            navigate('/register');
        }
    }, [ctx.status, navigate]);

    if (ctx.status === "uninitialized") {
        loadUser(ctx, set_ctx);
        return(
            <Container fluid>
                <Container className='text-center'>
                    <h1 className='header'>DocTalk</h1>
                    <h3 className='subheader'>Your online medical appointments. Sign in to get started!</h3>
                    <Button variant='info' classname="mt-3" onClick={() => window.location.href='https://backend.egs-doctalk.deti/v1/login'}>Sign In!</Button>    
                </Container>
            </Container>
        );
    }

    if (ctx.status === "registered") {
        loadUser(ctx, set_ctx);
    }

    if (ctx.status === "unauthorized") {
            return(
                <Container fluid>
                    <Container className='text-center'>
                        <h1 className='header'>DocTalk</h1>
                        <h3 className='subheader'>Your online medical appointments. Sign in to get started!</h3>
                        <Button variant='info' classname="mt-3" onClick={() => window.location.href='https://backend.egs-doctalk.deti/v1/login'}>Sign In!</Button>    
                    </Container>
                </Container>
            );
    }

    if (ctx.status === "authenticated") {
        navigate("/homepage");
    }

    return "Loading user data...";
}


function loadUser(ctx, set_ctx) {    
    console.log(new Date() + " loading user...");
    const token = document.cookie.split('; ').filter(row => row.startsWith('jwt=')).map(c=>c.split('=')[1])[0];
    fetch("https://backend.egs-doctalk.deti/v1/self", {
        credentials: 'include',
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    })
    .then(response => {
        if (response.status === 200) {
            response.json().then
            (responseJson => {
                set_ctx({user_data: responseJson["user_data"], user_role: responseJson["user_type"], status: "authenticated"});
            });
        } else if (response.status === 404) {
            set_ctx({...ctx, status: "unregistered"});     
        } else if (response.status === 401) {
            set_ctx({...ctx, status: "unauthorized"});
        }
        else {
            set_ctx({...ctx, status: "uninitialized"});
        }
        console.log(new Date() + " updating...");
    });
}

export default Home;