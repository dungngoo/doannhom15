import { Avatar, Image, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components'
import { config } from '../../config';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import { BsThreeDots } from "react-icons/bs";

import RvUser from "../../assets/images/remove_user.png";
import ChooseAdmin from "../../assets/images/admin.png";
import AdminUser from "../../assets/images/key.png";
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

export default function FriendGroup({ photoURL, displayName, status, socketref, newlist,
    setNewList, listid, setListId, user, setUser,
    userinRoom, setUsersInRoom, createBy, setCreateBy, tempUser, setTempUser }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const chatId = searchParams.get("chatId");

    const getUserinRoom = () => {
        fetch(`${config.BE_URL}/users/getByChat/` + chatId, {
            headers: {
                token: localStorage.getItem("token"),
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setUsersInRoom(data.payload);
                setTempUser(data.payload.length)

            })
    }
    useEffect(() => {
        if (!listid) return;
        setNewList((oldList) => [...oldList, listid])
    }, [listid])
    useEffect(() => {

        getUserinRoom();
    }, [])

    const handleOnClick = async (user, index) => {
        console.log(user);
        const bodyRequest = {
            chatId: chatId,
            userId: user.id,
        }
        await socketref.current.emit("User-Remove-Member", bodyRequest)
        const userinRoom1 = userinRoom
        userinRoom1.splice(index, 1);
        setUsersInRoom(userinRoom1)


    }
    // console.log(currentUserId);

    const SelectAdmin = async (user) => {
        console.log(user);
        const bodyRequest = {
            chatId: chatId,
            userId: user.id,
        }
        await socketref.current.emit("User-Select-Admin", bodyRequest)

    
    }
    return (
        <> {!userinRoom && <WrapperStyled></WrapperStyled>}
            {userinRoom && userinRoom.map((users, index) => {
                return (
                    // onClick={() => userOnClick({ users })}
                    <WrapperStyled key={users.id}>
                        <Avatar className='username' src={users?.avatar} ></Avatar>

                        <ContentStyled>
                            <Typography.Text className='author'>{users.name}</Typography.Text>
                            <Typography.Text className='status' >{status}</Typography.Text>
                        </ContentStyled>
                        {localStorage.getItem("myid") === createBy &&
                            <ABCStyled>
                                {users.id === createBy ?
                                    <input type='image' src={AdminUser} alt='Admin' style={{
                                        padding: "3px",
                                        width: "27px",
                                        height: "27px",
                                        display: "flex",
                                        justifycontent: "flex-end"
                                    }}
                                    /> :
                                    ['top'].map((placement) => (
                                        <OverlayTrigger
                                            trigger="click"
                                            key={placement}
                                            placement={placement}
                                            overlay={
                                                <Popover id={`popover-positioned-${placement}`}>
                                                    <Popover.Body style={{ display: "flex", padding: "10px" }}>
                                                        <input type='image' src={ChooseAdmin} alt='Remove users' style={{
                                                            padding: "3px",
                                                            width: "27px",
                                                            height: "27px",
                                                            display: "flex",
                                                            justifycontent: "flex-end"
                                                        }}
                                                            onClick={() => SelectAdmin(users)}
                                                        />
                                                        <input type='image' src={RvUser} alt='Remove users' style={{
                                                            padding: "3px",
                                                            marginRight: "5px",
                                                            width: "25px",
                                                            height: "25px",
                                                            display: "flex",
                                                            justifycontent: "flex-end"
                                                        }}
                                                            onClick={() => handleOnClick(users, index)}
                                                        />
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <div variant="secondary"><BsThreeDots style={{ width: "30px", height: "25px" }} /></div>
                                        </OverlayTrigger>
                                    ))
                                }
                            </ABCStyled>}
                    </WrapperStyled>
                );
            })}
        </>
    )
}
const ABCStyled = styled.div`

`;


