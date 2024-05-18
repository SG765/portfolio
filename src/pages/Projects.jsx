
import {useState, useEffect} from 'react'
import DOMPurify from 'dompurify';
import Navigation from '../components/Navigation';
import { Button } from 'antd';
import EditProjectModal from '../components/EditProjectModal';
import { get_all_projects } from '../controllers/Project';


function Projects({loggedIn}){
    const [isAddModalOpen, setIsAddModalOpen]= useState(false);
    const [projects, setProjects]= useState([])

    const handleAddProjectOpen=()=>{
        setIsAddModalOpen(true);
    }

    useEffect(() => {
        // Check authentication status and update loggedIn state
        const authToken = localStorage.getItem('authToken');
        loggedIn= !!authToken;
      }, []);

    useEffect(() =>{
        async function fetchProjects(){
            const data= await get_all_projects() 
            if(data.body != null){
                setProjects(data.body)

                console.log(projects)
            }
        }
        fetchProjects();
    },[]);
      
    return (
        <div  style={{ width:"80vw", height:"100vh", zIndex:1, margin: 'auto'}}> 
        { loggedIn && (
            <><Button  onClick={handleAddProjectOpen}>Add Project</Button>
            <EditProjectModal open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)}/>
            </>
        )}

        {projects &&(
            /*testing out getting data */
            projects.map((data, index)=> (
                <>
                <div key={index} style={{color:'white'}}>{data.name}</div>
                <div style={{color:'white'}} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.desc) }} />
                </>
            )
            )
        )
        }

        </div>
    );
}

export default Projects;