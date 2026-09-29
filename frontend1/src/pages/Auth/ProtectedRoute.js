import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const ProtectedRoute = () => {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    if(cookies.loginCookie === undefined) return <Navigate to="/login" />;

    return <Outlet />
}

export default ProtectedRoute;