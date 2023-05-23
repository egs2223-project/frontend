import React from 'react';
import { Context } from '../App';
import { useNavigate } from "react-router-dom";

async function updateDoctor(doctor) {
    const token = document.cookie.split('; ').filter(row => row.startsWith('jwt=')).map(c=>c.split('=')[1])[0];
    const resp = await fetch(`https://backend.egs-doctalk.deti/v1/doctors/${doctor.id}`, {
        credentials: 'include',
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(doctor)
    });

    let success = false;
    let error = {};
    if(resp.status === 202) {
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

function ProfileDoctor() {
    const { ctx, set_ctx } = React.useContext(Context);
    const navigate = useNavigate();

    const [state, set_state] = React.useState(ctx.user_data);

    const handleInputChange = (event) => {
        console.log(event);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        set_state({...state,
            [name]: value
        });
    }

    const handleSpecialtiesInputChange = (event) => {
        console.log(event);
        const target = event.target;
        const name = target.name;
        const value = Array.from(target.selectedOptions, option => option.value);
        set_state({...state,
          [name]: value
        });
      }

    const handleSubmit = (event) => {
        event.preventDefault();

        updateDoctor(state).then(r => {
            if(r.success === true) {
                set_ctx({...ctx, user_data: state});
                alert("Your profile was updated!");
                navigate("/");
            } else {
                alert(`Something went wrong: ${r.error.reason}`);
            }
        });
    }

    const handleCancel = () => {
        navigate("/");
    }

    React.useEffect(() => {
        if (ctx.status !== "authenticated") {
            navigate("/");
        }
    }, [ctx.status, navigate]);

    if(ctx.status !== "authenticated") {
        return "...";
    }

    return (
        <div>
        <h3>Dr. {state.name}</h3>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input type="datetime-local" className="form-control" id="dob"
                    name="date_of_birth" value={state.date_of_birth} onChange={handleInputChange}></input>
                <div id="dobHelp" className="form-text">Example: 2023-03-27T16:17:19.932Z</div>
            </div>
            <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input type="text" className="form-control" id="phoneNumber"
                    name="phone_number" value={state.phone_number} onChange={handleInputChange}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" id="address"
                    name="address" value={state.address} onChange={handleInputChange}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="city" className="form-label">City</label>
                <input type="text" className="form-control" id="city"
                    name="city" value={state.city} onChange={handleInputChange}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="region" className="form-label">Region</label>
                <input type="text" className="form-control" id="region"
                    name="region" value={state.region} onChange={handleInputChange}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="postal_code" className="form-label">Postal Code</label>
                <input type="text" className="form-control" id="postal_code"
                    name="postal_code" value={state.postal_code} onChange={handleInputChange}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="country" className="form-label">Country</label>
                <input type="text" className="form-control" id="country"
                    name="country" value={state.country} onChange={handleInputChange}></input>
            </div>
            <select className="form-select form-select-lg mb-3" multiple aria-label=".form-select-lg example"
                onChange={handleSpecialtiesInputChange} name="specialties" value={state.specialties}>
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
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
        </form>
        </div>
    );
}

export default ProfileDoctor;