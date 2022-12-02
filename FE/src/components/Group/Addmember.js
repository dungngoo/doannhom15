import { Form, Input, Typography } from 'antd';
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components';
import { Row, Avatar } from 'antd';
import { IoIosArrowBack } from "react-icons/io";
import FriendList from '../ListFriend/FriendList';
import { RiGroupLine } from "react-icons/ri";
import imgGroupChat from '../../assets/images/bluecircleplus.png';
import { ImSearch } from "react-icons/im";
import { config } from '../../config';
import "../Group/Group.css";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Addmember({ setLastMsg,
    newMsg, socketRef,
    setFlag, flag, message, setMessage, userinRoom, setUsersInRoom,
    userdisabled, setUserDisabled }) {

    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const receiver = searchParams.get("receiver");
    const chatId = searchParams.get("chatId");
    // const [flag, setFlag] = useState(false);
    const [newlist, setNewList] = useState([])
    const [listid, setListId] = useState(null);
    const data = userinRoom.map(({ id }) => id);
    const result = users.filter(({ _id }) => !data.includes(_id));
    const [newArray, setNewArray] = useState([])
    ///////// ADD USERs /////////////////////////////////////
    const addUsers = async () => {
        console.log(newArray);
        const newArrayId = newArray.map(element => element._id)
        console.log(newArrayId);
        if (!chatId) return;
        const bodyRequest = {
            chatId: chatId,
            usersId: newArrayId
        }
        await socketRef.current.emit("User-Add-Member", bodyRequest);
    }



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
                    // console.log(data.payload.user.users);    
                    setUsers(data.payload.user.users)
                    setUserDisabled(Array(data.payload.length).fill(false))
                });
        }
        getAllUsers();
    }, [])



    //////////////////////////// get user by user id ///////////////////////

    useEffect(() => {
        console.log(listid);
        if (!listid) return;
        if (listid.length === 0) return;

        setNewList((oldList) => [...oldList, listid[0]]);
    }, [listid])

    useEffect(() => {
        if (!newMsg) return;
        if (!message) {
            // setMessage([newMsg]);
            return;
        }
        // console.log(message);
        if (message.length === 1 && flag) {
            setFlag(false);
            return;
        }
        setMessage((oldMsg) => [...oldMsg, newMsg]);
    }, [newMsg]);

    useEffect(() => {
        console.log(message);
    }, [message])

    useEffect(() => {
        if (!listid) return;
        setNewList((oldList) => [...oldList, listid])
    }, [listid])
    useEffect(() => {
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
                })
        }
        getUserinRoom();
    }, [])

    const HandleOnClick = () => {
        addUsers();
    }
    console.log(userinRoom);

    console.log(result);
    const ResultOnClick = (index1, users1) => {
        console.log(users1);
        console.log(index1);
        var indexTotal = users.findIndex(element => element._id === users1._id);
        var updatedUserDis = userdisabled;
        updatedUserDis[indexTotal] = false;
        setUserDisabled(updatedUserDis);
        console.log(updatedUserDis);
        console.log(indexTotal);
        const addNewList = newArray.filter((users2, index2) =>
            users2._id !== users1._id,
        )
        console.log(addNewList);
        setNewArray(addNewList);
    }

    const userOnClick = async (event, user, index) => {
        console.log(user);
        var updatedUserDis = userdisabled;
        updatedUserDis[index] = true;
        setUserDisabled(updatedUserDis);
        // setListId(data.payload)
        setNewArray((oldList) => [...oldList, user])
    }
    return (
        <>
            <WrappedStyled>
                <HeaderStyled>
                    <Row >
                        <IoIosArrowBack className='font a' style={{
                            transform: 'translateX(-80px)',
                        }} onClick={handleClose} />
                        <Typography.Text className='font' style={{
                            transform: 'translateX(15px) translateY(-5px)'
                        }}
                        >ADD MEMBER</Typography.Text>
                        <Typography.Text
                            className='font a' style={{ transform: 'translateX(80px) translateY(-5px)' }}
                            onClick={() => HandleOnClick()}
                        >ADD</Typography.Text>
                    </Row>
                    <Avatar className='font icgroup' />
                    <Typography.Text>{receiver}</Typography.Text>
                </HeaderStyled>
                <Row style={{ borderBottom: '1px solid grey', width: '100%' }}>
                    <RiGroupLine />
                    <Typography.Text className='font' >Add members</Typography.Text>
                </Row>
                <ContainerStyled>
                    <Row>
                        {newArray.filter((users, index, newArray) => newArray.indexOf(users) === index)
                            .map((users, index1) => {
                                return <Avatar key={users.id}
                                    onClick={() => ResultOnClick(index1, users)} style={{ cursor: "pointer" }}>{users.name}</Avatar>
                            })}
                    </Row>
                    <FormStyled >
                        <ImSearch className='a' />
                        <Form.Item>
                            <Input type={'search'} placeholder="Nhấn vào để tìm kiếm" bordered={false} ></Input>
                        </Form.Item>
                        {/*  onClick={() => ResultOnClick(index1, users)} */}
                        {/* onClick={(event) => userOnClick(event, user, index)} */}
                    </FormStyled>
                    {result && result.map((user, index) => {
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