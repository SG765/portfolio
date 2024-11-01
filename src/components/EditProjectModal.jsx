import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Button, Form, Modal, Input, DatePicker, Upload, Flex, message, Spin} from 'antd'; 
import { create_project, update_project } from '../controllers/Project';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const EditProjectModal = ({ open, onCancel, projData, mode, onUpdate }) => { 
  const [form] = Form.useForm();
  const [shortDesc, setShort] = useState( '');
  const [name, setName] =useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [coverImg, setImage]= useState(null)
  const [selectedImageIndex, setSelectedImageIndex]= useState(0);
  const [loading, setLoading]= useState(false)

  useEffect(() => {
    if (projData) {
      form.setFieldsValue({
        name: projData.name || '',
        shortDesc: projData.shortDesc || '',
        start: projData.startDate ? dayjs(`${projData.startDate}`, 'YYYY') : null,
        end: projData.endDate ? dayjs(`${projData.endDate}`, 'YYYY') : null,
      });
      setImage(projData.cover || null);
    }

  }, [projData, form])
 
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
    const updatedShortDesc = values.shortDesc || shortDesc; 
    const updatedStartDate = values.start ? values.start.year() : startDate;
    const updatedEndDate = values.end ? values.end.year() : endDate; 
    console.log( updatedName, updatedEndDate, updatedShortDesc, updatedStartDate, projData.desc)
    const success= await update_project(projData.id, updatedName, updatedShortDesc, projData.desc, updatedStartDate, updatedEndDate, projData.repo, projData.deploy, coverImg, projData.images, projData.tags, projData.shown)
    if (success) {
      onUpdate(coverImg, updatedName, updatedShortDesc); // Call callback to update cover image

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

  const selectImage = (index) => {
    setSelectedImageIndex(index);
    const image = projData.images[index];
    setImage(image.src); 
  };

  return (
    <Modal title="Edit Project" open={open} onCancel={onCancel} footer={[
      <Button key="cancel" onClick={onCancel}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={handleOk}><Spin spinning={loading} style={{marginRight: "10px"}}/>
        Submit
      </Button>
    ]}>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Project Name" name="name" rules={[{ required: true, message: 'Please enter project name!' }]}>
          <Input placeholder="Enter Project Name" value={name} />
        </Form.Item> 

          {projData && (
           <>Cover Image: 
            <Flex style={{overflowX: "scroll", margin: "10px"}} >
            {projData.images.map((image, index) => (
            <div key={index} style={{padding: "3px"}}>
                <div className="edit-img-container" onClick={() => selectImage(index)}
                  style={{ /*Conditionally set the border if image is selected */
                    border: selectedImageIndex === index ? '2px solid blue' : 'none',
                    cursor: 'pointer',
                    maxWidth: "100px",
                  }}>
                    <img src={image.src} alt={`Img ${index + 1}`}  style={imgEditStyle} />
                </div>
            </div> 
                            
          ))}
          </Flex>
          </>)}
        
        <Form.Item layout="vertical" label="Short Description" name="shortDesc" rules={[{ required: true, message: 'Please enter description!' }]}>
          <TextArea placeholder="Enter Short Description" value={shortDesc}/>
        </Form.Item>
        <Flex style={{justifyContent: "space-between"}}>
        <Form.Item label="Start Date" name="start" rules={[{ required: true, message: 'Please select start date!' }]}>
          <DatePicker picker='year' value={form.getFieldValue('start') ? dayjs(form.getFieldValue('start')) : null} />
        </Form.Item>
        <Form.Item label="End Date" name="end" style={{marginRight: "50px"}} rules={[{ required: true, message: 'Please select end date!' }]}>
          <DatePicker picker='year' value={form.getFieldValue('end') ? dayjs(form.getFieldValue('end')) : null} />
        </Form.Item> </Flex>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
