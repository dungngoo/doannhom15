import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import LogoLogin from "../../assets/images/2.png";

import styled from "styled-components";
import { Button, Input, Typography } from "antd";
import { GrFormNextLink } from "react-icons/gr";
import { Link } from "react-router-dom";
import { config } from "../../config";
import LoadingIndicator from "../LoadingIndicator";

const ServerURL = "http://localhost:9090";

const BackgroundStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;
const ContainerStyled = styled.div`
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  .btnLogin {
    height: 50px;
    width: 600px;
    border-radius: 20px;
    font-weight: 1000;
    background: linear-gradient(
      to bottom,
      rgb(85, 104, 247),
      rgb(28, 106, 241)
    );
    color: white;
    font-size: 16px;
    margin-top: 50px;
    transform: translateX(15px);
  }
  .input {
    height: 60px;
    margin: 20px;
    border-radius: 20px;
    border: 1px solid black;
    box-shadow: 4px 4px 3px 0px #3d3d3d;
  }
`;

const InfoStyled = styled.div`
  display: flex;
  justify-content: flex-end;

  .info-forgot {
    transform: translateX(-370px);
    font-weight: bold;
  }
  .info {
    font-style: italic;
  }
`;

const InputStyled = styled.div`
  padding-top: 120px;
  width: 600px;
`;

const HeaderStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 250px;
  background: linear-gradient(
    to bottom,
    rgb(209, 221, 100),
    rgb(55, 224, 216),
    rgb(85, 104, 247)
  );
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img-login {
    width: 221px;
    height: 196px;
  }
`;

const loginApi = `${config.BE_URL}/auth/login`;

export default function Login() {

  const [phoneNumber, setPhoneNumber] = useState("");
  const [pwd, setPwd] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  if (!isLogin) {
    <Navigate replace to="/login" />
  }
  const processLogin = async (e) => {
    e.preventDefault();

    const user = {
      phoneNumber,
      password: pwd,
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user),
    };
    try {
      setIsPending(true);
      const res = await fetch(loginApi, requestOptions);
      const data = await res.json();
      console.log(data);
      setIsPending(false);
      if (!data) {
        setError("Login failed. Please try again later");
        return;
      }
      if (data.statusCode !== 200) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", "Bearer " + data.payload.token);
      localStorage.setItem("myid", data.payload.id);
      localStorage.setItem("status", "true");
      localStorage.setItem("name", data.payload.name);
      setIsLogin(true);
    } catch (err) {
      setIsPending(false);
      setError("Login failed. Please try again later");
    }
  };


  if (isLogin) {
    return <Navigate replace to="/" />;
  }

  return (
    <BackgroundStyled>
      {isPending && <LoadingIndicator />}
      <HeaderStyled>
        <img className="img-login" src={LogoLogin} alt="Logo-login"></img>

      </HeaderStyled>
      <form onSubmit={(e) => processLogin(e)}>
        <ContainerStyled>
          <InputStyled>
            <Input
              className="input"
              type="text"
              placeholder="Enter Phonenumber"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Input
              className="input"
              type="password"
              placeholder="Enter Password"
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            <InfoStyled>
              <Typography.Paragraph className="info-forgot">
                Forgot Password
              </Typography.Paragraph>
              <Typography.Text className="info">
                <Link to={"/signup"}>Sign up</Link>
                <GrFormNextLink />
              </Typography.Text>
            </InfoStyled>

            {error !== "" && (
              <div className="text-danger" style={{ textAlign: "center" }}>
                {error}
              </div>
            )}

            <button className="btnLogin" type="submit">
              Login
            </button>
          </InputStyled>
        </ContainerStyled>
      </form>
    </BackgroundStyled>
  );
}
