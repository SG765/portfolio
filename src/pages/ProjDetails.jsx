import '../cssfiles/projects.css'
import { useParams} from 'react-router-dom'; 
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect, useRef } from 'react'
import { get_proj_by_name } from '../controllers/Project';
import {ArrowLeftOutlined, DeleteOutlined, PlusCircleOutlined} from '@ant-design/icons'
import { Divider, Flex, Carousel, Button, Input } from 'antd';
import DOMPurify from 'dompurify';
import { Quill, toolbarOptions } from '../quill'; // Import the customized Quill setup
import 'quill/dist/quill.snow.css'; // Import Quill stylesheet
import { update_project } from '../controllers/Project';

const { TextArea } = Input;

function ProjDetails({loggedIn}){
    const params= useParams(); 
    const [projData, setProjData] = useState(null);
    const [desc, setDescription] = useState(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const startDate = projData ? projData.startDate.toDate() : null;
    const endDate = projData ? projData.endDate.toDate() : null;
    const [editMode, setEditMode] = useState(false);
    const editorRef = useRef(null);
  const quillInitializedRef= useRef(false);
  const quillRef = useRef(null)

    const useResponsiveGap = () => {
        const isLarge = useMediaQuery({ query: '(min-width: 992px)' });
        const isMedium = useMediaQuery({ query: '(min-width: 768px)' });
        const isSmall = useMediaQuery({ query: '(min-width: 576px)' });
      
        if (isLarge) return '32px'; // Large gap
        if (isMedium) return '20px'; // Medium gap
        if (isSmall) return '8px'; // Small gap
        return '8px'; // Default gap
      };
    
    const gap = useResponsiveGap();

    useEffect(() => {
        async function fetchData() {
            const response = await get_proj_by_name(params.name);
            if (response.body && response.body.length > 0) {
                const project = response.body[0];
                const sanitizedHTML = DOMPurify.sanitize(project.desc);
                setProjData(project);
                setDescription(sanitizedHTML);
            }
        }
        fetchData(); 
    }, [params.name]);

    useEffect(() => {
        // Check authentication status and update loggedIn state
        const authToken = localStorage.getItem('authToken');
        loggedIn= !!authToken;
      }, []);

      useEffect(() => {
        if (editMode && editorRef) { 
            if (!quillInitializedRef.current) {
                quillRef.current = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                        toolbar: toolbarOptions,
                        imageHandler: {
                            upload: file => {
                                return new Promise((resolve, reject) => {
                                    ajax().then(data => resolve(data.imageUrl));
                                });
                            }
                        },
                        attachmentHandler: {
                            upload: file => {
                                return new Promise((resolve, reject) => {
                                    ajax().then(data => resolve(data.attachmentUrl));
                                });
                            }
                        }
                    }
                });

                // Set the initial content
                quillRef.current.clipboard.dangerouslyPasteHTML(desc);

                quillRef.current.on('text-change', () => {
                    setDescription(quillRef.current.root.innerHTML);
                });


                quillInitializedRef.current = true;
            }
        }
        return () => {
            if (quillRef.current) {
                quillRef.current = null;
                quillInitializedRef.current = false;
            }
        };
    }, [editMode]);

    const contentStyle = {
        height: '360px',
        color: '#fff',
        lineHeight: '360px',
        textAlign: 'center',
        background: '#364d79',
        margin: "5px",
        justifyContent: "center"
      };

      const imgEditStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '360px',
        textAlign: 'center',
        background: '#364d79', 
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
        if (quillRef.current) {
            const updatedDesc = quillRef.current.root.innerHTML;
            setProjData(prevData => ({
                ...prevData,
                desc: updatedDesc
            }));
            setDescription(updatedDesc); 

            const response= update_project(projData.id, projData.name, projData.shortDesc, updatedDesc, projData.startDate, projData.endDate, projData.repo, projData.deploy, projData.cover, projData.images, projData.shown)
            console.log(response.body)
        }
        
        setEditMode(false);
    };

    const handleGoBack = () => {
        window.history.back();
      };

    const fileInputRef = useRef(null);
    
    const handleImgUploadClick = () => {
        fileInputRef.current.click();
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const newImage = {
              src: reader.result,
              desc: ''
            };
            setProjData(prevData => ({
              ...prevData,
              images: [...prevData.images, newImage]
            }));
          };
          reader.readAsDataURL(file);
        }
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
                    
                    {!editMode ? (
                        <Carousel arrows autoplay autoplaySpeed={3000} style={{margin: "10px"}}>
                            {projData.images.map((image, index) => (
                                <div key={index}>
                                    <img src={image.src} alt={`Slide ${index + 1}`} style={contentStyle} />
                                    <div style={descriptionStyle}>
                                        {image.desc}
                                    </div>
                                </div>
                            ))}
                        </Carousel>):(
                            <>
                            <Flex style={{padding: "10px"}}> 
                            {projData.images.map((image, index) => (
                            
                                <div key={index} style={{padding: "10px"}}>
                                    <div className="edit-img-container" onClick={() => setSelectedImageIndex(index)}>
                                        <img src={image.src} alt={`Slide ${index + 1}`} style={imgEditStyle} />
                                        <DeleteOutlined className="delete-icon" />
                                    </div>
                                </div> 
                                
                            ))}
                            <input type="file" ref={fileInputRef} className="file-input" onChange={handleFileChange}/>
                            <PlusCircleOutlined className='plus-icon' id="uploadButton" onClick={handleImgUploadClick} style={{alignSelf: "flex-center", fontSize: "2rem"}}/>

                            </Flex>
                            <div style={{ textAlign: "center", padding: "10px" }} className='edit-img-desc'>
                                <TextArea 
                                    value={projData.images[selectedImageIndex]?.desc || ""}
                                    style={{ width: "50vw" }}
                                    onChange={e => {
                                        const newImages = [...projData.images];
                                        newImages[selectedImageIndex].desc = e.target.value;
                                        setProjData({ ...projData, images: newImages });
                                    }}
                                />
                            </div>
                            </> 
                        )
                    }

                    <Divider style={{backgroundColor: "white", padding: "0", marginTop:"10px", marginBottom:"0"}} width="100%"/>

                    {!editMode ?(
                    <div style={{textAlign: "left"}} dangerouslySetInnerHTML={{ __html: desc }}  />)
                    : (
                        <>
                        Description
                        <div style={{backgroundColor: "white", color: "black", textAlign: "left", padding:"0px", margin:"10px", height: "fit-content"}}>
                            <div id="editor" ref={editorRef}  ></div>
                        </div>
                        </>
                        )
                    }

                </div>
            )}
            </Flex>
        </div>
    );
}

export default ProjDetails;