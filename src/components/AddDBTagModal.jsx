import '../cssfiles/tag.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {Card, Image, Button, Divider, Select, Flex, message, Spin, Modal, Form, Input, AutoComplete} from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import {geekblue, blue, cyan, gold, yellow, purple} from '@ant-design/colors';  
import { create_tag, get_all_tags } from '../controllers/Tag';

function AddTagModal({projData, loggedIn, open, onCancel, onAdd}){ 
    const [loading, setLoading] = useState(false)  
    const [addloading, setAddloading]= useState(false) 
    const [tagList, setTags]= useState([])
    const [form] = Form.useForm();
    const [options, setOptions]= useState([])

    const fetchTags = async () => {
        let data;

        setLoading(true)
        data= await get_all_tags()

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

    const handleCreateTag = async(values) =>{
        setAddloading(true)
        const response= await create_tag(values.name, values.icon)
        if(response.status === 200){  
            message.success(response.body)
            setAddloading(false)
            onAdd()

        }
        if(response.status === 400){  
            message.error(response.body)
            setAddloading(false)
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

    

    return(
        <Modal open={open} onCancel={onCancel} width= "60vw" title={`Add new Tag`}
        footer={[
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmitTagForm}>
              <Spin spinning={addloading} style={{marginRight: "5px"}}></Spin> Add Tags
            </Button>,
          ]}
        >
            <Flex style={{margin: "10px", maxWidth: "90%"}}>
                <div style={{width: "20%", textAlign: "right", marginRight: "20px"}}>Search Existing Tags: </div>
            <AutoComplete options={options} style={{width:"100%", textAlign: "left", }} onSearch={handleSearch} placeholder="Enter tag to search">
                <Input.Search enterButton style={{width:"50%"}}/>
            </AutoComplete>
            </Flex>


            <div style={{marginTop: "40px", fontWeight: "bold", fontSize: "16px"}}>Add tag here: </div>
            <Form form={form} onFinish={handleCreateTag}>
                <Form.Item label="Name:" name="name">
                    <Input ></Input>
                </Form.Item>
                <Form.Item label="Icon URL:" name="icon">
                    <Input></Input>
                </Form.Item>
            </Form>
        </Modal>
    )
}
 
export default AddTagModal;