import React from 'react';
import { Context } from '../App';
import { useNavigate } from "react-router-dom";
import ProfileDoctor from './profile_doctor';
import ProfilePatient from './profile_patient';

function Profile() {
    const { ctx, set_ctx } = React.useContext(Context);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (ctx.status !== "authenticated") {
            navigate("/");
        }
    }, []);

    if(ctx.status !== "authenticated") {
        return "...";
    }

    return (
        <>
            {
                ctx.user_role === 'Doctor' ? <ProfileDoctor/> : <ProfilePatient/>
            }
        </>
    );
}

export default Profile;
