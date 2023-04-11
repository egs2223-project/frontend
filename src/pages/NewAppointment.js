import React from 'react';
import { Context } from '../App';
import { useNavigate } from "react-router-dom";

function LoadDoctors(state, set_state) {
    let specialties = ``;
    for (let specialty of state.selected_specialties) {
        specialties += `&specialties=${specialty}`;
    }

    fetch(`https://localhost:7000/v1/doctors?limit=50&offset=0${specialties}`, {
        credentials: 'include',
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (response.status === 200) {
                response.json().then(d => {
                    set_state({ ...state, loading_doctors: false, error: false, doctors: d });
                });
            }
            else {
                set_state({ ...state, loading_doctors: false, error: true });
            }
        });
}

function LoadDoctorAppointments(state, set_state) {
    var now = `2022-04-03T23:20:27.890Z`;  //change to current time

    if (state.selected_doctor == null) {
        set_state({ ...state, selected_doctor_apps: [] });
        return;
    }

    fetch(`https://localhost:7000/v1/appointments?limit=50&offset=0&from=${now}&doctor_id=${state.selected_doctor}`, {
        credentials: 'include',
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (response.status === 200) {
                response.json().then(a => {
                    set_state({ ...state, selected_doctor_apps: a, loading_selected_doctor_apps: false });
                });
            }
            else {
                set_state({ ...state, error: true, loading_selected_doctor_apps: false });
            }
        });
}

function PostAppointment(appointmentBody, navigate) {
    console.log(JSON.stringify(appointmentBody));

    fetch("https://localhost:7000/v1/appointments/", {
        credentials: 'include',
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentBody)
    }).then(response => {
        console.log(response.status);
        if (response.status === 201) {
            alert("Success!");
            navigate("/appointments");
        }
        else if (response.status === 403) {
            alert("Forbidden");
        } else if (response.status === 404) {
            alert("Doctor not found");
        } else if (response.status === 409) {
            alert("The new appointment conflicts with an existing one");
        } else {
            alert(`There was an unexpected problem. You should debug this.`);
        }
    });
}

function NewAppointment() {
    const { ctx, set_ctx } = React.useContext(Context);
    const [state, set_state] = React.useState(
        {
            loading_doctors: true,
            error: false,
            selected_doctor: null,
            selected_doctor_specialties: [],
            doctors: [],
            selected_specialties: [],
            app_specialty: null,
            selected_doctor_apps: [],
            loading_selected_doctor_apps: false
        });
    const navigate = useNavigate();

    const [appointment, set_appointment] = React.useState(
        {
            id: '00000000-0000-0000-0000-000000000000',
            datetime: '',
            ical_data: null,
            status: "Scheduled",
            expected_duration: "00:20:00",
            doctor_id: null,
            patient_id: ctx.user_data == null ? null : ctx.user_data.id,
            reason: null,
            summary: null,
            session_url: null,
            specialty: null,
        });

    React.useEffect(() => {
        if (ctx.status !== "authenticated") {
            navigate("/");
        }
    }, []);

    if (ctx.status !== "authenticated") {
        return "...";
    }

    const SpecialtySelector = () => {
        return (
            <div>
                <h1>Select the specialt(y/ies) you want</h1>
                <select class="form-select form-select-lg mb-3" multiple aria-label=".form-select-lg example"
                    onChange={handleSpecialtiesInputChange} name="selected_specialties" value={state.selected_specialties}>
                    <option selected>Specialties</option>
                    <option value="Allergiology">Allergiology</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Anesthesiology">Anesthesiology</option>
                    <option value="Dermathology">Dermathology</option>
                    <option value="DiagnosticRadiology">Diagnostic Radiology</option>
                    <option value="EmergencyMedicine">Emergency Medicine</option>
                    <option value="InternalMedicine">Internal Medicine</option>
                    <option value="MedicalGenetics">Medical Genetics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="NuclearMedicine">Nuclear Medicine</option>
                    <option value="Obstetrics">Obstetrics</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Ophthalnology">Ophthalnology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="PhysicalMedicine">Physical Medicine</option>
                    <option value="PreventiveMedicine">Preventive Medicine</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="RadiationOncology">Radiation Oncology</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Urology">Urology</option>
                </select>
            </div>
        );
    }

    const handleSpecialtiesInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        let value = Array.from(target.selectedOptions, option => option.value);
        if (value.includes("Specialties")) value = value.filter((i) => { return i !== "Specialties" });
        set_state({
            ...state,
            [name]: value,
            loading_doctors: true
        });
    }

    const Doctor = (props) => {
        if (props.data.state.selected_doctor === props.data.d.id) {
            return <li id={props.data.d.id} class="list-group-item active" onClick={handleSelectDoctor}>Dr. {props.data.d.name} - {props.data.d.specialties.toString()}</li>;
        }
        return <li id={props.data.d.id} class="list-group-item" onClick={handleSelectDoctor}>Dr. {props.data.d.name} - {props.data.d.specialties.toString()}</li>;
    }

    const Appointment = (props) => {
        return <li id={props.data.d.id} class="list-group-item">{props.data.d.datetime}</li>;
    }

    const Specialty = (props) => {
        if (props.data.state.app_specialty === props.data.s) {
            return <li id={props.data.s} class="list-group-item active" onClick={handleSelectAppSpecialty}>{props.data.s}</li>;
        }
        return <li id={props.data.s} class="list-group-item" onClick={handleSelectAppSpecialty}>{props.data.s}</li>;
    }

    const handleSelectAppSpecialty = (event) => {
        console.log(event);

        set_state({ ...state, app_specialty: event.target.id });
    }

    const handleSelectDoctor = (event) => {
        console.log(event);

        const new_selected_doctor = event.target.id;

        const specialties = new_selected_doctor == null ? [] : state.doctors.filter((d) => { return d.id === new_selected_doctor })[0].specialties;
        console.log(specialties);
        set_state({ ...state, selected_doctor: new_selected_doctor, loading_selected_doctor_apps: true, selected_doctor_specialties: specialties });
    }

    const handleInputChange = (event) => {
        console.log(event);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        set_appointment({
            ...appointment,
            [name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (state.selected_doctor == null) {
            alert("Please select a doctor");
            return;
        }
        if (state.app_specialty == null) {
            alert("Please select a specialty");
            return;
        }

        const appointmentBody = {
            ...appointment,
            doctor_id: state.selected_doctor,
            specialty: state.app_specialty
        }

        PostAppointment(appointmentBody, navigate);
    }

    if (state.loading_doctors === true) {
        LoadDoctors(state, set_state);
    }
    if (state.loading_selected_doctor_apps === true) {
        LoadDoctorAppointments(state, set_state);
    }

    return (
        <div>
            <SpecialtySelector></SpecialtySelector>
            <h1>Doctors: </h1>
            <ul class="list-group">
                {state.doctors.map((d) => <Doctor data={{ d: d, state: state }} />)}
            </ul>
            <h1>Already Scheduled Appointments: </h1>
            <ul class="list-group">
                {state.selected_doctor_apps.map((d) => <Appointment data={{ d: d, state: state }} />)}
            </ul>
            <h1>Appointment Specialty: </h1>
            <ul class="list-group">
                {state.selected_doctor_specialties.map((s) => <Specialty data={{ s: s, state: state }} />)}
            </ul>
            <form onSubmit={handleSubmit}>
                <div class="mb-3">
                    <label for="datetime" class="form-label">Date Time</label>
                    <input type="datetime-local" class="form-control" id="datetime" value={appointment.datetime}
                        name="datetime" onChange={handleInputChange}></input>
                </div>
                <div class="mb-3">
                    <label for="name" class="form-label">Appointment Reason</label>
                    <input type="text" class="form-control" id="name"
                        name="reason" value={state.name} onChange={handleInputChange}></input>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default NewAppointment;
