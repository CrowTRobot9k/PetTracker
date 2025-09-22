/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useEffect, createContext } from 'react';
import { Navigate } from 'react-router';
// import { User } from '../Types/SharedTypes';
import { useLocation } from 'react-router';
import { useAuthStore } from '../Stores/AuthStore';

const UserContext = createContext({});

function AuthorizeView(props: { children: React.ReactNode }) {
    const { isAuthenticated, user, isLoading, isLoggingOut, initializeAuth, checkAuth } = useAuthStore();
    const location = useLocation();
    const currentRoute = location.pathname;

    useEffect(() => {
        // Initialize auth from localStorage on component mount
        initializeAuth();
    }, []);

    useEffect(() => {
        // Skip authentication check on sign-in page
        if (currentRoute === '/signin') {
            return;
        }

        // Skip authentication check if user is currently logging out
        if (isLoggingOut) {
            return;
        }

        // If not authenticated, try to check with server
        if (!isAuthenticated) {
            checkAuth();
        }
    }, [currentRoute, isAuthenticated, isLoggingOut, checkAuth]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <>
                <p>Loading...</p>
            </>
        );
    }

    // Handle signin page - if authorized, redirect to home
    if (currentRoute === '/signin') {
        if (isAuthenticated) {
            return <Navigate to="/" />;
        } else {
            return (
                <>
                    <UserContext.Provider value={user || {}}>{props.children}</UserContext.Provider>
                </>
            );
        }
    }

    // For all other pages - if authorized, show content, otherwise redirect to signin
    if (isAuthenticated) {
        return (
            <>
                <UserContext.Provider value={user || {}}>{props.children}</UserContext.Provider>
            </>
        );
    } else {
        return <Navigate to="/signin" />;
    }

}

export function AuthorizedUser(props: { value: string }) {
    // Consume the username from the UserContext
    const user: any = React.useContext(UserContext);

    // Display the username in a h1 tag
    if (props.value == "email")
        return <>{user.email}</>;
    else
        return <></>
}

export default AuthorizeView;