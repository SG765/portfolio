import '../cssfiles/projects.css'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { get_proj_by_name } from '../controllers/Project';
import {ArrowLeftOutlined} from '@ant-design/icons'
import { Divider, Flex, Carousel } from 'antd';
import DOMPurify from 'dompurify';

function ProjDetails(){
    const params= useParams();
    const [projData, setProjData] = useState(null);
    const [desc, setDescription] = useState(null)
    const startDate = projData ? projData.startDate.toDate() : null;
    const endDate = projData ? projData.endDate.toDate() : null;


    useEffect(() => {

        async function fetchData(){
            const response= await get_proj_by_name(params.name);
            setProjData(response.body[0])
            const sanitizedHTML = DOMPurify.sanitize(projData.desc);
            setDescription(sanitizedHTML)
        }
        fetchData();
    }, []);

    const contentStyle = {
        height: '360px',
        color: '#fff',
        lineHeight: '360px',
        textAlign: 'center',
        background: '#364d79',
        margin: "5px",
      };

    return (
        <div className='details-page' style= {{width:"80vw"}}>
            <Flex  gap="large">
            <div><ArrowLeftOutlined className='back-arrow'/> </div>
            {projData && (
                <div style={{width: "90%"}} >
                <div>
                    <div>{projData.name}</div>
                    Duration: {startDate && (startDate.toLocaleDateString('en-UK', {
                         month: 'long', day: 'numeric'
                        }))} -  {endDate && (endDate.toLocaleDateString('en-UK', {
                            year: 'numeric', month: 'long', day: 'numeric'
                           }))}
                </div>
                <Divider style={{backgroundColor: "white"}} width="100%" margin="0" padding="0"/>
                
                <Carousel autoplay>
                <div>
                <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                <h3 style={contentStyle}>4</h3>
                </div>
                </Carousel>

                <div dangerouslySetInnerHTML={{ __html: desc }} />

                </div>
            )}
            </Flex>
        </div>
    );
}

export default ProjDetails;