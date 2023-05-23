import React from 'react';
import { useNavigate } from "react-router-dom";
import { Context } from '../App';

function RegisterDoctor() {
    const { ctx, set_ctx } = React.useContext(Context);
    const [state, set_state] = React.useState(
    {
        email: '',
        name: '',
        date_of_birth: '',
        phone_number: '',
        address: '',
        city: '',
        region: '',
        postal_code: '',
        country: '',
        order_id: '',
        specialties: [],
    });
    const navigate = useNavigate();

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

        postDoctor();
    }

    const handleCancel = () => {
        navigate("/register");
    }

    const postDoctor = () => {
        // clone state and remove extra fields
        const requestBodyDoctor = {
            id: '00000000-0000-0000-0000-000000000000',
            ...state
        };

        const token = document.cookie.split('; ').filter(row => row.startsWith('jwt=')).map(c=>c.split('=')[1])[0];
        fetch("https://backend.egs-doctalk.deti/v1/doctors/", {
            credentials: 'include',
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBodyDoctor)
        }).then(response => {
            console.log(response.status);
            if (response.status === 201) {
                set_ctx({...ctx, status: "registered"});
                navigate("/homepage");
            }
            else if (response.status === 403) {
                alert("You need to use the same email you used to loggin externally");
            } else if (response.status === 409) {
                alert("This email is already registered");
            } else {
                alert(`This was an unexpected problem. You should debug this.`);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                    name="email" checked={state.email} onChange={handleInputChange}></input>
            </div>
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name"
                    name="name" checked={state.name} onChange={handleInputChange}></input>
            </div>
            <div class="mb-3">
                <label for="dob" class="form-label">Date of Birth</label>
                <input type="datetime-local" class="form-control" id="dob"
                    name="date_of_birth" checked={state.date_of_birth} onChange={handleInputChange}></input>
                <div id="dobHelp" class="form-text">Example: 2023-03-27T16:17:19.932Z</div>
            </div>
            <div class="mb-3">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <input type="text" class="form-control" id="phoneNumber"
                    name="phone_number" checked={state.phone_number} onChange={handleInputChange}></input>
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address"
                    name="address" checked={state.address} onChange={handleInputChange}></input>
            </div>
            <div class="mb-3">
                <label for="city" class="form-label">City</label>
                <input type="text" class="form-control" id="city"
                    name="city" checked={state.city} onChange={handleInputChange}></input>
            </div>
            <div class="mb-3">
                <label for="region" class="form-label">Region</label>
                <input type="text" class="form-control" id="region"
                    name="region" checked={state.region} onChange={handleInputChange}></input>
            </div>
            <div class="mb-3">
                <label for="postal_code" class="form-label">Postal Code</label>
                <input type="text" class="form-control" id="postal_code"
                    name="postal_code" checked={state.postal_code} onChange={handleInputChange}></input>
            </div>
            <div class="mb-3">
                <label for="country" class="form-label">Country</label>
                <input type="text" class="form-control" id="country"
                    name="country" checked={state.country} onChange={handleInputChange}></input>
            </div>
            <div class="mb-3">
                <label for="order_id" class="form-label">Doctor's Order Id</label>
                <input type="text" class="form-control" id="order_id"
                    name="order_id" checked={state.order_id} onChange={handleInputChange}></input>
            </div>
            <select class="form-select form-select-lg mb-3" multiple aria-label=".form-select-lg example"
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
            <button type="submit" class="btn btn-primary">Submit</button>
            <button type="button" class="btn btn-danger" onClick={handleCancel}>Cancel</button>
        </form>
    );
}

export default RegisterDoctor;