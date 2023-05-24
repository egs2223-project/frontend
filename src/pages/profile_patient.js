import React from 'react';
import { Context } from '../App';
import { useNavigate } from "react-router-dom";

async function updatePatient(patient) {
    const resp = await fetch(`https://localhost:7000/v1/patients/${patient.id}`, {
        credentials: 'include',
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(patient)
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

function ProfilePatient() {
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

    const handlePreferencesInputChange = (event) => {
        console.log(event);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name.replace('notification_preferences.', '');
        var partialState = { "notification_preferences": state.notification_preferences };
        partialState["notification_preferences"][name] = value;
        set_state({...state, partialState});
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        updatePatient(state).then(r => {
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
            {
                state == null && navigate("/")
            }
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="dob" className="form-label">Date of Birth</label>
                    <input type="datetime-local" className="form-control" id="dob"
                        name="date_of_birth" value={state.date_of_birth} onChange={handleInputChange}></input>
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
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="sms_notifications"
                        name="notification_preferences.sms" checked={state.notification_preferences.sms} onChange={handlePreferencesInputChange}></input>
                    <label className="form-check-label" htmlFor="sms_notifications">
                        SMS notifications
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="email_notifications"
                        name="notification_preferences.email" checked={state.notification_preferences.email} onChange={handlePreferencesInputChange}></input>
                    <label className="form-check-label" htmlFor="email_notifications">
                        E-mail notifications
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
}

export default ProfilePatient;