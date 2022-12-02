import React from 'react'
import styled from 'styled-components'
import { IoIosArrowBack } from "react-icons/io";
import { Avatar, Typography, Row, Col } from 'antd';
import { RiGroupLine } from "react-icons/ri";
import { MdOutlineDateRange } from "react-icons/md";
import ProfileInfo from './ProfileInfo';
import Popup from "reactjs-popup";

const HeaderStyled = styled.div`
    width: 100%;
    height: 300px;
    background: linear-gradient(to bottom,  rgb(83, 244, 172),  rgb(75, 233, 247),rgb(110, 173, 255));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .avatar {
       width: 40px;
       height: 40px;
       margin-bottom: 10px;
    }
    .ic-back {
        transform: translateX(-175px) translateY(-30px);
        color: white;
        font-weight: bold;

    }
    .edit {
        transform: translateX(175px) translateY(-30px);
        color: white;
        font-weight: bold;
    }
    .title {
        font-size: 15px;
    }
    .row {
        color: white;
        .qtt {
            color: white;
        }
      
    }
    
`;



export default function Profile() {
    return (<>
                <HeaderStyled>
                    <Row >
                            <IoIosArrowBack className='ic-back' />
                            <Typography.Text className='edit'>Edit</Typography.Text>    
                    </Row>

                    <Row>
                        <Avatar src={null} className='avatar'>DUNG</Avatar>
                    </Row>
                    <Row>
                        <Typography.Title className='title'>Name</Typography.Title>
                    </Row>
                    <Row className='row contain'>
                      <Col span={10}>
                            <RiGroupLine />
                            <Typography.Paragraph className='qtt'>300</Typography.Paragraph>
                            <Typography.Paragraph className='p'>Hello bro</Typography.Paragraph>
                        </Col>
                        <Col span={10}>
                            <MdOutlineDateRange />
                            <Typography.Paragraph className='qtt'>300</Typography.Paragraph>
                            <Typography.Paragraph className='p'>Hello bro</Typography.Paragraph>
                        </Col>
                    </Row>
                </HeaderStyled>
                    <ProfileInfo sex="Felmate" date="dd/mm/yyyy" telephone="0328038817"
                        liveAt="HCM City" studyAt="Highschool DXD" workAt="Industrial University" />
                        </>
    )
}
