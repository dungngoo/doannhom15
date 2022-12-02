
import React, { useEffect, useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Search from '../ChatRoom/Search';
import FriendGroup from '../ListFriend/FriendGroup';
import { Avatar, Form, Row, Typography } from 'antd';
import styled from 'styled-components';
import "../Group/Group.css";
import { IoPersonAddSharp } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ImSearch } from 'react-icons/im';
import { useSearchParams } from 'react-router-dom';
import { config } from '../../config';


export default function GroupSideBar({ chatid, setchatid, socketRef, newlist, setNewList
    , listid, setListId, userinRoom, setUsersInRoom, createBy, setCreateBy, tempUser, setTempUser }) {
    const showAddmember = localStorage.getItem("showAddmember");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const receiver = searchParams.get("receiver");
    const chatId = searchParams.get("chatId");
    const UserLeaveGroup = async (err) => {
        if (localStorage.getItem("myid") === createBy) {
            return;
        }
        if (!chatId) return;
        console.log(createBy);
        const bodyRequest = {
            chatId: chatId,
        }
        await socketRef.current.emit("User-Leave-Group", bodyRequest)

    }


    return (
        <div >
            <div variant="primary" onClick={handleShow} className="me-2">
                <FontAwesomeIcon icon={faInfoCircle} className="fa-info" style={{
                    width: "30px", height: "25px",
                    marginRight: "10px", color: "blue",
                    visibility: showAddmember === "1" ? 'visible' : 'hidden',
                    cursor: "pointer"
                }} />
            </div>
            <Offcanvas show={show} onHide={handleClose} placement={'end'} className='wrapper' >
                <Offcanvas.Header closeButton>
                </Offcanvas.Header>
                <div className='header'>
                    <Avatar className='avatargroup'></Avatar>
                    <Offcanvas.Title>{receiver}</Offcanvas.Title>
                </div>
                <BorderStyled />
                <div className='containerLeavegroup'>
                    <FriendGroup socketref={socketRef} newlist={newlist} setNewList={setNewList}
                        userinRoom={userinRoom}
                        setUsersInRoom={setUsersInRoom} createBy={createBy}
                        setCreateBy={setCreateBy} />
                </div>
                <div className='footer'><Button className='buttonLeavegroup' onClick={() => UserLeaveGroup()}>Rời khỏi nhóm</Button></div>
            </Offcanvas>
        </div>
    )
}
const BorderStyled = styled.div`
    border: 0.5px solid black;
    position: absolute;
    bottom : 71%;
    left: 5%;
    right: 5%;
`;
const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 2px 2px 2px 5px;
  margin-bottom: 10px;
  border-radius: 15px;
  font-size: 30px;
  color: gray;
  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;