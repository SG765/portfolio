import '../cssfiles/projects.css';
import DOMPurify from 'dompurify';
import { useEffect, useState, useRef } from 'react';
import TagCard from './TagCard';
import { useNavigate } from 'react-router-dom';
import { delete_project, toggle_show_project } from '../controllers/Project';
import {Card, Image, Flex, Button, AutoComplete, Switch, Divider, message, Popconfirm, Spin} from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import {geekblue, blue, cyan, gold, yellow, purple} from '@ant-design/colors';
import EditProjectModal from './EditProjectModal';
const { Meta } = Card;


function ProjectCard({index, projData, loggedIn, onDelete}){   
  const [showStatus, setShowStatus] = useState(projData.shown);
  const [openEditModal, setOpenEditModal]= useState(false); 
  const [coverImg, setCoverImg] = useState(projData.cover);
  const [name, setName] = useState(projData.name)
  const [shortDesc, setShortDesc] = useState(projData.shortDesc)
  const navigate= useNavigate();
  const [popDeleteOpen, setPopDeleteOpen] = useState(false); 
  const [showAllTags, setShowAllTags] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    // Check authentication status and update loggedIn state
    const authToken = localStorage.getItem('authToken');
    loggedIn= !!authToken;
  }, []);


  const toggleTagsVisibility = (e) => {
    e.stopPropagation()
    setShowAllTags(!showAllTags);
  };

  const onChangeShow = async(checked) => {

    setShowStatus(checked);
    const response= await toggle_show_project(projData.id)
    message.info(response.body)
  };

  const handleEditClick = (e) =>{
    e.stopPropagation();
    setOpenEditModal(true)
  }

  const navToDetails = (e) =>{ 
    navigate(`/projects/${name}`)
  }

  const handleUpdate = (newCoverImg, newName, newDesc) => {
    setCoverImg(newCoverImg); // Update cover image state
    setName(newName);
    setShortDesc(newDesc)
  };

  const handleDelete = async (e) =>{
    e.stopPropagation();
    setConfirmLoading(true);
    const id=projData.id

    const response= await delete_project(projData.id)
    if (response){
      onDelete(id)
    }

    setTimeout(() => { 
      setConfirmLoading(false);
    }, 2000);

    message.success(response.body)
  }

  const showPopconfirm = () => {
    setPopDeleteOpen(true);
  };
 
  const handleDeleteCancel = () => {
    setPopDeleteOpen(false);
  };
 

  let actionOptions=[];

  if(!loggedIn){
    const displayedTags = projData.tags.slice(0, 4); // Show only first 4 tags
    const hiddenTags = projData.tags.slice(4); // Remaining tags

    actionOptions = [
      <Flex wrap>
        <div className="tag-container">
          {displayedTags.map((tag) => (
            <TagCard key={tag.id} tagData={tag} />
          ))}
          {hiddenTags.length > 0 && !showAllTags && ( 
              <DownOutlined className="arrow-button" onClick={(e) => toggleTagsVisibility(e)}/>  
          )}
          {hiddenTags.length > 0 && showAllTags && (
            <>
              {hiddenTags.map((tag) => (
                <TagCard key={tag.id} tagData={tag} />
              ))} 
                <UpOutlined className="arrow-button" onClick={(e) => toggleTagsVisibility(e)}/>  
            </>
          )}
        </div>
      </Flex>
      ];

  }else{
    actionOptions=[
      <>
      <div onClick={(e)=> e.stopPropagation()} style={{display: "flex", justifyContent: "center", fontWeight: "bold"}}>
        Display: <Switch  checked={showStatus} onChange={onChangeShow} className={`display-switch  ${showStatus ? 'on' : 'off'}`}/>
      <Divider type="vertical"/>
      <EditOutlined  className='card-actions-button' key="edit" onClick={handleEditClick}/>
      <Divider type="vertical"/>
      <Popconfirm title="Delete Project" description="Please confirm deletion" okType="danger" okText="Delete" icon={<DeleteOutlined/>}
      open={popDeleteOpen} onConfirm={handleDelete} onCancel={handleDeleteCancel}>
        <DeleteOutlined className='card-actions-button' onClick={() => showPopconfirm(projData.id)}/>
      </Popconfirm>
      </div>
      </>
    ];
  }

    return(
        <>
            <Card className='card' hoverable onClick={navToDetails}>
              <div className='card-content'>
                <Image height={200} preview={false} src={coverImg} fallback="" className='card-image'/>
                <div className='card-title'>{name}</div>

                <div className='card-overlay'>
                  <p className='overlay-text'>{shortDesc}</p>
                </div>
              </div>
              <div className='card-actions'>
                {actionOptions}
              </div>
            </Card>
            <EditProjectModal key={projData.id} open={openEditModal} onCancel={() => setOpenEditModal(false)} projData={projData} mode="edit" onUpdate={handleUpdate} />
        </>
    )
}

export default ProjectCard;