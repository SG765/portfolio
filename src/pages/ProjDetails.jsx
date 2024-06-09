import '../cssfiles/projects.css'
import { useParams} from 'react-router-dom'; 
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react'
import { get_proj_by_name } from '../controllers/Project';
import {ArrowLeftOutlined} from '@ant-design/icons'
import { Divider, Flex, Carousel, Button, Input } from 'antd';
import DOMPurify from 'dompurify';

function ProjDetails({loggedIn}){
    const params= useParams(); 
    const [projData, setProjData] = useState(null);
    const [desc, setDescription] = useState(null)
    const startDate = projData ? projData.startDate.toDate() : null;
    const endDate = projData ? projData.endDate.toDate() : null;
    const [editMode, setEditMode] = useState(false);

    const useResponsiveGap = () => {
        const isLarge = useMediaQuery({ query: '(min-width: 992px)' });
        const isMedium = useMediaQuery({ query: '(min-width: 768px)' });
        const isSmall = useMediaQuery({ query: '(min-width: 576px)' });
      
        if (isLarge) return '32px'; // Large gap
        if (isMedium) return '24px'; // Medium gap
        if (isSmall) return '16px'; // Small gap
        return '8px'; // Default gap
      };
    
    const gap = useResponsiveGap();

    useEffect(() => {

        async function fetchData(){
            const response= await get_proj_by_name(params.name); 
            setProjData(response.body[0])
            const sanitizedHTML = DOMPurify.sanitize(projData.desc);
            setDescription(sanitizedHTML)
        }
        fetchData();
    }, []);

    useEffect(() => {
        // Check authentication status and update loggedIn state
        const authToken = localStorage.getItem('authToken');
        loggedIn= !!authToken;
      }, []);

    const contentStyle = {
        height: '360px',
        color: '#fff',
        lineHeight: '360px',
        textAlign: 'center',
        background: '#364d79',
        margin: "5px",
        justifyContent: "center"
      };

      const descriptionStyle = { 
        bottom: '100px',
        left: '10px', 
        color: '#fff',
        padding: '20px',
        borderRadius: '5px', 
        width: "80%",
        margin: "auto"
      };

      const handleEditClick = () => {
        setEditMode(true);
        };

    const handleSaveClick = () => {
        // placeholder
        setEditMode(false);
    };

    const handleGoBack = () => {
        window.history.back();
      };

    return (
        <div className='details-page' >
            {loggedIn && 
            (
                <div style={{ textAlign: 'end', marginRight: '3rem' }}>
                    {!editMode ? (
                        <Button onClick={handleEditClick}>Edit</Button>
                    ) : (
                        <Button onClick={handleSaveClick}>Save</Button>
                    )}
                </div>
            )}
            <Flex  gap={gap}>
                <div><ArrowLeftOutlined className='back-arrow' onClick={handleGoBack}/> </div>
            {projData && (
                <div style={{width: "90%"}} >
                    <Flex gap="large" style={{justifyContent: "space-between"}}>
                        <div className='proj-title'>
                        {editMode ? (
                                    <Input
                                        value={projData.name}
                                        onChange={e => setProjData({ ...projData, name: e.target.value })}
                                    />
                                ) : (
                                    projData.name
                                )}
                        </div>
                        <div style={{alignSelf: 'center', fontSize: '14px', fontStyle: "italic", fontFamily: "Times New Roman"}}>({startDate && (startDate.toLocaleDateString('en-UK', {
                            month: 'long', day: 'numeric'
                            }))} -  {endDate && (endDate.toLocaleDateString('en-UK', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            }))})
                        </div>
                    </Flex>
                    <Divider style={{backgroundColor: "white", padding: "0", margin:"0"}} width="100%"/>
                    
                    <Carousel arrows autoplay autoplaySpeed={3000} style={{margin: "10px"}}>
                        {projData.images.map((image, index) => (
                            <div key={index}>
                                <img src={image.src} alt={`Slide ${index + 1}`} style={contentStyle} />
                                <div style={descriptionStyle}>
                                    {image.desc}
                                </div>
                            </div>
                        ))}
                    </Carousel>

                    <Divider style={{backgroundColor: "white", padding: "0", margin:"0"}} width="100%"/>

                    <div dangerouslySetInnerHTML={{ __html: desc }} />

                </div>
            )}
            </Flex>
        </div>
    );
}

export default ProjDetails;