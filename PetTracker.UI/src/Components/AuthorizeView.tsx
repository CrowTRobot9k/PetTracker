/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router';
import { User } from '../Types/SharedTypes';
import { useLocation } from 'react-router';



const UserContext = createContext({});


function AuthorizeView(props: { children: React.ReactNode }) {

    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // add a loading state
    let emptyuser: User = { email: "" };

    const [user, setUser] = useState(emptyuser);

    const location = useLocation();
    const currentRoute = location.pathname;

    useEffect(() => {
        // Get the cookie value
        let retryCount = 0; // initialize the retry count
        let maxRetries = 10; // set the maximum number of retries
        let delay: number = 1000; // set the delay in milliseconds

        // define a delay function that returns a promise
        function wait(delay: number) {
            return new Promise((resolve) => setTimeout(resolve, delay));
        }

        // define a fetch function that retries until status 200 or 401
        async function fetchWithRetry(url: string, options: any) {
            try {
                // make the fetch request
                let response = await fetch(url, options);

                // check the status code
                if (response.status == 200) {
                    console.log("Authorized");
                    let j: any = await response.json();
                    setUser({ email: j.email });
                    setAuthorized(true);
                    return response;
                } else if (response.status == 401) {
                    console.log("Unauthorized");
                    return response; 
                } else {
                    throw new Error("" + response.status);
                }
            } catch (error) {
                retryCount++;
                if (retryCount > maxRetries) {
                    throw error;
                } else {
                    await wait(delay);
                    return fetchWithRetry(url, options);
                }
            }
        }

        // call the fetch function with retry logic
        fetchWithRetry("/getauth", {
            method: "GET",
        })
            .catch((error) => {
                // handle the final error
                console.log(error.message);
            })
            .finally(() => {
                setLoading(false);  // set loading to false when the fetch is done
            });
    }, []);

    return (
        <>
            <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
        </>
    );

    if (loading) {
        return (
            <>
                <p>Loading...</p>
            </>
        );
    }
    else
    {
        if (currentRoute == '/signin')
        {
            if (authorized && !loading && currentRoute == '/signin') {
                return (
                    <>
                        <Navigate to="/" />
                    </>
                )
            }
            else
            {
                return (
                    <>
                        <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
                    </>
                );
            }
        }
        else if (authorized && !loading) {
            return (
                <>
                    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
                </>
            );
        } else {
            return (
                <>
                    <Navigate to="/signin" />
                </>
            )
        }
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