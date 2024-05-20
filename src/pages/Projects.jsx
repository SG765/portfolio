
import {useState, useEffect} from 'react'
import DOMPurify from 'dompurify';
import Navigation from '../components/Navigation';
import { Button, Row } from 'antd';
import EditProjectModal from '../components/EditProjectModal';
import { get_all_projects, get_all_display_projects } from '../controllers/Project';
import ProjectCard from '../components/ProjectCard';
import '../cssfiles/projects.css'


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
            let data;
            if(loggedIn){
                data= await get_all_projects()
            }else{
                data= await get_all_display_projects() 
            } 
            
            if(data.body != null){
                setProjects(data.body)
            }
        }
        fetchProjects();
    },[]);
      
    return (
        <div className='page' style={{ width:"85vw", minHeight:"86vh", zIndex:1, margin: 'auto'
        }}> 
        { loggedIn && (
            <div><Button style={{justifySelf: 'end'}} onClick={handleAddProjectOpen}>Add Project</Button>
            <EditProjectModal open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)}/>
            </div>
        )}

        <Row style={{margin: "20px", justifyContent: "center"}}>
            {projects && (
                /*testing out getting data */
                projects.map((data, index)=> (
                    <ProjectCard key={index} projData={data} loggedIn={loggedIn}/>
                )
                )
            )
            }
        </Row>

        </div>
    );
}

export default Projects;