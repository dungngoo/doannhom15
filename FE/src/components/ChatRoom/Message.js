import React from "react";
import ReactDOM from "react-dom";

import { Avatar, Typography } from "antd";
import styled from "styled-components";

const WrapperStyled = styled.div`
  margin-bottom: 30px;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 10px;
    color: red;
  }
  .content {
    margin-left: 30px;
  }
`;

export default function Message({
  text,
  displayName,
  createAt,
  photoURL,
  isMe,
}) {

  return (
    <WrapperStyled
      style={isMe ? { textAlign: "right", marginRight: "10px" } : {}}
    >
      <div>
        <Avatar src={photoURL}>A</Avatar>
        <Typography.Text className="author">{displayName}</Typography.Text>
        <Typography.Text className="date">{createAt}</Typography.Text>
      </div>
      <div>
        <Typography.Text className="content">{text}</Typography.Text>
      </div>
    </WrapperStyled>
  );
}
