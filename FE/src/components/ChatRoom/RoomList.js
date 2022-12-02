import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { Collapse, Typography, Avatar } from "antd";
import styled from "styled-components";
import DescriptionSideBar from "./DescriptionSideBar";
import { config } from "../../config";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const WrapperStyled = styled.div`
  width: 95%;
  overflow-y: auto;
  height: 370px;
  cursor: pointer;
  .contain {
    background-color: #d8e9f2;
    margin: 5px;
    padding: 5px;
    margin-bottom: 15px;
    border-radius: 50px;
    box-shadow: 4px 4px 3px 0px #3d3d3d;
  }
`;

export default function RoomList({ lastMsg, setLastMsg, chats, setChats,
  userinRoom, setUsersInRoom, createBy, setCreateBy, tempUser, setTempUser, receiver, setReceiver }) {
  const token = localStorage.getItem("token");
  const myid = localStorage.getItem("myid");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;

    fetch(`${config.BE_URL}/chats?currentUserId=${myid}`, {
      method: "GET",
      headers: {
        token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data) return;

        const payload = data.payload;
        setChats(payload);

        var chatsObj = {};
        payload.forEach((element) => {
          chatsObj[`${element.id}`] = "";
        });
        setLastMsg(chatsObj);

      })
      .catch((err) => console.error(err));
  }, []);
  const roomOnClick = (e, chat) => {
    var chatId = chat.id;
    setCreateBy(chat.createBy);
    receiver = chat.receiver?.name
    fetch(`${config.BE_URL}/chats/${chatId}`, {
      headers: {
        token: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (!data) return;
        if (data.payload.chatName) {
          // setUsersInRoom(data.payload.chat.users);
          receiver = data.payload.chatName;
          localStorage.setItem("showAddmember", 1);
        }
        else {
          localStorage.setItem("showAddmember", 0);
        }
        navigate(`/?chatId=${chatId}&receiver=${receiver}`);
      })
      .catch((err) => console.error(err));

    fetch(`${config.BE_URL}/users/getByChat/` + chatId, {
      headers: {
        token: localStorage.getItem("token"),
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setTempUser(data.payload.length)
      })

  };

  useEffect(() => {
    console.log(lastMsg);
  }, [lastMsg]);

  return (
    <WrapperStyled>
      {/* <div className='contain'>
              <DescriptionSideBar text={'Hello anh trai nay có bài gì không'} photoURL={null}
               username='Ngô Quốc Dũng'/>
            </div>
            <div className='contain'>
              <DescriptionSideBar text={'Hello anh trai nay có bài gì không'} photoURL={null}
               username='Ngô Quốc Dũng'/>
            </div> */}
      {chats &&
        chats.map((chat) => {
          return (
            <div
              className="contain"
              key={chat.id}
              onClick={(e) => roomOnClick(e, chat)}
            >
              <DescriptionSideBar
                text={
                  lastMsg[`${chat.id}`] !== ""
                    ? lastMsg[`${chat.id}`]
                    : (chat.lastMessage.type !== 1 ? (chat.lastMessage.content ? chat.lastMessage.content : "Tin nhắn đã được thu hồi") : "Hình ảnh")
                }

                photoURL={null}
                username={
                  (chat.chatName !== "" && chat.chatName !== undefined) ? chat.chatName : (
                    localStorage.getItem("myid") === chat.receiver.id ? chat.lastMessage.sender.name : chat.receiver.name)
                }
              />
            </div>
          );
        })}
    </WrapperStyled>
  );
}
