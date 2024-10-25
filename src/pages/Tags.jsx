import { useEffect, useState } from "react";
import { get_all_tags } from "../controllers/Tag";
import TagCard from "../components/TagCard";
import ErrorPage from "./ErrorPage"
import { Flex, Spin, Row, Button } from "antd";
import AddDBTagModal from "../components/AddDBTagModal"

function Tags({loggedIn}){
    useEffect(() => {
        // Check authentication status and update loggedIn state
        const authToken = localStorage.getItem('authToken');
        loggedIn= !!authToken;
      }, []);

      const [tags, setTags]= useState([]);
      const [loading, setLoading]= useState(false)
      const [isAddTagOpen, setAddTagOpen]= useState(false)

      const fetchTags = async () => {
        let data;

        setLoading(true)
        if(loggedIn){
            data= await get_all_tags()
        }
        
        if(data.body != null){
            setTags(data.body) 
        }
        setLoading(false)
    }

    useEffect(() =>{
        if(loggedIn)
            fetchTags();
    },[]);

    const handleDeleteTag = async (tagId) => {
        setTags(tags.filter(tag => tag.id !== tagId));
        await fetchTags();
      };

    const handleAddTagOpen=()=>{
        setAddTagOpen(true);
    }

    const handleAddTag = async() => {
        setAddTagOpen(false);
        await fetchTags();
    }

    const handleEditedTag = async () => {
        await fetchTags();
    }

    return (
        <div className='page' style={{ width:"85vw", minHeight:"86vh", zIndex:1, margin: 'auto' }} > 

        {loggedIn ? 
        (<>
        { loggedIn && (
            <div style={{textAlign: "right", marginRight: "2em"}}><Button className='blue-button' onClick={handleAddTagOpen}>Create New Tag</Button>
            <AddDBTagModal open={isAddTagOpen} onCancel={() => setAddTagOpen(false)} onAdd={handleAddTag}/>
            </div>
        )}
        <header style={{color: 'white'}}>Tags</header>
        <Row style={{margin: "20px", justifyContent: "center", backgroundColor: "rgb(255, 255, 255, 0.4)", padding: "20px", borderRadius: "10px"}}>
            {loading ? ( <Flex vertical style={{padding:"50px"}}><Spin className="spinner" size="large" /></Flex>) :(
                
                    tags.map((data, index)=> (
                             <TagCard bgColor="rgb(255, 255, 255, 0.9)" adminMode={true} key={data.id} index={index} tagData={data} loggedIn={loggedIn} onDelete={handleDeleteTag} onTagUpdate={handleEditedTag}/>
                            
                    )
                    )
                )
                }
            
        </Row></>) : ( <div> 
            <ErrorPage mode="unauth"/>
            </div>) }


        </div>
    );
}

export default Tags;