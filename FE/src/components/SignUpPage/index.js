import React, { useEffect, useState } from "react";
import LogoLogin from "../../assets/images/2.png";
import styled from "styled-components";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { config } from "../../config";
import LoadingIndicator from "../LoadingIndicator";

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
    height: 40px;
    width: 600px;
    border-radius: 20px;
    font-weight: 1000;
    background: linear-gradient(to bottom, rgb(17, 20, 225), rgb(112, 99, 225));
    color: white;
    font-size: 16px;
    margin-top: 20px;
    transform: translateX(20px);
    text-align: center;
    vertical-align: middle;
    
  }
  .input {
    height: 40px;
    margin: 20px;
    border-radius: 20px;
    border: 1px solid black;
    box-shadow: 4px 4px 3px 0px #3d3d3d;
  }
`;

const InputStyled = styled.div`
  padding-top: 250px;
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

const registerApi = `${config.BE_URL}/auth/register`;

export default function SignUp() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const Register = async (e) => {
    e.preventDefault();
    if (confirmPwd !== pwd) {
      setError("Confirm password and password not match");
      return;
    }

    const newUser = {
      phoneNumber,
      name,
      password: pwd,
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(newUser),
    };
    try {
      setIsPending(true);
      const res = await fetch(registerApi, requestOptions);
      const data = await res.json();
      setIsPending(false);
      if (!data) {
        setError("Register failed. Please try again later");
        return;
      }
      if (data.statusCode !== 200) {
        setError("Register failed. Please try again later");
        return;
      }

      setError("");
      setSuccess("Register successfully");
      setPhoneNumber("");
      setName("");
      setPwd("");
      setConfirmPwd("");
    } catch (err) {
      setIsPending(false);
      setError("Register failed. Please try again later");
    }
  };

  return (
    <BackgroundStyled>
      {isPending && <LoadingIndicator />}
      <HeaderStyled>
        <img className="img-login" src={LogoLogin} alt="Logo-login"></img>
      </HeaderStyled>
      <ContainerStyled>
        <form onSubmit={(e) => Register(e)}>
          <InputStyled>
            <Link to={"/login"}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ float: "right", cursor: "pointer" }}
              />
            </Link>
            <Input
              className="input"
              type="text"
              placeholder="Enter Phonenumber*"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Input
              className="input"
              type="text"
              placeholder="Enter Name*"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="input"
              type="text"
              placeholder="Enter Birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <Input
              className="input"
              type="password"
              placeholder="Enter Password*"
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            <Input
              className="input"
              type="password"
              placeholder="Confirm Password*"
              required
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
            {error !== "" && (
              <div className="text-danger" style={{ textAlign: "center" }}>
                {error}
              </div>
            )}
            {success !== "" && (
              <div className="text-success" style={{ textAlign: "center" }}>
                {success}
              </div>
            )}
            <button className="btnLogin" type="submit" ><div style={{ transform: " translateY(-7px)" }}>Sign Up</div>
            </button>
          </InputStyled>
        </form>
      </ContainerStyled>
    </BackgroundStyled>
  );
}
// export default function Root() {
//   return (
//     <>
//       <div id="sidebar">
//         <h1>React Router Contacts</h1>
//         <div>
//           <form id="search-form" role="search">
//             <input
//               id="q"
//               aria-label="Search contacts"
//               placeholder="Search"
//               type="search"
//               name="q"
//             />
//             <div
//               id="search-spinner"
//               aria-hidden
//               hidden={true}
//             />
//             <div
//               className="sr-only"
//               aria-live="polite"
//             ></div>
//           </form>
//           <form method="post">
//             <button type="submit">New</button>
//           </form>
//         </div>
//         <nav>
//           <ul>
//             <li>
//               <a href={`contacts/1`}>Your Name</a>
//             </li>
//             <li>
//               <a href={`contacts/2`}>Your Friend</a>
//             </li>
//           </ul>
//         </nav>
//       </div>
//       <div id="detail"></div>
//     </>
//   );
// }
