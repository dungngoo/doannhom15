import React, {  useState } from 'react'
import {  Row } from 'antd'
import FriendList from '../ListFriend/FriendList'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

const FragmentStyled = styled.div`
  .offcanvas-body {
    color : red;
  }

`;


const WrapperStyled = styled.div`
  background: linear-gradient(to bottom,  rgb(83, 244, 172),  rgb(75, 233, 247),rgb(12, 123, 193));
  height: 100%;
  overflow: auto;

  
`;

export default function Friends() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <FragmentStyled>
      <Button onClick={handleShow} style={{width:"20%", textAlign:"left"}}>
        Friends
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
          <Offcanvas.Title>Danh sách bạn bè</Offcanvas.Title>
          </Offcanvas.Header>
        <Offcanvas.Body>
          <WrapperStyled>

            <FriendList photoURL={null} displayName='ABCD' status='online'></FriendList>
            <FriendList photoURL={null} displayName='Thang' status='online'></FriendList>
            <FriendList photoURL={null} displayName='Lam' status='online'></FriendList>
            <FriendList photoURL={null} displayName='Lam' status='online'></FriendList>


          </WrapperStyled>
        </Offcanvas.Body>
      </Offcanvas>
    </FragmentStyled>
 );
}





