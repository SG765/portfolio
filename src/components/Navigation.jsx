import {Menu, message} from 'antd';
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import '../cssfiles/nav.css'
import { genNoticeStyle } from 'antd/es/notification/style';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'


function Navigation({loggedIn}){ 

    useEffect(() => {
      // Check authentication status and update loggedIn state
      const authToken = localStorage.getItem('authToken'); 
      loggedIn= !!authToken;
    }, []);

    const navigate= useNavigate();

    const navItems = [
        {
          label: 'Projects',
          key: 'projects',
          icon: '',
        }, 
        {
            label: 'About',
            key: 'about',
            icon: '',
        },
        {
            label: loggedIn ? 'Logout' : 'Login',
            key: loggedIn ? 'logout' : 'login',
            icon: '', 
            isHidden: true,
            color: 'white',
        }
    ]

    const [current, setCurrent] = useState('projects');

    const onClick = (e) => {
      const { key } = e;
      if (key === 'logout') {
        // Handle logout
          try{
            signOut (auth);
            //clear auth token
            localStorage.removeItem('authToken');
            navigate("/");
            message.success('Logged out successfully');
        } catch (error){
            console.error('logout failed', error);
        }
      } else {
        setCurrent(key);
        navigate("/" + key);
      }
    };

    return (
        <div className='nav-container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
            <Menu className='nav' onClick={onClick} selectedKeys={[current]} mode='horizontal'>
        {navItems.map((item) =>
          item.isHidden ? ( 
              <Menu.Item key={item.key}  style={{backgroundColor: '#23599c'}}>{item.label}</Menu.Item> 
          ) : (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          )
        )}
      </Menu>

        </div>
    );
}

export default Navigation;