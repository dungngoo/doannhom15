import React, { useState, useEffect, Component } from 'react'
import ReactDOM from 'react-dom'

import styled from 'styled-components'
import { ImSearch } from "react-icons/im";
import { Form } from 'antd';
import RoomList from './RoomList';
import DescriptionSideBar from './DescriptionSideBar';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import { config } from "../../config";
import { useNavigate } from "react-router-dom";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from 'antd/lib/avatar/avatar';


const SearchStyled = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    .input-search {
        padding-left: 35px;
        margin : 20px 0;
        margin-left: 20px;
        width: 100%;
        border-radius: 20px;
        border: none;
        height: 40px;

      }
   .icon-search {
        width: 20px;
        height: 20px;
        transform: translateX(50px) translateY(1px);
        color: grey;
   }
`;

// const FormStyled = styled(Form)`
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   padding: 2px 2px 2px 0;
//   border: 1px solid black;
//   border-radius: 2px;

//   .ant-form-item {
//     flex: 1;
//     margin-bottom: 0;
//   }
// `;

const ServerURL = "http://localhost:9090";
function Search() {



  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState([]);
  const [otherid, setOrtherId] = useState([]);

  /////////////////// Get user by phone or name//////////////
  const [phonenumber, setPhoneNumber] = useState("");
  const getUser = () => {
    fetch(`${ServerURL}/users/search/` + phonenumber, {
      method: "GET",
      headers: {
        token: token,
      }
    }).then((res) => res.json())
      .then((data) => {
        console.log(data)
        setUser(data.payload);
        localStorage.setItem('otherid', data.payload[0].id)  // *****************************
      })
  }

  // useEffect(() => {
  //   getUser();
  // }, [])          // Luôn luôn thay đổi giá trị *****************
  // console.log(storeid)

  const TongHop = () => {
    getUser()
    // getChatByOtherId()
  }
  const storeid = localStorage.getItem("otherid");
  ////////////// Get Chat by Userid /////////////////////////////
  const [chatroom, setChatRoom] = useState([]);
  const navigate = useNavigate();
  const getChatByOtherId = () => {
    fetch(`${ServerURL}/chats/getByOtherUser/` + storeid, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: token,
      }
    }).then(res => res.json())
      .then(data => {
        console.log(data.payload.id)
        setChatRoom(data.payload.id)
      }
      )
  }
  const userOnClick = async (user) => {
    var userId = user.id;
    var receiver1 = user.name;
    fetch(`${config.BE_URL}/chats/getByOtherUser/${userId}`, {
      headers: {
        token: token,
      }
    }).then((res) =>
      res.json())
      .then((data) => {
        if (data.statusCode === 404)
          navigate(`/?chatId=${null}&receiver=${receiver1}`)
        else {
          navigate(`/?chatId=${data.payload.id}&receiver=${receiver1}`)
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <form onSubmit={this} style={{ height: "160px", width: "100%", paddingRight: "25px", }}>
      <SearchStyled style={{ height: "50%" }}>
        <ImSearch className='icon-search' onClick={TongHop} />
        <input className='input-search' type={'search'} placeholder='Nhấn vào để tìm kiếm'
          onChange={(e) => setPhoneNumber(e.target.value)} value={phonenumber}
        ></input>
      </SearchStyled>
      <div style={{ height: "60%", overflowY: "auto" }}>
        {user &&
          user.map((user) => {
            return (
              <div
                key={user.id}
                className="container"
                onClick={() => userOnClick(user)}
              >
                <div style={{ cursor: "pointer" }}>
                  <DescriptionSideBar key={user.id} username={user.name}
                    style={{ cursor: "pointer" }} photoURL={null}>
                  </DescriptionSideBar>
                </div>
              </div>

            );
          })
        }
      </div>
    </form>
  )
}
export default Search