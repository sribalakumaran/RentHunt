import {Navigate,Outlet} from 'react-router-dom';
import React from 'react';
import Spinner from "./Spinner";
import useAuthState from '../../hooks/useAuthState';

const PrivateRoute=()=>{
    const {loggedIn,checkState} = useAuthState()   

    if(checkState){
        return <Spinner />
    }


    return loggedIn ? <Outlet/> : <Navigate to='/signin'/>
}

export default PrivateRoute