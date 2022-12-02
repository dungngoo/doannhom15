import { Form, Input, Typography } from 'antd';
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components';
import { Row, Avatar } from 'antd';
import { IoIosArrowBack, IoMdReturnLeft } from "react-icons/io";
import FriendList from '../ListFriend/FriendList';
import { RiGroupLine } from "react-icons/ri";
import imgGroupChat from '../../assets/images/bluecircleplus.png';
import { ImSearch } from "react-icons/im";
import { config } from '../../config';
import "../Group/Group.css";
import { useSearchParams, useNavigate } from "react-router-dom";
const WrappedStyled = styled.div`

    padding: 10px;
    background: linear-gradient(to bottom, rgb(83, 244, 172), rgb(75, 233, 247), rgb(12, 123, 193));
    /* color: white; */
    font-weight: bold;
    font-display: white;    
    width: 100%;
    height: 100%;
    .font {
        /* color: white; */
        font-weight: bold;
        
    }
    .title {
            font-size: 18px;
        }
    .icgroup {
        width:  70px;
        height: 70px;
    }
`;

const HeaderStyled = styled.div`

display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
   
    
    
`;

const ContainerStyled = styled.div`
     display: flex;
     flex-direction: column;
     max-height:400px;
     overflow-y: auto;
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
// 
export default function GroupInfo({ lastMsg, setLastMsg, chats, setChats, socketRef, setFlag,
    flag, newlist, setNewList, listid, setListId, user, setUser,
    userdisabled, setUserDisabled, createBy, setCreateBy, userInRoom, setUserInRoom, tempUser, setTempUser
    , newChat, setnewChat,chatFlag,setChatFlag }) {


    const [users, setUsers] = useState([]);
    // const [newChat, setnewChat] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [message, setMessage] = useState([]);
    const [userLength, setUserLength] = useState(0);

    ///////////////////// GEt ALL USERS ///////////////////////////
    useEffect(() => {
        const getAllUsers = () => {
            fetch(`${config.BE_URL}/users/`, {
                method: "GET",
                headers: {
                    token: localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then(data => {
                    setUsers(data.payload.user.users)
                    setUserLength(data.payload.length)
                    setUserDisabled(Array(data.payload.length).fill(false))
                });
        }
        getAllUsers();
    }, [])



    //////////////////////////// get user by user id ///////////////////////

    const userOnClick = async (event, user, index) => {
        console.log(user);
        var updatedUserDis = userdisabled;
        updatedUserDis[index] = true;
        setUserDisabled(updatedUserDis);
        // setListId(data.payload)
        setNewList((oldList) => [...oldList, user])
    }

    /////////////////  POST CHAT GROUP /////////////////////////////
    const [chatname, setChatName] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    let chatId = searchParams.get("chatId");
    const newlistId = newlist.map(element => element._id)
    const bodyRequest = {
        type: 1,
        chatName: chatname,
        users: newlistId,
    };

    const PostChat = () => {
        if (!chatname) return;
        fetch(`${config.BE_URL}/chats`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                token: localStorage.getItem('token'),
            },
            body: JSON.stringify(bodyRequest)
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                // setChats((oldChat) => [data.payload, ...oldChat]);
                setCreateBy(data.payload.createBy);
                chatId = data.payload.id;
                navigate(`/?chatId=${chatId}&receiver=${chatname}`)
                setFlag(true);
                sendNotify();
                setNewList([]);
                // setChatFlag(true);
                // setnewChat(data.payload);
                setUserDisabled(Array(userLength).fill(false))
                // setChatName();
                localStorage.setItem("showAddmember", data.payload.type)
            })
            .catch(err => console.log(err))


    }
    ////////////////////// Send Notify Group //////////////////////////

    const sendNotify = async () => {
        if (!chatId) {
            return;
        }
        const messageData = {
            type: 2,
            content: `${localStorage.getItem("name")} vừa tạo nhóm`,
            chatId: chatId,
        };
        await socketRef.current.emit("User-Send-Message", messageData);
        setLastMsg((oldLastMsg) => ({
            ...oldLastMsg,
            [chatId]: messageData.content,
        }));
    };
    useEffect(() => {
        if (!message) return;
        console.log(message);
    }, [message])

    useEffect(() => {
        console.log(lastMsg);
    }, [lastMsg]);

    const HandleOnClick = () => {
        PostChat();
    }
    const NewListOnClick = (index1, users1) => {
        console.log(users1);
        console.log(index1);
        // console.log(users);
        // var userMatch = users.filter(element => element._id === users1.id);
        // var indexTotal = users.indexOf(userMatch)
        var indexTotal = users.findIndex(element => element._id === users1._id);
        var updatedUserDis = userdisabled;
        updatedUserDis[indexTotal] = false;
        setUserDisabled(updatedUserDis);
        console.log(updatedUserDis);
        console.log(indexTotal);
        const addNewList = newlist.filter((users2, index2) =>
            users2._id !== users1._id,
        )
        console.log(addNewList);
        setNewList(addNewList);
    }

    useEffect(() => { console.log(createBy); }, [createBy])
    return (
        <>
            <WrappedStyled>
                <HeaderStyled>
                    <Row >
                        <IoIosArrowBack className='font a' style={{ transform: 'translateX(-80px)' }} onClick={handleClose} />
                        <Typography.Text className='font' style={{
                            transform: 'translateX(15px) translateY(-5px)'
                        }}
                        >CREATE GROUP</Typography.Text>
                        <Typography.Text
                            className='font a' style={{ transform: 'translateX(80px) translateY(-5px)' }}
                            onClick={() => HandleOnClick()}
                        >Create</Typography.Text>
                    </Row>
                    <Avatar src={imgGroupChat} className='font icgroup' />
                    <Input className='inputa' type='text' placeholder='Nhập tên nhóm' onChange={(e) => setChatName(e.target.value)} />
                </HeaderStyled>
                <Row style={{ borderBottom: '1px solid grey', width: '100%' }}>
                    <RiGroupLine />
                    <Typography.Text className='font' >Add members</Typography.Text>
                </Row>
                <ContainerStyled>
                    <Row >
                        {newlist.filter((users, index, newlist) => newlist.indexOf(users) === index)
                            .map((users, index1) => {
                                return <Avatar key={users.id}
                                    onClick={() => NewListOnClick(index1, users)} style={{ cursor: "pointer" }}>{users.name}</Avatar>
                            })}
                    </Row>

                    {users && users.map((user, index) => {
                        if (user._id === localStorage.getItem("myid")) {
                            return null;
                        }

                        return (
                            <div className={'fliststyled' + userdisabled && userdisabled[index] && 'is-disabled'} key={user._id} onClick={(event) => userOnClick(event, user, index)}
                                style={{ cursor: "pointer" }}>
                                <FriendList key={user._id} photoURL={user.avatar} displayName={user.name} />
                            </div>
                        )
                    })}
                </ContainerStyled>
            </WrappedStyled>
        </>
    )
}
