import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal, Input, DatePicker, Upload, message, Spin } from 'antd';
import { Quill, toolbarOptions } from '../quill'; // Import the customized Quill setup
import 'quill/dist/quill.snow.css'; // Import Quill stylesheet
import { create_project } from '../controllers/Project';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AddProjectModal = ({ open, onCancel, projData, mode, onAdd, email }) => {
  const [form] = Form.useForm();
  const [desc, setDescription] = useState('');
  const editorRef = useRef(null);
  const quillInitializedRef= useRef(false);
  const quillRef = useRef(null)
  const [coverImg, setImage]= useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!quillInitializedRef.current && open) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions, 
          imageHandler: {
            upload: file => {
              // return a Promise that resolves in a link to the uploaded image
              return new Promise((resolve, reject) => {
                ajax().then(data => resolve(data.imageUrl));
              });
            }
          },
          attachmentHandler: {
            upload: file => {
              // return a Promise that resolves in a link to the uploaded image
              return new Promise((resolve, reject) => {
                ajax().then(data => resolve(data.attachmentUrl));
              });
            }
          }
        }
      });

      quillInitializedRef.current = true;
    }
 
  }, [open]);

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
    const quillContent = editorRef.current.querySelector('.ql-editor').innerHTML;
    setLoading(true)
    const success= await create_project(values.name, values.shortDesc, quillContent, values.start.year(), values.end.year(), values.repo, values.deploy, coverImg, email)
    if(success.status === 200){  
        message.success(success.body)
        setLoading(false)
        onAdd();
    }else{
      message.error(success.body)
      setLoading(false)
    }
    onCancel();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
 

  return (
    <Modal title="Add New Project" open={open} onCancel={onCancel} footer={[
      <Button key="cancel" onClick={onCancel}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={handleOk}>
        <Spin spinning={loading} style={{marginRight: "5px"}}></Spin>Submit
      </Button>
    ]}>

      <Form form={form} onFinish={onFinish}>
        <Form.Item label="Project Name" name="name" rules={[{ required: true, message: 'Please enter project name!' }]}>
          <Input placeholder="Enter Project Name" />
        </Form.Item>
        <Form.Item label="Cover Image" name="cover">
          <input type="file" accept="image/*" onChange={handleFileInputChange} />
        </Form.Item>
        <Form.Item label="Short Description" name="shortDesc" >
          <Input placeholder="Enter Short Description" />
        </Form.Item>
        <Form.Item label="Description" name="desc" >
          <div id="editor" ref={editorRef}></div>
        </Form.Item>
        <Form.Item label="Start Date" name="start" rules={[{ required: true, message: 'Please select start date!' }]}>
          <DatePicker picker="year"/>
        </Form.Item>
        <Form.Item label="End Date" name="end" rules={[{ required: true, message: 'Please select end date!' }]}>
          <DatePicker picker='year'/>
        </Form.Item>
        <Form.Item label="Repository" name="repo">
          <Input placeholder="Enter repo link" />
        </Form.Item>
        <Form.Item label="Deployed Link" name="deploy">
          <Input placeholder="Enter deploy link" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
