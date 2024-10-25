import { useEffect } from "react";

function About({loggedIn}){
    useEffect(() => {
        // Check authentication status and update loggedIn state
        const authToken = localStorage.getItem('authToken');
        loggedIn= !!authToken;
      }, []);

    return (
        <div className='page' style={{ width:"85vw", minHeight:"86vh", zIndex:1, margin: 'auto'}} > 
        </div>
    );
}

export default About;