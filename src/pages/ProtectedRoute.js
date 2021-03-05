import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../util/AuthContext';

export default function ProtectedRoute({ component: Component, ...rest }) {

    //The isAuthed boolean allows the user to navigate the dashboard.
    const { isAuthed } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={props => {
                if (isAuthed) {
                    return <Component {...props} />;
                }
                else {
                    return <Redirect to={
                        {
                            pathname: "/login",
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }}
        />
    );
}