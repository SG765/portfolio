import '../cssfiles/tag.css';
import { useEffect, useState } from 'react'; 
import {Card, Select, Image, Button, AutoComplete, Switch, Divider, message, Popconfirm, Spin, Modal} from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import {geekblue, blue, cyan, gold, yellow, purple} from '@ant-design/colors';
import EditTagModal from './EditTagModal';
import { delete_tag } from '../controllers/Tag';
const { Meta } = Card;


function TagCard({index, tagData, dbTagData, selectMode, loggedIn, onDelete, onSubSelection, adminMode, bgColor, onTagUpdate}){ 
    const [subOptions, setSubOPtions]= useState([]);
    const [popDeleteOpen, setPopDeleteOpen]= useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect( () => {
        if(dbTagData && dbTagData.subtitles && dbTagData.subtitles.length > 0){
            handleSubtitleSelectionDisplay(dbTagData);}
    }, [dbTagData])

    const handleSubtitleSelectionDisplay = (selectedTag) =>{
        const subtitleOpts= [];
        for(let i=0; i < selectedTag.subtitles.length; i++){
            subtitleOpts.push({
                label: selectedTag.subtitles[i],
                value: selectedTag.subtitles[i]
            });
        } 
        setSubOPtions(subtitleOpts); 
    }

    const handleSubtitleSelection = (sub) =>{
        onSubSelection(dbTagData.name, sub);
    }

    const handleDelete = () =>{ 
        //for deleting from projects
        onDelete(tagData)
    }

    const showPopconfirm = () => {
        setPopDeleteOpen(true);
      };
     
      const handleDeleteCancel = () => {
        setPopDeleteOpen(false);
      };

    const handleDBDelete = async(e) =>{ 
        //for deleting from database
        e.stopPropagation();
        setConfirmLoading(true);
        const id=tagData.id

        const response= await delete_tag(tagData.id)
        if (response){
            onDelete(id)
        }

        setTimeout(() => { 
        setConfirmLoading(false);
        }, 2000);

        message.success(response.body)
    }
    
      const handleEditClick = () => {
        setIsEditModalOpen(true)
      };

    return(
        <div className="tag-card" style={{ backgroundColor: bgColor }}> 
            {selectMode && dbTagData ? (
                <>
                    <div className='tag-edit'><img width="25" height= "20"  src={tagData.icon}/> {tagData.name} <Button className="remove-x" onClick={handleDelete}>x</Button></div>
                    {dbTagData.subtitles && dbTagData.subtitles.length > 0 && (
                    <div>
                        <Select style={{width: "30vw"}} allowClear mode="multiple" options={subOptions} value={tagData.subtitles} onChange={handleSubtitleSelection}></Select>
                    </div>)}
                </>

            ) 
            
            : ( <div style={{justifyContent: "center"}}>
                    <span style={{justifyContent: "center", display: "flex", flexWrap: "nowrap"}}>
                        <img width="22" height= "22"  src={tagData.icon}/> 
                        <div className='tag-name' style={{alignSelf: "center", marginLeft: "5px"}}>{tagData.name}</div>
                    </span>
                    { tagData.subtitles && tagData.subtitles.length > 0 && (
                    <div className='tag-sub' style= {{padding: "1px 5px", opacity: "0.7"}}>
                        {tagData.subtitles && tagData.subtitles.join(', ')}
                    </div>
                )}
                {adminMode && (

                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', width: "100px" }}>
                    <EditOutlined className='card-actions-button' onClick={handleEditClick} style={{margin: "5px"}}/>
                    <Popconfirm overlayStyle={{width: "250px"}} title="Delete Tag" description="Are you sure you want to delete this tag? It will be removed from all projects." okType="danger" okText="Delete" icon={<DeleteOutlined/>}
                    open={popDeleteOpen} onConfirm={handleDBDelete} onCancel={handleDeleteCancel}>
                        <DeleteOutlined style={{color: "red"}} className='card-actions-button' onClick={() => showPopconfirm(tagData.id)}/>
                    </Popconfirm>
                    <EditTagModal tagData={tagData} open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} onUpdate={onTagUpdate}/>
                    </div>
                )}
                </div>
            )} 
        </div>
    )
} 

export default TagCard;
