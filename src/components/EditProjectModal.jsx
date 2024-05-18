import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal, Input, DatePicker } from 'antd';
import Quill from '../quill'; // Import the customized Quill setup
import 'quill/dist/quill.snow.css'; // Import Quill stylesheet
import { create_project } from '../controllers/Project';

const { TextArea } = Input;

const EditProjectModal = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [desc, setDescription] = useState('');
  const editorRef = useRef(null);
  const quillInitializedRef= useRef(false);
  const quillRef = useRef(null)

  useEffect(() => {
    if (!quillInitializedRef.current && open) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }, { 'align': [] }], 
            [{ 'color': [] }, { 'background': [] }, "bold","italic", "underline", "strike"], 
            ["link", "image", "video"]], 
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
    console.log('Quill content:', quillContent);
    console.log('Form values:', values);
    const success= await create_project(values.name, quillContent, values.start, values.end, values.repo, values.deploy)
    onCancel();
  };

  return (
    <Modal title="Add New Project" open={open} onCancel={onCancel} footer={[
      <Button key="cancel" onClick={onCancel}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={handleOk}>
        Submit
      </Button>
    ]}>

      <Form form={form} onFinish={onFinish}>
        <Form.Item label="Project Name" name="name" rules={[{ required: true, message: 'Please enter project name!' }]}>
          <Input placeholder="Enter Project Name" />
        </Form.Item>
        <Form.Item label="Description" name="desc" >
          <div id="editor" ref={editorRef}></div>
        </Form.Item>
        <Form.Item label="Start Date" name="start" rules={[{ required: true, message: 'Please select start date!' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="End Date" name="end" rules={[{ required: true, message: 'Please select end date!' }]}>
          <DatePicker />
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

export default EditProjectModal;
