import '../cssfiles/tag.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {Card, Image, Button, Divider, message, Spin, Modal, Form, Input, AutoComplete} from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import {geekblue, blue, cyan, gold, yellow, purple} from '@ant-design/colors';  
import { create_tag, get_all_tags } from '../controllers/Tag';
import TagCard from './TagCard';

function AddTagModal({projData, loggedIn, open, onCancel, onSubmit}){
    const [tagList, setTags] = useState([])
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState([])
    const [additionalTags, setAdditionalTags] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [form] = Form.useForm();

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
        fetchTags();
    },[]);

    const searchResult = (query) => {
        const results=  tagList.filter((item) =>{
            return item.name.toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
        })  

        // Create a list of label elements for each result
        const resultLabels = results.map((item, idx) => ({
            value: item.name,
            label: (<div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><img width="25" height= "20"  src={item.icon}/> {item.name}</span>
            </div>),
        }));

        return resultLabels
    }

    const handleSearch = (value ) =>{ 
        setOptions(value ? searchResult(value) : []) 
    };

    const handleSelect = (value) => {
        // Find the selected tag from the tagList
        const selectedTag = tagList.find(tag => tag.name === value);
    
        if (selectedTag) {
            // Check if the tag is already in the additionalTags array
            const isAlreadySelected = additionalTags.some(tag => tag.name === selectedTag.name);
    
            if (!isAlreadySelected) {
                setAdditionalTags(prevTags => [...prevTags, selectedTag]);
            } else {
                message.info('Tag already selected');
            }
        }
    };

    const handleCreateTag = async(values) =>{
        setLoading(true)
        const response= await create_tag(values.name, values.icon)
        if(response.status === 200){  
            message.success(success.body)
            setLoading(false)
        }
        if(response.status === 400){  
            message.error(success.body)
            setLoading(false)
        }  
    }

    const handleSubmitTagForm = () =>{
        form.validateFields().then(values => {
            // If form validation succeeds
          form.submit(); }).catch(errorInfo => {
            // If form validation fails
            console.log('Form validation failed:', errorInfo);
          });
    }

    const handleOk = () =>{
        onSubmit(additionalTags)
    }

    return(
        <Modal open={open} onCancel={onCancel} height="100px" title={`Add Tag to ${projData.name}`}
        footer={[
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              Add Tags
            </Button>,
          ]}
        >

            <AutoComplete options={options} onSelect={handleSelect} onSearch={handleSearch} placeholder="Enter Name to search tag">
                <Input.Search enterButton />
            </AutoComplete>

            <div>
                Selected Tags:
                {additionalTags.length > 0 ? (additionalTags.map((tag, index)=>(
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
                        <TagCard  key={index} tagData={tag} ></TagCard>
                    </div>
                ))) : ( <div>No Tags selected</div>)}
            </div>

            <div style={{marginTop: "40px"}}>Need a new tag? Add it here: </div>
            <Form form={form} onFinish={handleCreateTag}>
                <Form.Item label="Name:" name="name">
                    <Input ></Input>
                </Form.Item>
                <Form.Item label="Icon URL:" name="icon">
                    <Input></Input>
                </Form.Item>
                <Button key="submit" type="primary" onClick={handleSubmitTagForm}>
                    <Spin spinning={loading} style={{marginRight: "5px"}}></Spin>Add
                </Button>
            </Form>
        </Modal>
    )
}
 
export default AddTagModal;