import React from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const AppRoute = ({ component: Component, layout: Layout, isAuthProtected, ...rest }) => {
    const navigate = useNavigate();
    if (isAuthProtected && !localStorage.getItem("authUser")) {
        return <Navigate to="/login" />;
    }

    return <Component navigate={navigate}/>
};

export default AppRoute;
