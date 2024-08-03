import React, { useState } from 'react';
import { Button, Modal, Input, Spin, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const URLModal = ({ open, onCancel, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [urls, setUrls] = useState(['']);

    const handleAddUrl = () => {
        setUrls([...urls, '']);
    };

    const handleUrlChange = (value, index) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAdd(urls);
            setUrls(['']);
            message.success('Images added successfully');
            onCancel();
        } catch (error) {
            message.error('Failed to add images');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add Images Via URL"
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    <Spin spinning={loading} style={{ marginRight: "10px" }} />
                    Submit
                </Button>
            ]}
        >
            <Form layout="horizontal">
                {urls.map((url, index) => (
                    <Form.Item key={index} label={`URL ${index + 1}`}>
                        <Input
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value, index)}
                            placeholder='Paste URL here'
                        />
                    </Form.Item>
                ))}
                <Button type="dashed" onClick={handleAddUrl} style={{ width: '100%' }}>
                    <PlusOutlined /> Add new URL
                </Button>
            </Form>
        </Modal>
    );
};

export default URLModal;
