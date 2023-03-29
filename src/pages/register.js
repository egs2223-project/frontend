import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../App';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = { registering: '' };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePreferencesInputChange = this.handlePreferencesInputChange.bind(this);
        this.handleSpecialtiesInputChange = this.handleSpecialtiesInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        console.log(event);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handlePreferencesInputChange(event) {
        console.log(event);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name.replace('notification_preferences.', '');
        var partialState = { "notification_preferences": this.state.notification_preferences };
        partialState["notification_preferences"][name] = value;
        this.setState(partialState);
    }

    handleSpecialtiesInputChange (event) {
        console.log(event);
        const target = event.target;
        const name = target.name;
        const value = Array.from(target.selectedOptions, option => option.value);
        this.setState({
          [name]: value
        });
      }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.registering === 'Doctor') {
            this.postDoctor();
        } else if (this.state.registering === 'Patient') {
            this.postPatient();
        }
    }

    postDoctor() {
        // clone state and remove extra fields
        const requestBodyDoctor = {
            id: '00000000-0000-0000-0000-000000000000',
            email: this.state.email,
            name: this.state.name,
            date_of_birth: this.state.date_of_birth,
            phone_number: this.state.phone_number,
            address: this.state.address,
            city: this.state.city,
            region: this.state.region,
            postal_code: this.state.postal_code,
            country: this.state.country,
            order_id: this.state.order_id,
            specialties: this.state.specialties
        };

        fetch("/v1/doctors/", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBodyDoctor)
        }).then(response => {
            console.log(response.status);
            if (response.status === 201) {
                window.location.href = '/appointments';
            }
            else if (response.status === 403) {
                alert("You need to use the same email you used to login externally");
            } else if (response.status === 409) {
                alert("This email is already registered");
            } else {
                alert(`This was an unexpected problem. You should debug this.`);
            }
        });
    }

    postPatient() {
        // clone state and remove extra fields
        const requestBodyPatient = {
            id: '00000000-0000-0000-0000-000000000000',
            email: this.state.email,
            name: this.state.name,
            date_of_birth: this.state.date_of_birth,
            phone_number: this.state.phone_number,
            address: this.state.address,
            city: this.state.city,
            region: this.state.region,
            postal_code: this.state.postal_code,
            country: this.state.country,
            patient_code: this.state.patient_code,
            notification_preferences: {
                email: this.state.notification_preferences.email,
                sms: this.state.notification_preferences.sms
            }
        };

        fetch("/v1/patients/", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBodyPatient)
        }).then(response => {
            console.log(response.status);
            if (response.status === 201) {
                window.location.href = '/appointments';
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

    render() {
        console.log(this.state.registering);
        if (this.state.registering !== '') {
            if (this.state.registering === 'Doctor') {
                return (
                    <form onSubmit={this.handleSubmit}>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                                name="email" checked={this.state.email} onChange={this.handleInputChange}></input>
                        </div>
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name"
                                name="name" checked={this.state.name} onChange={this.handleInputChange}></input>
                        </div>
                        <div class="mb-3">
                            <label for="dob" class="form-label">Date of Birth</label>
                            <input type="text" class="form-control" id="dob"
                                name="date_of_birth" checked={this.state.date_of_birth} onChange={this.handleInputChange}></input>
                            <div id="dobHelp" class="form-text">Example: 2023-03-27T16:17:19.932Z</div>
                        </div>
                        <div class="mb-3">
                            <label for="phoneNumber" class="form-label">Phone Number</label>
                            <input type="text" class="form-control" id="phoneNumber"
                                name="phone_number" checked={this.state.phone_number} onChange={this.handleInputChange}></input>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Address</label>
                            <input type="text" class="form-control" id="address"
                                name="address" checked={this.state.address} onChange={this.handleInputChange}></input>
                        </div>
                        <div class="mb-3">
                            <label for="city" class="form-label">City</label>
                            <input type="text" class="form-control" id="city"
                                name="city" checked={this.state.city} onChange={this.handleInputChange}></input>
                        </div>
                        <div class="mb-3">
                            <label for="region" class="form-label">Region</label>
                            <input type="text" class="form-control" id="region"
                                name="region" checked={this.state.region} onChange={this.handleInputChange}></input>
                        </div>
                        <div class="mb-3">
                            <label for="postal_code" class="form-label">Postal Code</label>
                            <input type="text" class="form-control" id="postal_code"
                                name="postal_code" checked={this.state.postal_code} onChange={this.handleInputChange}></input>
                        </div>
                        <div class="mb-3">
                            <label for="country" class="form-label">Country</label>
                            <input type="text" class="form-control" id="country"
                                name="country" checked={this.state.country} onChange={this.handleInputChange}></input>
                        </div>
                        <div class="mb-3">
                            <label for="order_id" class="form-label">Doctor's Order Id</label>
                            <input type="text" class="form-control" id="order_id"
                                name="order_id" checked={this.state.order_id} onChange={this.handleInputChange}></input>
                        </div>
                        <select class="form-select form-select-lg mb-3" multiple aria-label=".form-select-lg example"
                        onChange={this.handleSpecialtiesInputChange}  name="specialties" value={this.state.specialties}>
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
                    </form>
                );
            }
            else {
                return (
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                                    name="email" checked={this.state.email} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="mb-3">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="name"
                                    name="name" checked={this.state.name} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="mb-3">
                                <label for="dob" class="form-label">Date of Birth</label>
                                <input type="text" class="form-control" id="dob"
                                    name="date_of_birth" checked={this.state.date_of_birth} onChange={this.handleInputChange}></input>
                                <div id="dobHelp" class="form-text">Example: 2023-03-27T16:17:19.932Z</div>
                            </div>
                            <div class="mb-3">
                                <label for="phoneNumber" class="form-label">Phone Number</label>
                                <input type="text" class="form-control" id="phoneNumber"
                                    name="phone_number" checked={this.state.phone_number} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="mb-3">
                                <label for="address" class="form-label">Address</label>
                                <input type="text" class="form-control" id="address"
                                    name="address" checked={this.state.address} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="mb-3">
                                <label for="city" class="form-label">City</label>
                                <input type="text" class="form-control" id="city"
                                    name="city" checked={this.state.city} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="mb-3">
                                <label for="region" class="form-label">Region</label>
                                <input type="text" class="form-control" id="region"
                                    name="region" checked={this.state.region} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="mb-3">
                                <label for="postal_code" class="form-label">Postal Code</label>
                                <input type="text" class="form-control" id="postal_code"
                                    name="postal_code" checked={this.state.postal_code} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="mb-3">
                                <label for="country" class="form-label">Country</label>
                                <input type="text" class="form-control" id="country"
                                    name="country" checked={this.state.country} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="mb-3">
                                <label for="patient_code" class="form-label">SNS Number</label>
                                <input type="text" class="form-control" id="patient_code"
                                    name="patient_code" checked={this.state.patient_code} onChange={this.handleInputChange}></input>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="sms_notifications"
                                    name="notification_preferences.sms" checked={this.state.notification_preferences.sms} onChange={this.handlePreferencesInputChange}></input>
                                <label class="form-check-label" for="sms_notifications">
                                    SMS notifications
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="email_notifications"
                                    name="notification_preferences.email" checked={this.state.notification_preferences.email} onChange={this.handlePreferencesInputChange}></input>
                                <label class="form-check-label" for="email_notifications">
                                    E-mail notifications
                                </label>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                );
            }
        }
        else {
            return (
                <Container className='text-center'>
                    <button type="button" class="btn btn-primary" onClick={() => this.setState({
                        registering: 'Doctor',
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
                        specialties: []
                    })}>Doctor</button>
                    <button type="button" class="btn btn-success" onClick={() => this.setState({
                        registering: 'Patient',
                        email: '',
                        name: '',
                        date_of_birth: '',
                        phone_number: '',
                        address: '',
                        city: '',
                        region: '',
                        postal_code: '',
                        country: '',
                        patient_code: '',
                        notification_preferences: {
                            email: false,
                            sms: false
                        }
                    })}>Patient</button>
                </Container>
            );
        }
    }
}

export default Register;