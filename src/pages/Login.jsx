import '../cssfiles/login.css'
import {Form, Checkbox, Input, Button, message, Popover} from 'antd'
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword, signOut, onAuthStateChanged  } from "firebase/auth";
import { auth, db } from '../firebase'
import {useNavigate} from 'react-router-dom'
import {QuestionCircleOutlined } from '@ant-design/icons'

function Login(){
    const navigate= useNavigate();

    const onFinish = async (values) => {
        try {
            // Sign in the user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            if(userCredential){
                const user = userCredential.user;
        
                // Get the authentication token for the user nd save to local storage
                const authToken = await user.getIdToken();
                console.log(user, authToken)

                if(authToken){
                    localStorage.setItem('authToken', authToken); 
                    navigate('/projects')
                    message.success('Logged in successfully');
                }
            }else{
                message.error('Incorrect username and password');
            }
        } catch (error) { 
            message.error('Incorrect username and password');

            throw error;
        }
      };

    const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    };

    const help = (
        <p>
            Login allows me to edit the site content from the UI so that changes need not be coded in.
        </p>
    )


    return (
        <div className='login-page'> 
            <div>Login
            <Popover content={help} title="What is login for?" trigger="click">
                <QuestionCircleOutlined style={{color:'aqua', margin:'5px'}} className="help-icon"/>
            </Popover>
            
            
            </div>
            <Form className='form' name="basic" labelCol={{span: 6,}} wrapperCol={{ span: 16,}} style={{ maxWidth: 600, }} 
            initialValues={{ remember: true,}} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                <Form.Item className="form-item" label="Email" name="email">
                    <Input />
                </Form.Item>

                <Form.Item className="form-item" label="Password" name="password">
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 1, span: 16, }} >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16,}} >
                    <Button type="primary" htmlType="submit">  Submit  </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;