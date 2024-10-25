
import {useState, useEffect} from 'react'
import DOMPurify from 'dompurify';
import Navigation from '../components/Navigation';
import { Button, Row, Spin, Flex } from 'antd';
import AddProjectModal from '../components/AddProjectModal';
import { get_all_projects, get_all_display_projects } from '../controllers/Project';
import ProjectCard from '../components/ProjectCard';
import '../cssfiles/projects.css'
import EditProjectModal from '../components/EditProjectModal';
import { motion } from "framer-motion";


function Projects({loggedIn}){
    const [isAddModalOpen, setIsAddModalOpen]= useState(false);
    const [projects, setProjects]= useState([])
    const [isEditModalOpen, setEditModalOpen] = useState(Array(projects.length).fill(false));
    const [loading, setLoading] = useState(false)

    const listVariants = {
        loaded: { opacity: 1, transition: {
            when: "beforeChildren",
            staggerChildren: 0.15,
          }, 
        },
        unloaded: { opacity: 0, transition: {
            when: "afterChildren",
          } 
        },
      }

      const itemVariants = {
        loaded: { opacity: 1, x: 0, transition:{type: "spring", damping: 12}

         },
        unloaded: { opacity: 0, x: -100 },
      }

      const pageVariants = {
        initial: { 
            opacity: 0,  
        },
        in: { 
            opacity: 1,   
        },
        out: { 
            opacity: 0,  height: 0
        }
    };

    const pageTransition = {
        type: "spring",
        ease: "anticipate",
        duration: 1
    };

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
        <motion.div className='page' style={{ width:"85vw", minHeight:"86vh", zIndex:1, margin: 'auto' 
        }} initial="initial"  variants={pageVariants} animate="in" exit="out" transition={pageTransition}> 
        { loggedIn && (
            <div style={{textAlign: "right", marginRight: "20px", marginTop: "10px"}}><Button style={{justifySelf: 'end'}} className='blue-button' onClick={handleAddProjectOpen}>Add Project</Button>
            <AddProjectModal open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} onAdd={handleAddProject}/>
            </div>
        )}

        <Row style={{margin: "20px", justifyContent: "center"}}>
            {loading ? ( <Flex vertical style={{padding:"50px"}}><Spin className="spinner" size="large" /></Flex>) :(
                <motion.div variants={listVariants} initial="unloaded" animate="loaded" style={{display:"flex", flexWrap: "wrap", justifyContent: "center"}}>{projects && (
                    /*testing out getting data */
                    projects.map((data, index)=> (
                        <motion.div key={data.id} index={index} variants={itemVariants}>
                            <ProjectCard key={data.id} index={index} projData={data} loggedIn={loggedIn} onDelete={handleDeleteProject}/>
                        
                        </motion.div>
                    )
                    )
                )
                }</motion.div>
            )}
            
        </Row>

        </motion.div>
    );
}

export default Projects;