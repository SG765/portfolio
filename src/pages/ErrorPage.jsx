import { useEffect } from "react";

function ErrorPage({mode}){
    let pageError;

    if(mode === "unauth"){
        pageError = (<div style={{color: 'white', fontSize: "23px"}}>
            Unauthorized To View this page
        </div>);
    }

    return (
        <div style={{align: "center"}}> 
            {pageError}
        </div>
    );
}

export default ErrorPage;