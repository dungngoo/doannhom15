import React from "react";
import { Avatar, Typography } from "antd";
import styled from "styled-components";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Popup from "reactjs-popup";
import Profile from "../ProfilePage";
import { config } from "../../config";
import { useNavigate } from "react-router-dom";

const WrapperStyled = styled.div`
  display: flex;
  
 
`;

export default function UserInfo() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const logout = () => {
    fetch(`${config.BE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        token: localStorage.getItem("token"),
      }
    }).then((res)=> res.json())
    .then(data => console.log(data));
    navigate("/login");
  }
  return (
    <WrapperStyled>
      <Navbar>
        <Nav>
          <NavDropdown
            id="nav-dropdown-dark-example"
            title={<Avatar size={"large"}>Avatar</Avatar>}
            menuVariant="secondary"
          >
            <NavDropdown.Item href="#profile">
              <Popup
                modal
                trigger={<Typography.Text>Profile</Typography.Text>}
                contentStyle={{ width: "420px" }}
              >
                <Profile />
              </Popup>
            </NavDropdown.Item>
            <NavDropdown.Item href="#changepassword">
              Change Password
            </NavDropdown.Item>
            <NavDropdown.Item href="#help">Help</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={()=>logout()}>Log out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
      <Typography.Text
        className="username"
        style={{
          width: "100%",
          fontSize: "25px",
          fontWeight: "bold",
          paddingTop: "14px",
          color: "white",
         
        }}
      >{name}
      </Typography.Text>
    </WrapperStyled>
  );
}
