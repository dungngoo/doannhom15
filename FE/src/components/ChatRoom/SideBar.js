import React from 'react'

import { Col, Avatar, Row } from 'antd';
import Search from './Search';
import RoomList from './RoomList';
import UserInfo from './UserInfo';
import styled from 'styled-components';
import CirclePlus from '../../assets/images/bluecircleplus.png';
import { AiFillPlusCircle } from "react-icons/ai";



import Friends from '../ListFriend/index';
import Popup from 'reactjs-popup';
import GroupInfo from '../Group/index';
import GroupSideBar from '../Group/GroupSideBar';


const SideBarStyled = styled.div`
    background: linear-gradient(to bottom,  rgb(83, 244, 172),  rgb(75, 233, 247),rgb(12, 123, 193));
    height: 100vh;
    padding: 5px;
`;

const AvatarStyled = styled.div`
    padding-top: 20px;
    float: right;
    justify-content: flex-end;
   // transform: translateY(200px);
    margin-right: 20px;
    color:black;
    
    
`;

export default function SignBar({ lastMsg, setLastMsg, setChats, chats, socketRef,
    setFlag, flag, newlist, setNewList
    , listid, setListId, user, setUser, userinRoom, setUsersInRoom
    , userdisabled, setUserDisabled, createBy, setCreateBy, tempUser, setTempUser, newChat, setnewChat, setChatFlag, chatFlag
    , receiver, setReceiver }) {

    return (
        <SideBarStyled>

            <Col span={24}><UserInfo /></Col>
            <Col span={24}><Search /></Col>
            <Col span={24} style={{ padding: "5px" }}><Friends /></Col>
            <Col span={24}>
                <RoomList lastMsg={lastMsg} setLastMsg={setLastMsg} setChats={setChats} chats={chats} userinRoom={userinRoom}
                    setUsersInRoom={setUsersInRoom} createBy={createBy}
                    setCreateBy={setCreateBy} tempUser={tempUser} setTempUser={setTempUser}
                    receiver={receiver} setReceiver={setReceiver} />
            </Col>
            <AvatarStyled>
                <Row>

                    <Popup modal trigger={<Avatar className='avt' src={CirclePlus} alt='CirclePlus in Sidebar' style={{
                        width: '50px', height: '50px', boxShadow: '4px 4px 3px 0px #3D3D3D', cursor: "pointer"

                    }} />} contentStyle={{ width: '350px', height: '600px', padding: '0px' }}>

                        <GroupInfo lastMsg={lastMsg} setLastMsg={setLastMsg} setChats={setChats} chats={chats}
                            socketRef={socketRef} setFlag={setFlag} flag={flag} newlist={newlist} setNewList={setNewList}
                            listid={listid} setListId={setListId} setUser={setUser} user={user}
                            userdisabled={userdisabled}
                            setUserDisabled={setUserDisabled} createBy={createBy}
                            setCreateBy={setCreateBy} userinRoom={userinRoom} setUsersInRoom={setUsersInRoom} tempUser={tempUser} setTempUser={setTempUser}
                            newChat={newChat} setnewChat={setnewChat} setChatFlag={setChatFlag} chatFlag={chatFlag} />
                    </Popup>
                </Row>
            </AvatarStyled>
        </SideBarStyled>)

}
