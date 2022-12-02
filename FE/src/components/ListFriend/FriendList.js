import { Avatar, Image, Typography } from 'antd'
import React from 'react'
import styled from 'styled-components'
import RvUser from "../../assets/images/remove_user.png";

const WrapperStyled = styled.div`
    margin: 5px;
    padding: 5px;
    border: 1px solid black;
    border-radius: 25px;
    display: flex; 
    background: #F5E9FF;
    justify-content: flex-start;
    .author {
        font-size: 15px;
        font-weight: bold;
    }
    .status {
        color: green;

    }
`;

const ContentStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 275px;
`;

export default function FriendList({ photoURL, displayName, status }) {
    return (
        <WrapperStyled>
            <Avatar className='username' src={photoURL}></Avatar>
            <ContentStyled>
                <Typography.Text className='author'>{displayName}</Typography.Text>
                <Typography.Text className='status'>{status}</Typography.Text>
            </ContentStyled>
        </WrapperStyled>
    )
}
