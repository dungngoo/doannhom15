import { Avatar, Typography } from 'antd'
import React from 'react'
import styled from 'styled-components';


const WrapperStyled = styled.div`

  .avatar {
    margin: 10px;
    margin-top: 20px;
    padding: 20px;
    width: 50px;
    height: 50px;
  }
 .author {
    font-size: 15px;
    font-weight: bold;
 }

 .content {
    transform: translateY(-30px);
    margin-left: 70px;
    font-size: 11px;

 }
`;

export default function DescriptionSideBar({ text, photoURL, username, status }) {
  return (
    <WrapperStyled>
      <Avatar className='avatar' src={photoURL} />
      <Typography.Text className='author'>{username}</Typography.Text>
      <Typography.Paragraph className='content'>{text}</Typography.Paragraph>
    </WrapperStyled>
  )
}
