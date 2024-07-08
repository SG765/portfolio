
import {useState, useEffect} from 'react'
import DOMPurify from 'dompurify';
import Navigation from '../components/Navigation';
import { Button, Row, Spin, Flex } from 'antd';
import AddProjectModal from '../components/AddProjectModal';
import { get_all_projects, get_all_display_projects } from '../controllers/Project';
import ProjectCard from '../components/ProjectCard';
import '../cssfiles/projects.css'
import EditProjectModal from '../components/EditProjectModal';


function Projects({loggedIn}){
    const [isAddModalOpen, setIsAddModalOpen]= useState(false);
    const [projects, setProjects]= useState([])
    const [isEditModalOpen, setEditModalOpen] = useState(Array(projects.length).fill(false));
    const [loading, setLoading] = useState(false)

    const handleAddProjectOpen=()=>{
        setIsAddModalOpen(true);
    }

    useEffect(() => {
        // Check authentication status and update loggedIn state
        const authToken = localStorage.getItem('authToken');
        loggedIn= !!authToken;
      }, []);

    const fetchProjects = async () => {
        let data;

        setLoading(true)
        if(loggedIn){
            data= await get_all_projects()
        }else{
            data= await get_all_display_projects() 
        } 
        
        if(data.body != null){
            setProjects(data.body) 
        }
        setLoading(false)
    }

    useEffect(() =>{
        fetchProjects();
    },[]);

    const handleAddProject = async () => {
        await fetchProjects(); 
      };
    
      const handleDeleteProject = async (projectId) => {
        setProjects(projects.filter(project => project.id !== projectId));
        await fetchProjects();
      };
 
      
    return (
        <div className='page' style={{ width:"85vw", minHeight:"86vh", zIndex:1, margin: 'auto'
        }}> 
        { loggedIn && (
            <div><Button style={{justifySelf: 'end'}} onClick={handleAddProjectOpen}>Add Project</Button>
            <AddProjectModal open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} onAdd={handleAddProject}/>
            </div>
        )}

        <Row style={{margin: "20px", justifyContent: "center"}}>
            {loading ? ( <Flex vertical style={{padding:"50px"}}><Spin classname="spinner" size="large" /></Flex>) :(
                <>{projects && (
                    /*testing out getting data */
                    projects.map((data, index)=> (
                        <>
                        <ProjectCard key={data.id} index={index} projData={data} loggedIn={loggedIn} onDelete={handleDeleteProject}/>
                        
                        </>
                    )
                    )
                )
                }</>
            )}
            
        </Row>

        </div>
    );
}

export default Projects;