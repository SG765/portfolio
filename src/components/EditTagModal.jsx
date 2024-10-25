import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Button, Form, Modal, Input, DatePicker, Upload, Flex, message, Spin} from 'antd'; 
import { update_tag } from '../controllers/Tag';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const EditTagModal = ({ open, onCancel, tagData, mode, onUpdate }) => { 
  const [form] = Form.useForm();
  const [shortDesc, setShort] = useState( '');
  const [name, setName] =useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [coverImg, setImage]= useState(null)
  const [selectedImageIndex, setSelectedImageIndex]= useState(0);
  const [loading, setLoading]= useState(false)

  useEffect(() => {
    if (tagData) {
      form.setFieldsValue({
        name: tagData.name || '',
        icon: tagData.icon || '',
      });
    }

  }, [tagData, form])
 
  const handleOk = () => {
    form.validateFields().then(values => {
      // If form validation succeeds
    form.submit(); }).catch(errorInfo => {
      // If form validation fails
      console.log('Form validation failed:', errorInfo);
    });
  
  };

  // Function to handle form submission
  const onFinish = async(values) => {   
    setLoading(true)
    const updatedName = values.name || name;
    const updatedIcon = values.icon || icon;

    const success= await update_tag(tagData.id, updatedName, updatedIcon)
    if (success) {
      onUpdate(updatedName, updatedIcon); // Call callback to update on tag page
    }
    
    setLoading(false)
    message.success(success.body)
    onCancel();
  };

  const imgEditStyle = {
    height: '95px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79', 
    justifyContent: "center",
  };

  return (
    <Modal title="Edit Tag" open={open} onCancel={onCancel} footer={[
      <Button key="cancel" onClick={onCancel}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={handleOk}><Spin spinning={loading} style={{marginRight: "10px"}}/>
        Save
      </Button>
    ]}>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Tag Name" name="name" rules={[{ required: true, message: 'Please enter Tag name!' }]}>
          <Input placeholder="Enter Tag Name" value={name} />
        </Form.Item> 
        
        <Form.Item layout="vertical" label="Icon Url" name="icon" rules={[{ required: true, message: 'Please icon url!' }]}>
          <TextArea placeholder="Enter icon URL" value={shortDesc}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTagModal;
