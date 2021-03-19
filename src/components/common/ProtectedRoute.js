import React from 'react';
import { Route } from 'react-router-dom';
import { authenticationService } from '../../services/authenticationService';
import Login from '../Login';

function ProtectedRoute({ component: Component, roles, currentUser, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                const currentUser = authenticationService.getCurrentUser();
                if (!currentUser) {
                    return (
                        <Login/>);
                }

                if (roles && roles.indexOf(currentUser.role) === -1) {
                    return (
                        <Login/>);
                }
                return (
                    <>
                        <Component {...props} />
                    </>);
            }}
        />
    );
}

export default ProtectedRoute;