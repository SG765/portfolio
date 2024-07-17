import '../cssfiles/tag.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { delete_project, toggle_show_project } from '../controllers/Project';
import {Card, Image, Button, AutoComplete, Switch, Divider, message, Popconfirm, Spin, Modal} from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import {geekblue, blue, cyan, gold, yellow, purple} from '@ant-design/colors';
import EditProjectModal from './EditProjectModal';
const { Meta } = Card;


function TagCard({index, tagData, loggedIn, onDelete}){ 

    return(
        <div className="tag-card" style={{width: "fit-content", height: "fit-content"}}> 
            <span><img width="25" height= "20"  src={tagData.icon}/> {tagData.name}</span> 
        </div>
    )
} 

export default TagCard;
