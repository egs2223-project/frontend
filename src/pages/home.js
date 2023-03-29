import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { UserContext } from '../App';

class Home extends Component {

    render() {
        return (<UserRender />)
    }
}

function UserRender() {
    const { ctx, ctx_update } = React.useContext(UserContext);
    console.log(ctx.status);

    if (ctx.status === "uninitialized") {
        loadUser(ctx, ctx_update);
        return(
            <Container fluid>
                <Container className='text-center'>
                    <h1 className='header'>DocTalk</h1>
                    <h3 className='subheader'>Your online medical appointments. Sign in to get started!</h3>
                    <Button variant='info' classname="mt-3" onClick={() => window.location.href='https://localhost:7000/v1/login'}>Sign In!</Button>    
                </Container>
            </Container>
        )
        
    }

    if (ctx.status === "registered") {
        loadUser(ctx, ctx_update);
    }

    if (ctx.status === "unregistered") {
        ctx.setStatus("registered");
        window.location.href = '/register';
        return;
    }

    if (ctx.status === "unauthorized") {
        return(
            <Container fluid>
                <Container className='text-center'>
                    <h1 className='header'>DocTalk</h1>
                    <h3 className='subheader'>Your online medical appointments. Sign in to get started!</h3>
                    <Button variant='info' classname="mt-3" onClick={() => window.location.href='https://localhost:7000/v1/login'}>Sign In!</Button>    
                </Container>
            </Container>
        )
    }

    if (ctx.status === "authenticated") {
        return (
            <div>
                <div>
                    <h1 className='header'>DocTalk</h1>
                    <h3 className='subheader'>Your online medical appointments. Click below to view your appointments.</h3>
                    <button type="button" class="btn btn-primary" onClick={() => window.location.href = '/appointments'}>View Appointments</button>
                </div>
            </div>
        );
    }

    return "Loading user data...";
}

function loadUser(ctx, ctx_update) {    
    fetch("/v1/self", {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (response.status === 200) {
                response.json().then
                (responseJson => {
                    ctx.setUser(responseJson["user_data"]);
                    ctx.setUserRole(responseJson["user_type"]);
                    ctx.setStatus("authenticated");
                });
            } else if (response.status === 404) {
                ctx.setStatus("unregistered");
            } else if (response.status === 401) {
                ctx.setStatus("unauthorized");
            }
            ctx_update();
        });
}

export default Home;