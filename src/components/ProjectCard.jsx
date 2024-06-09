import '../cssfiles/projects.css';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggle_show_project } from '../controllers/Project';
import {Card, Image, Button, AutoComplete, Switch, Divider, message} from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import {geekblue, blue, cyan, gold, yellow, purple} from '@ant-design/colors';
import EditProjectModal from './EditProjectModal';
const { Meta } = Card;


function ProjectCard({projData, loggedIn}){ 
  const [showStatus, setShowStatus] = useState(projData.shown);
  const [openEditModal, setOpenEditModal]= useState(false);

  const navigate= useNavigate();

  useEffect(() => {
    // Check authentication status and update loggedIn state
    const authToken = localStorage.getItem('authToken');
    loggedIn= !!authToken;
  }, []);

  
  const onChangeShow = async(checked) => {
    setShowStatus(checked);
    const response= await toggle_show_project(projData.id)
    message.info(response.body)
  };

  const handleEditClick = () =>{
    setOpenEditModal(true)
  }

  const navToDetails = () =>{
    navigate(`/projects/${projData.name}`)
  }

  let actionOptions=[];

  if(!loggedIn){
    actionOptions=[
      <>
      <Button type="primary" onClick={navToDetails}>View Details</Button>
      </>
    ]
  }else{
    actionOptions=[
      <>
      Show: <Switch  checked={showStatus} onChange={onChangeShow} />
      <Button type="primary" style={{marginLeft:20, marginRight:10}} onClick={navToDetails}>View Details</Button>
      <Divider type="vertical"/>
      <EditOutlined style={{fontSize:24, marginLeft:10, marginRight:10}} key="edit" onClick={handleEditClick} />
      <Divider type="vertical"/>
      <DeleteOutlined style={{fontSize:24, marginLeft:10, marginRight:20}}/>
      </>
    ];
  }

    return(
        <>
            <Card className='card' hoverable>
              <div className='card-content'>
                <Image height={200} width={'100%'} preview={false} src={projData.cover} fallback="" />
                <div className='card-title'>{projData.name}</div>

                <div className='card-overlay'>
                  <p className='overlay-text'>{projData.shortDesc}</p>
                </div>
              </div>
              <div className='card-actions'>
                {actionOptions}
              </div>
            </Card>
            <EditProjectModal open={openEditModal} onCancel={() => setOpenEditModal(false)} projData={projData} mode="edit" />
        </>
    )
}

export default ProjectCard;