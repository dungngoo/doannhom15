import React, { useEffect, useRef, useState } from "react";

import { Avatar, Form, Input } from "antd";
import styled from "styled-components";
import { AiTwotoneAudio } from "react-icons/ai";
import { BsFillCursorFill } from "react-icons/bs";
import { IoPersonAddSharp } from "react-icons/io5";
import TextArea from "antd/lib/input/TextArea";
import "../../App.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import GroupSideBar from "../Group/GroupSideBar";
import Addmember from "../Group/Addmember";
import Popup from "reactjs-popup";
import { RiArrowGoBackLine } from "react-icons/ri";
import Posts from "./Post";
import { Text } from "@chakra-ui/react";


const ServerURL = "http://localhost:9090";
const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 70px;
  padding: 0 15px;
  align-items: center;

  .header {
    &-image {
      padding: 25px;
      margin: 0 20px;
    }
    &-info {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    &-username {
      margin: 0;
      font-weight: bold;
    }

    &-description {
      font-size: 12px;
    }
  }
`;
const IconStyled = styled.div`
  display: flex;
  align-items: flex-end;
  transform: translateY(-15px);
  .fa-info {
    font-size: 25px;
    position: relative;
    background-position: 100px 100px;
    background-repeat: no-repeat;
    color: blue;
  }
  .ic {
    transform: translateY(-2px);
    margin-right: 5px;
  }
`;

const BorderStyled = styled.div`
  border-bottom: 1px solid grey;
  transform: translateY(50px);
  position: absolute;
  left: 5%;
  right: 5%;
`;

const HeaderContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 15px;
  font-size: 30px;
  color: blue;
  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const WrapperStyled = styled.div`
  height: 100vh;
  .fa {
    font-size: 40px;
    color: unset;
    background-clip: text;
    background-image: linear-gradient(
      to bottom,
      rgb(55, 224, 216),
      rgb(85, 104, 247)
    );
  }
`;

export default function ChatWindow({ lastMsg, setLastMsg, chats, setChats, setnewChat,
  setNewMsg, newChat, newMsg, socketRef,
  setFlag, flag, chatid, setchatid,
  newlist, setNewList, listid, setListId, setUser, user, userinRoom, setUsersInRoom,
  userdisabled, setUserDisabled, createBy, setCreateBy, tempUser, setTempUser, message, setMessage }) {

  // create token
  const [token, setToken] = useState(localStorage.getItem("token"));
  const showAddmember = localStorage.getItem("showAddmember");
  // const [message, setMessage] = useState([]);
  const [text, setText] = useState("");

  // const [flag, setFlag] = useState(false);


  const myid = localStorage.getItem("myid");

  const storeid = localStorage.getItem("otherid") || "[]";

  const [searchParams, setSearchParams] = useSearchParams();

  let chatId = searchParams.get("chatId");
  let receiver = searchParams.get("receiver");
  const [show, setShow] = useState(false);
  const target = useRef(null);

  console.log(showAddmember);



  const navigate = useNavigate();

  // ////////////// Create Post Chat///////////////////

  const bodyRequest = {
    type: 0,
    users: [storeid],
  };

  const PostChat = () => {
    fetch(`${ServerURL}/chats`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
      body: JSON.stringify(bodyRequest)
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        chatId = data.payload.id;
        navigate(`/?chatId=${chatId}&receiver=${receiver}`)
        setFlag(true);
        sendMessage();

      })
      .catch(err => console.log(err));
  }

  // ////////////////////////   Send-Receive Message       ////////////////////////////


  // useEffect(() => {
  //   if (!newChat) return;
  //   if (!chats) {
  //     console.log(newChat);
  //     setChats([newChat]);
  //     return;
  //   }
  //   setChats((oldChat) => [...oldChat, newChat]);
  //   setnewChat(null);
  // }, [newChat]);

  useEffect(() => {
    console.log(message);
    if (!newMsg) return;
    if (!message) {
      // setMessage([newMsg]);
      // setLastMsg({ [newMsg.chatId]: newMsg.content });
      return;
    }
    // console.log(message);
    if (message.length === 1 && flag) {
      setFlag(false);
      setLastMsg((oldLastMsg) => ({
        ...oldLastMsg,
        [newMsg.chatId]: newMsg.content,
      }));
      return;
    }
    setMessage((oldMsg) => [...oldMsg, newMsg]);
    if (newMsg.type === 1) {
      setLastMsg((oldLastMsg) => ({
        ...oldLastMsg,
        [newMsg.chatId]: "Hình ảnh",
      }));
      return;
    }
    setLastMsg((oldLastMsg) => ({
      ...oldLastMsg,
      [newMsg.chatId]: newMsg.content,
    }));

  }, [newMsg]);

  useEffect(() => {
    console.log(message);
    console.log(lastMsg);
  }, [message, lastMsg])

  const sendMessage = async () => {
    if (!storeid) {
      return;
    }
    if (!text) return;
    if (!text.trim()) return;
    if (text !== null) {
      const messageData = {
        type: 0,
        content: text,
        chatId: chatId,
      };
      await socketRef.current.emit("User-Send-Message", messageData);

      // setLastMsg((oldLastMsg) => ({
      //   ...oldLastMsg,
      //   [chatId]: text,
      // }));
      setText("");
    }
  };

  // console.log(socket.on("User-Send-Message", sendMessage),"Message")

  // ////////////////////////  Get All Message by ChatId      ////////////////////////////

  useEffect(() => {
    if (chatId === null) return;
    // if(flag) return;
    const getAllMessage = async () => {
      fetch(`${ServerURL}/chats/messages/` + chatId, {
        headers: {
          token: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(flag);
          // setFlag(true);
          // if(flag) return;

          setMessage(data.payload);
          // console.log(data.payload);
        })
        .catch((err) => console.error(err));
    };
    getAllMessage();
  }, [token, chatId, flag]);

  const onEnterPress = (e) => {
    if (!text) return;
    if (!text.trim()) return;
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage();
    }
  };

  const HandleOnClick = () => {
    if (chatId === 'null') {
      PostChat();
    }
    else {
      sendMessage();
    }
  }

  const HandleClick = async (message) => {
    const messageId = message;
    await socketRef.current.emit("User-Recall-Message", { messageId });
    console.log("Thanhf coong");
  }
  const ImageClick = () => {
    FetchImage();
  }
  const FetchImage = () => {
    fetch(`${ServerURL}/images`).then((res) => res.json()).then(data => {
      console.log(data);
    })
  }

  return (
    <>
      {!chatId && <WrapperStyled></WrapperStyled>}
      {chatId && (

        <WrapperStyled>
          <HeaderStyled>
            <div className="header-info">
              <Avatar className="header-image"></Avatar>
              <HeaderContentStyled>
                <p className="header-username">{receiver}</p>
                <span className="header-description">
                  {showAddmember === "1" && <div>{tempUser} thành viên</div>}
                </span>
                <BorderStyled />
              </HeaderContentStyled>
            </div>
            <IconStyled>
              <Popup modal trigger={<Avatar className='fa-info ic' src={<IoPersonAddSharp style={{
                width: "30px", height: "25px",
                marginRight: "10px", color: "blue",
                visibility: showAddmember === "1" ? 'visible' : 'hidden',
                cursor: "pointer"
              }} />} alt='CirclePlus in Sidebar' />}
                contentStyle={{ width: '350px', height: '600px', padding: '0px' }}>

                <Addmember socketRef={socketRef} message={message} setMessage={setMessage} userinRoom={userinRoom}
                  setUsersInRoom={setUsersInRoom}
                  userdisabled={userdisabled}
                  setUserDisabled={setUserDisabled} />
              </Popup>
              <GroupSideBar chatid={chatid} setchatid={setchatid} socketRef={socketRef}
                newlist={newlist} setNewList={setNewList}
                listid={listid} setListId={setListId} setUser={setUser} user={user}
                userinRoom={userinRoom}
                setUsersInRoom={setUsersInRoom} createBy={createBy}
                setCreateBy={setCreateBy} tempUser={tempUser} setTempUser={setTempUser} />
            </IconStyled>
          </HeaderStyled>

          <ContentStyled>
            <div className="box-chat" style={{ paddingBottom: "5px" }}>
              <div className="box-chat_message">
                {/* {renderMess}   */}
                {message &&
                  message.map((m, index) => {
                    if (chatId === m.chatId) {
                      return (
                        <>
                          {/* {m.type !== 1 && */}
                          <div
                            key={index}
                            className={`${(m.type === 2 || m.type === 3) ? "NotifyMessage" :
                              `${m.sender?.id === myid ? "your-message" : "other-people"
                              }`} chat-item `}
                            style={{ cursor: "pointer" }}
                          >

                            <div className="message" style={{ width: "75%" }}
                            >
                              <div style={{ color: "black", fontWeight: "bold" }}>
                                {showAddmember === "1" && localStorage.getItem("myid") !== m.sender?.id ? m.type === 0 && m.sender.name : null}
                              </div>
                              <div >  {m.type !== 1 ? (m.content ? m.content : "Tin nhắn đã được thu hồi") : <img src={m.content}></img>}</div>
                            </div>

                            {m.content && <div style={{ width: "25%", height: "25px", transform: "translateX(-450px)" }}
                              className="hide"><RiArrowGoBackLine style={{ height: "30px", width: "30px" }}
                                onClick={() => HandleClick(m.id)} /></div>}

                          </div>
                          {/* } */}
                          {/* {
                            m.type === 1 && <div
                              key={index}
                              className={`${(m.type === 2 || m.type === 3) ? "NotifyMessage" :
                                `${m.sender?.id === myid ? "your-message" : "other-people"
                                } chat-item `}`}
                              style={{ cursor: "pointer" }}
                            >

                              <div className="message" style={{ width: "75%" }}
                              >
                                <div style={{ color: "black", fontWeight: "bold" }}>
                                  {showAddmember === "1" && localStorage.getItem("myid") !== m.sender?.id ? m.type === 0 && m.sender.name : null}
                                </div>
                                <img src={m.content} onClick={() => (window.open(m.content))}></img>
                              </div>

                              {m.content && <div style={{ width: "25%", height: "25px", transform: "translateX(-450px)" }}
                                className="hide"><RiArrowGoBackLine style={{ height: "30px", width: "30px" }}
                                  onClick={() => HandleClick(m.id)} /></div>}

                            </div>
                          } */}
                        </>
                      );
                    }

                  })}
                <div style={{ float: "left", clear: "both" }}></div>
              </div>
            </div>

            <FormStyled style={{ height: "40px", padding: "5px" }}>
              <Posts style={{ cursor: "pointer" }} onChange={() => ImageClick()} socketRef={socketRef} />
              <Input
                style={{ height: "30px" }}
                placeholder="Nhập tin nhắn ..."
                bordered={false}
                onChange={(e) => setText(e.target.value)}
                value={text}
                onKeyDown={(e) => onEnterPress(e)}
                type="text"
              >
                {/* <td>
                  <img width="50px" src={image_url} />
                </td> */}
              </Input>
              <BsFillCursorFill onClick={() => HandleOnClick()} />
              {/* onClick={()=> {
            getChatByOtherId();
            if (chatroom === null) {
              createPostChat()
              sendMessage()
            }
            else {
              sendMessage()
            }
          }}  */}
            </FormStyled>
          </ContentStyled>
        </WrapperStyled>
      )
      }
    </>
  );
}
