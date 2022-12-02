import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Row, Col, message } from "antd";
import ChatWindow from "../ChatRoom/ChatWindow";
import SignBar from "../ChatRoom/SideBar";
import Login from "../LoginPage";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { config } from "../../config";

const ServerURL = "http://localhost:9090";

export default function ChatRoom() {
  const token = localStorage.getItem("token");

  const [lastMsg, setLastMsg] = useState({});
  const [chats, setChats] = useState([]);
  const socketRef = useRef();

  const [newMsg, setNewMsg] = useState(null);
  const [newChat, setnewChat] = useState([]);

  const [flag, setFlag] = useState(false);
  const [chatid, setchatid] = useState(null);
  const [newlist, setNewList] = useState([])
  const [listid, setListId] = useState(null)
  const [user, setUser] = useState([])
  const [userinRoom, setUsersInRoom] = useState([])
  const [tempUser, setTempUser] = useState(0);
  const [userdisabled, setUserDisabled] = useState(null);
  const [createBy, setCreateBy] = useState("");

  const [chatIdRemove, setChatIdRemove] = useState("");
  const [messageId, setMessageId] = useState("");
  const [message, setMessage] = useState([]);
  const navigate = useNavigate();
  const [chatFlag, setChatFlag] = useState(false);


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    socketRef.current = io.connect(ServerURL, {
      extraHeaders: {
        token: localStorage.getItem("token"),
      },
    });
    socketRef.current.on("User-Send-Message", (data) => {
      console.log(data);
      setNewMsg(data);
      if (data && data.adminId) {
        setCreateBy(data.adminId);
      }
      fetch(`${config.BE_URL}/users/getByChat/` + data.chatId, {
        headers: {
          token: localStorage.getItem("token"),
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setTempUser(data.payload.length)
        })

      // setChats((oldChat)=> [...oldChat,data.chatId]);
    });
    socketRef.current.on("User-Create-Chat", (data) => {
      {
        console.log(data);
        ////////// Lần thứ 2 trở đi //////////////
        setChats((oldChat) => !oldChat ? [data] : [data, ...oldChat]);
        // if (data.chatName) {
        //   navigate(`/?chatId=${data.id}&receiver=${data.chatName}`);
        // }
      }
    });
    socketRef.current.on("User-Remove-Chat", (data) => {
      console.log(tempUser);
      // Leave group return chatId ==> call API ==> chat ==> setChat
      console.log(data);
      setChatIdRemove(data.chatId);
      // console.log(AChat);
      // console.log(BChat);
      navigate("/");
    })
    socketRef.current.on("User-Recall-Message", (data) => {
      console.log(data);
      if (data.messageId) {
        setMessageId(data.messageId);
      }
    })
  }, []);

  useEffect(() => {
    console.log(chats);
    if (chatIdRemove === "") return;
    const newRoom = chats.filter(chat => chat.id !== chatIdRemove);
    setChats(newRoom);
    console.log(chats);
    setChatIdRemove("");
  }, [chatIdRemove])

  useEffect(() => {
    console.log(message);
    const m = message.filter(mes => mes.id === messageId);
    console.log(m);
    if (!m.length) return;
    m[0]["content"] = "Tin nhắn đã được thu hồi";
    setMessage((oldMsg) => [...oldMsg, m]);
    m[0]["content"] = null;
    if (lastMsg !== m) return;
    setLastMsg((oldLastMsg) => ({
      ...oldLastMsg,
      [m[0].chatId]: "Tin nhắn đã được thu hồi",
    }));
  }, [messageId])


  // useEffect(() => {
  //   if (!newChat) return;
  //   if (!chats) {
  //     console.log(newChat);
  //     setChats([newChat]);
  //     return;
  //   }
  //   const sortChat = [newChat, ...chats];
  //   setChats(sortChat);
  //   setnewChat(null);
  // }, [newChat]);


  return (
    <Row style={{ height: "100vh" }}>
      <Col span={6}>
        <SignBar lastMsg={lastMsg} setLastMsg={setLastMsg} chats={chats}
          setChats={setChats} socketRef={socketRef} setnewChat={setnewChat}
          setNewMsg={setNewMsg} setFlag={setFlag} flag={flag} newlist={newlist} setNewList={setNewList}
          listid={listid} setListId={setListId} setUser={setUser} user={user}
          userinRoom={userinRoom} setUsersInRoom={setUsersInRoom} userdisabled={userdisabled}
          setUserDisabled={setUserDisabled} createBy={createBy}
          setCreateBy={setCreateBy} tempUser={tempUser} setTempUser={setTempUser} newChat={newChat}
          chatFlag={chatFlag} setChatFlag={setChatFlag}

        />
      </Col>
      <Col span={18}>
        <ChatWindow lastMsg={lastMsg} setLastMsg={setLastMsg} chats={chats} setChats={setChats}
          socketRef={socketRef} setnewChat={setnewChat} setFlag={setFlag} flag={flag}
          setNewMsg={setNewMsg} newChat={newChat} newMsg={newMsg} chatid={chatid} setchatid={setchatid}
          newlist={newlist} setNewList={setNewList}
          listid={listid} setListId={setListId} setUser={setUser} user={user}
          userinRoom={userinRoom} setUsersInRoom={setUsersInRoom}
          userdisabled={userdisabled}
          setUserDisabled={setUserDisabled} createBy={createBy}
          setCreateBy={setCreateBy} tempUser={tempUser} setTempUser={setTempUser} message={message} setMessage={setMessage} />
      </Col>
    </Row>
  );
}
