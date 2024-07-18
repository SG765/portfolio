import '../cssfiles/projects.css'
import { useNavigate, useParams} from 'react-router-dom'; 
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect, useRef } from 'react'
import { get_proj_by_name } from '../controllers/Project';
import TagCard from '../components/TagCard'
import AddTagModal from '../components/AddTagModal';
import {ArrowLeftOutlined, DeleteOutlined, PlusCircleOutlined, RightOutlined, LeftOutlined, PlusOutlined, MinusOutlined, FullscreenExitOutlined} from '@ant-design/icons'
import { Divider, Flex, Carousel, Button, Input, message, Upload, Image, Modal, Spin } from 'antd';
import DOMPurify from 'dompurify';
import { Quill, toolbarOptions } from '../quill'; // Import the customized Quill setup
import 'quill/dist/quill.snow.css'; // Import Quill stylesheet
import { update_project } from '../controllers/Project';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { motion, px, Reorder } from 'framer-motion'; 

const { TextArea } = Input;
const { Dragger } = Upload;

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
    const [loading, setLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const navigate= useNavigate()
    const [editImages, setEditImages] = useState(projData ? projData.images : [])

    const [currentPreview, setCurrentPreview] = useState(0); // State to track current previewed image index
    const [previewOpen, setPreviewOpen]= useState(false)
    const [addTagOpen, setAddTagOpen] = useState(false)

    const pageVariants = {
        initial: { opacity: 0, scale: 0.4 },
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 0.4 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    };

    const handleImageClick = (index) => {
        setCurrentPreview(index); // Update state when an image is clicked 
        setPreviewOpen(true)
    };

    const handleClosePreview = () =>{
        setPreviewOpen(false)
    }

    const handleNext = () => {
        setCurrentPreview((prev) => (prev + 1) % projData.images.length);
    };

    const handlePrev = () => {
        setCurrentPreview((prev) => (prev - 1 + projData.images.length) % projData.images.length);
    };

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
            setLoading(true)
            const response = await get_proj_by_name(params.name);
            if (response.body && response.body.length > 0) {
                const project = response.body[0];
                const sanitizedHTML = DOMPurify.sanitize(project.desc);
                setProjData(project);
                setDescription(sanitizedHTML);
            }
            setLoading(false)
        }
        fetchData(); 
    }, [params.name]);

    useEffect(() => {
        // Check authentication status and update loggedIn state
        const authToken = localStorage.getItem('authToken');
        loggedIn= !!authToken;
      }, []);

      useEffect(() => {
        if(projData){
        setEditImages(projData.images)}
      }, [projData]);


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
        height: '400px',
        color: '#fff',
        background: '#364d79',
        margin: 'auto',   
      };

      const imgEditStyle = {
        height: '100px',
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
        justifyContent: "center",
        textAlign: "center",
        margin: "auto",
        overflowY: "auto",
        height: '70px',
      };

      const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();
      
        return (
          <div className="tools">
            <PlusOutlined className='control-button' onClick={() => zoomIn()}/>
            <MinusOutlined className='control-button' onClick={() => zoomOut()}/>
            <FullscreenExitOutlined className='control-button' onClick={() => resetTransform()}/>
          </div>
        );
      };

      const handleEditClick = () => {
        setEditMode(true);
        };

    const handleSaveClick = async () => {
        if (quillRef.current) {
            setSaveLoading(true)
            const updatedDesc = quillRef.current.root.innerHTML;
            const imagesToSave = editImages.map(({ id, ...rest }) => rest); //remove id field that was added for reordering

            setProjData(prevData => ({
                ...prevData,
                desc: updatedDesc,
                images: imagesToSave
            })); 
            setDescription(updatedDesc); 
            const shown = projData.shown !== undefined ? projData.shown : false; //for cases where shown is yet to be defined

            const response= await update_project(projData.id, projData.name, projData.shortDesc, updatedDesc, projData.startDate, projData.endDate, projData.repo, projData.deploy, projData.cover, imagesToSave, projData.tags, shown)
            setSaveLoading(false)
            message.success(response.body)
        }
        
        setEditMode(false);
    };

    const handleGoBack = () => {
        if(editMode === true){ 
            setEditMode(false);
        }else{
        window.history.back();}
      };

    const fileInputRef = useRef(null);
    
    const handleImgUploadClick = () => {
        fileInputRef.current.click();
    };
    
    const handleFileChange = (event) => { 
        const files=event.target.files;
        const newImgs=[];

        Array.from(files).forEach(file =>  { 
          const reader = new FileReader();
          reader.onload = () => {
            newImgs.push({
              src: reader.result,
              desc: ''
            }); 
            if (newImgs.length === files.length) {
                setProjData(prevData => ({
                ...prevData,
                images: [...prevData.images, ...newImgs]
                }));
            }
          };
          reader.readAsDataURL(file);
        })
        
      };

      const handleFileDrop = (files) =>{ 
        const newImgs=[]
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
              newImgs.push({
                src: reader.result,
                desc: ''
              });
              // If all files are processed, update state
              if (newImgs.length === files.length) {
                setProjData(prevData => ({
                  ...prevData,
                  images: [...prevData.images, ...newImgs]
                }));
              }
            };
            reader.readAsDataURL(file);
          });
        };

        const processedFiles = new Set();
        const dragger_props = {
            multiple: true,
            showUploadList: false,
            beforeUpload(file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const newImgs = [{
                        src: reader.result,
                        desc: ''
                    }];
                    setProjData(prevData => ({
                        ...prevData,
                        images: [...prevData.images, ...newImgs]
                    }));
                };
                reader.readAsDataURL(file);
                return false; // Prevent default upload behavior
            },
            onDrop(e) {
                handleFileDrop(e);
            },
            onChange(e) {
                const files = e.fileList.map((fileWrapper) => fileWrapper.originFileObj).filter(Boolean); 
                const newImgs = [];
                const existingFileSrcs = projData.images.map(img => img.src);
        
                Array.from(files).forEach((file) => {
                    if (!processedFiles.has(file)) {
                        processedFiles.add(file);
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (!existingFileSrcs.includes(reader.result)) {
                                newImgs.push({
                                    src: reader.result,
                                    desc: '',
                                });
                            }
                            if (newImgs.length === files.length) {
                                setProjData((prevData) => ({
                                    ...prevData,
                                    images: [...prevData.images, ...newImgs],
                                }));
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        };
        

    const removeImg = (index) => {
        setProjData(prevData => {
          const newImages = [...prevData.images];
          newImages.splice(index, 1); // Remove the image at the specified index
          return { ...prevData, images: newImages };
        });
      };  

    const handleOpenAddTagModal = () =>{ 
        setAddTagOpen(true);
    }

    const handleAddTags = (updatedTags) => {
        if (projData) {
          setProjData({ ...projData, tags: updatedTags });
        }
        setAddTagOpen(false);
      };
 
    return (
        <div className='details-page'>
            {loading ? ( <Flex vertical style={{padding:"50px"}}><Spin className="spinner" size="large" /></Flex> ) : (<motion.div initial="initial"  variants={pageVariants} animate="in" exit="out" transition={pageTransition}>
            {loggedIn && 
            (
                <div style={{ textAlign: 'end', marginRight: '3rem' }}>
                    {!editMode ? (
                        <Button onClick={handleEditClick} className='blue-button'>Edit</Button>
                    ) : (
                        <Button onClick={handleSaveClick} className='blue-button'><Spin spinning={saveLoading} style={{marginRight: "10px"}}/>Save</Button>
                    )}
                </div>
            )}
            <Flex  gap={gap}>
                <motion.div exit={{x:"-100vw"}}><ArrowLeftOutlined className='back-arrow' onClick={handleGoBack}/> </motion.div>
            {projData && (
                <div style={{width: "90%"}} >
                    <Flex gap="large" style={{justifyContent: "space-between"}}>
                        <div className='proj-title'>
                        {editMode ? (
                                    <Input value={projData.name}
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
                    <div className='tags-section'>
                    {projData && (
                        <>
                        {editMode ? (
                            <div style={{display: "flex", flexWrap:"wrap", justifyContent: "center"}}>
                                <AddTagModal projData={projData} onSubmit={handleAddTags} loggedIn={loggedIn} open={addTagOpen} onCancel={() => setAddTagOpen(false)}/>
                                {
                                projData.tags ? (
                                    projData.tags.map((tag, index) =>(
                                        <TagCard key={tag.id} index={index} tagData={tag}/> 
                                    ))
                                ) : (
                                        <div> No tags Found</div>
                                    )}
                                <Button style={{alignSelf: "flex-start"}} onClick={handleOpenAddTagModal} className='blue-button'>Edit Tags</Button>
                            </div>
                            
                        ) : (
                            <>
                            {
                            projData.tags ? (
                                projData.tags.map((tag, index) =>(
                                    <TagCard key={tag.id} index={index} tagData={tag}/> 
                                ))
                            ) : (
                                    <div> No tags Found</div>
                                )}
                            </>
                        )}
                        </>
                        )}
                    </div>
                    <Divider style={{backgroundColor: "white", padding: "0", margin:"0"}} width="100%"/>
                    {!editMode ? (
                        <Carousel arrows autoplay autoplaySpeed={3000} style={{margin: "10px"}} >
                            {projData.images.map((image, index) => ( 
                                <div key={index} style={{justifyItems: "center", height: "fit-content"}}>
                                    <div style={{height: "400px", justifyContent: "centered", width: "auto" }}>
                                        <Image src={image.src} alt={`Slide ${index + 1}`} preview={{visible: false}} style={contentStyle} onClick={() => handleImageClick(index)}/>
                                    </div>
                                    <div style={descriptionStyle}>
                                        {image.desc}
                                    </div>
                                </div> 
                            ))}
                        </Carousel>): (
                            <>
                            <Flex style={{padding: "10px", flexWrap: "wrap"}}> 
                            
                            <Reorder.Group axis="x" values={editImages} onReorder={setEditImages} style={{display: "flex", flexWrap: "wrap", listStyle:"none"}}>
                            {editImages.map((image, index) => (
                            
                                <Reorder.Item key={image.id} value={image} style={{padding: "10px"}}>
                                    <div className="edit-img-container" onClick={() => setSelectedImageIndex(index)} style={{ border: selectedImageIndex === index ? '2px white blue' : 'none'}}>
                                        <img src={image.src} alt={`Slide ${index + 1}`} style={imgEditStyle} />
                                        <DeleteOutlined className="delete-icon" onClick={() => removeImg(index)}/>
                                    </div>
                                </Reorder.Item> 
                                
                            ))}</Reorder.Group>
                            
                            <Dragger {...dragger_props}  height="150px" style={{width: "200px", marginTop: "10px" }}> 
                                <p className="ant-upload-text" style={{color:"white" }}>Click or drag file/s to this area to upload</p>
                            </Dragger>
                            <input multiple type="file" ref={fileInputRef} className="file-input" onChange={handleFileChange}/>
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
                    
                    <Modal mask maskClosable closable open={previewOpen} onCancel={handleClosePreview} footer={null} width="90vw" height="100vh" className="custom-modal" centered
                    style={{margin: "auto", alignContent: "center"}}>
                        <Image.PreviewGroup items={projData.images} current={currentPreview}>
                            <Flex style={{justifyContent: "center"}}>
                                <div className="modal-content-wrapper" style={{position: "absolute", left: 0, transform: "translateX(-50%)", zIndex: 1,}}>
                                    <LeftOutlined className='preview-nav-button' onClick={handlePrev} disabled={currentPreview === 0} style={{fontSize: '40px', color: 'white'}}/>
                                </div> 
                                <div key={currentPreview} style={{width: "90vw", height: "94vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",}}>
                                        <TransformWrapper centerOnInit initialScale={1} style={{width: "90vw", height: "100vh", margin: "auto" }} >
                                            <TransformComponent wrapperStyle={{ width: "100%", height: "100%"}}>
                                                <Image className="modal-content-wrapper" src={projData.images[currentPreview].src} alt={`Slide ${currentPreview + 1}`} preview={false} style={contentStyle} margin= "auto" />
                                            </TransformComponent>
                                            <div className="modal-content-wrapper" style={{position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 1, }}>
                                                <Controls/>
                                            </div>
                                        </TransformWrapper>
                                </div>
                                <div className="modal-content-wrapper" style={{ position: "absolute", right: 0, transform: "translateX(50%)", zIndex: 1, }}>
                                    <RightOutlined className='preview-nav-button' onClick={handleNext} disabled={currentPreview === projData.images.length - 1} style={{fontSize: '40px', color: 'white'}}/>
                                </div>
                            </Flex>
                        </Image.PreviewGroup>
                    </Modal>
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
        </motion.div>
        )}
        </div>
    );
}

export default ProjDetails;