import React from 'react';
import { Context } from '../App';
import { useNavigate } from "react-router-dom";

function loadAppointments(state, set_state) {
    var now = new Date().toJSON();
    console.log(`Loading next appointments for current user...`);

    fetch(`/v1/appointments?status=Scheduled&limit=50&offset=0&from=${now}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (response.status === 200) {
            response.json().then(a => {
                let promises = [];
                for(let p of a) {
                    promises.push(loadAppointmentParticipants(p.doctor_id, p.patient_id));
                }
                Promise.all(promises).then(d => {
                    let appointments = a;
                    for(let app = 0; app < appointments.length; app++) {
                        appointments[app].doctor = d[app].doctor;
                        appointments[app].patient = d[app].patient;
                    }
                    set_state({...state, loading: false, error: false, appointments: appointments});
                });
            });
        } 
        else {
            set_state({...state, loading: false, error: true, appointments: []});
        }
    });
}

async function loadAppointmentParticipants(doctor_id, patient_id) {
    const r1 = await fetch(`/v1/doctors/${doctor_id}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const r2 = await fetch(`/v1/patients/${patient_id}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
    });

    let doctor = {};
    let patient = {};

    if(r1.status === 200) {
        const data = await r1.json();
        doctor = data;
    }

    if(r2.status === 200) {
        const data = await r2.json();
        patient = data;
    }

    return {doctor: doctor, patient: patient};
} 

async function updateAppointment(appointment) {    
    const resp = await fetch(`/v1/appointments/${appointment.id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment)
    });

    let success = false;
    let error = {};
    if(resp.status === 204) {
        success = true;
    } else if(resp.status === 403) {
        error = {reason: 'Forbidden'};
    } else if(resp.status === 404) {
        error = {reason: 'Not Found'};
    } else {
        error = {reason: 'Unknown'};
    }

    return {success: success, error: error};
}

function Appointments() {
    const { ctx, set_ctx } = React.useContext(Context);
    const [ state, set_state ] = React.useState(
        {
            loading: true, 
            error:false, 
            appointments: [], 
            selected_appointment: {}
        });
    const navigate = useNavigate();

    //
    const DoctorAppointment = (props) => {
        if(props.data.a.id === props.data.state.selected_appointment.id) {
            return <li id={props.data.a.id} class="list-group-item active" onClick={handleSelect}>{props.data.a.specialty} appointment with {props.data.a.patient.name} - {props.data.a.datetime}</li>;
        }
        return <li id={props.data.a.id} class="list-group-item" onClick={handleSelect}>{props.data.a.specialty} appointment with {props.data.a.patient.name} - {props.data.a.datetime}</li>;
    }

    const PatientAppointment = (props) => {
        if(props.data.a.id === props.data.state.selected_appointment.id) {
            return <li id={props.data.a.id} class="list-group-item active" onClick={handleSelect}>{props.data.a.specialty} appointment with {props.data.a.doctor.name} - {props.data.a.datetime}</li>;
        }
        return <li id={props.data.a.id} class="list-group-item" onClick={handleSelect}>{props.data.a.specialty} appointment with {props.data.a.doctor.name} - {props.data.a.datetime}</li>;
    }
    
    const handleSelect = (event) => {
        console.log("selected: " + event.target.id);
        const app = state.appointments.filter((a) => {return a.id === event.target.id})[0];
        set_state({...state, selected_appointment: app});
    }

    const handleCancel = (event) => {
        console.log("cancelled: " + event.target.id);
        const appointment = {
            ...state.selected_appointment,
            status: 'Cancelled',
        };
        updateAppointment(appointment).then(r => {
            if(r.success === true) {
                set_state({loading: true, error:false, appointments: [], selected_appointment: {}});
                alert("Your appointment was cancelled!");
            } else {
                alert(`Something went wrong: ${r.error.reason}`);
            }
        });
    }

    const handleSelectedAppUpdate = (event) => {
        event.preventDefault();
        console.log("updating: " + event.target.id);

        updateAppointment(state.selected_appointment).then(r => {
            if(r.success === true) {
                alert("Updated!");
            } else {
                alert(`Something went wrong: ${r.error.reason}`);
            }
        });
    }

    const handleSelectedAppInputChange = (event) => {
        console.log(event);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let appointment = state.selected_appointment;
        appointment[name] = value;
        set_state({...state, selected_appointment: appointment});
    }
    //

    React.useEffect(() => {
        if (ctx.status !== "authenticated") {
            navigate("/");
        }
    }, []);

    if(ctx.status !== "authenticated") {
        return "...";
    }
    
    if(state.error === true) {
        return (<h1>Something went wrong.</h1>);
    }

    if(state.loading === true) {
        loadAppointments(state, set_state);
        return (<h1>Loading your appointments...</h1>);
    }
    
    let new_button = undefined;
    if(ctx.user_role === "Patient") {
        new_button = <button type="button" class="btn btn-primary" onClick={() => navigate("/createAppointment")}>New Appointment</button>
    }

    return (
        <>
            <h1>Your next appointments:</h1>
            <ul class="list-group">
                {state.appointments.map((app) => 
                    ctx.user_role === "Patient" ? <PatientAppointment data={{a: app, state: state}} /> : <DoctorAppointment data={{a: app, state: state}} />
                )}
            </ul>
            {
                ctx.user_role === "Patient" && 
                <button type="button" class="btn btn-primary" onClick={() => navigate("/createAppointment")}>New Appointment</button>
            }
            {
                Object.keys(state.selected_appointment).length !== 0 &&
                <div>
                    <button type="button" class="btn btn-primary">Join!</button>
                    <button type="button" class="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </div>
            }
            {
                ctx.user_role === "Doctor" && Object.keys(state.selected_appointment).length !== 0 &&
                <div>
                    <h3>Current Appointment:</h3>
                    <form onSubmit={handleSelectedAppUpdate}>
                        <div class="mb-3">
                            <label for="summary" class="form-label">Summary</label>
                            <input type="text" class="form-control" id="summary"
                                name="summary" value={state.selected_appointment.summary} onChange={handleSelectedAppInputChange}></input>
                        </div>
                        <button type="submit" class="btn btn-primary">Update</button>
                    </form>
                </div>
            }
        </>
    );
}

export default Appointments;