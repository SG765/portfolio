import { useEffect } from "react";

function About({loggedIn}){
    useEffect(() => {
        // Check authentication status and update loggedIn state
        const authToken = localStorage.getItem('authToken');
        console.log(authToken)
        loggedIn= !!authToken;
      }, []);

    return (
        <> 
        </>
    );
}

export default About;