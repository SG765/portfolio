import '../cssfiles/tag.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { delete_project, toggle_show_project } from '../controllers/Project';
import {Card, Select, Image, Button, AutoComplete, Switch, Divider, message, Popconfirm, Spin, Modal} from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import {geekblue, blue, cyan, gold, yellow, purple} from '@ant-design/colors';
import EditProjectModal from './EditProjectModal';
const { Meta } = Card;


function TagCard({index, tagData, dbTagData, selectMode, loggedIn, onDelete, onSubSelection}){ 
    const [subOptions, setSubOPtions]= useState([]);

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
        onDelete(tagData)
    }

    return(
        <div className="tag-card" style={{width: "fit-content", height: "fit-content"}}> 
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
                        <div style={{alignSelf: "center", marginLeft: "5px"}}>{tagData.name}</div>
                    </span>
                    { tagData.subtitles && tagData.subtitles.length > 0 && (
                    <div style= {{fontSize: "12px", padding: "1px 5px", opacity: "0.7"}}>
                        {tagData.subtitles && tagData.subtitles.join(', ')}
                    </div>)}
                </div>
            )} 
        </div>
    )
} 

export default TagCard;
