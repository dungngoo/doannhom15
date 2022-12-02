import { Typography } from 'antd';
import React from 'react'
import { AiOutlineUser,AiOutlineGift,AiOutlinePhone,AiFillHome } from "react-icons/ai";
import { MdOutlineWork,MdOutlineSchool } from "react-icons/md";
import styled from 'styled-components';


const WrapperStyled = styled.div`
    margin: 20px;   
    .ct {
        font-size: 13px;
        margin-left: 5px;
        font-weight: 500;

    }
    .phone {
            border-bottom: 1px solid lightgray;
      
        }
    .ic {
        height: 30px;
        color: blue;
    }
`;
export default function ProfileInfo({sex,date,telephone,liveAt,studyAt,workAt}) {
  return (
    <WrapperStyled>
        <div>
            <AiOutlineUser className='ic'/>
            <Typography.Text className='ct sex'>{sex}</Typography.Text>
        </div>
        <div>
            <AiOutlineGift className='ic'/>
            <Typography.Text className='ct date'>{date}</Typography.Text>
        </div>
        <div className='phone'>
            <AiOutlinePhone className='ic'/>
            <Typography.Text className='ct phone1'>{telephone}</Typography.Text>
        </div>
        <div>
            <AiFillHome className='ic'/>
            <Typography.Text className='ct liveAt'>{liveAt}</Typography.Text>
        </div>
        <div>
            <MdOutlineSchool className='ic'/>
            <Typography.Text className='ct studyAt'>{studyAt}</Typography.Text>
        </div>
        <div>
            <MdOutlineWork className='ic'/>
            <Typography.Text className='ct workAt'>{workAt}</Typography.Text>
        </div>

    </WrapperStyled>
  )
}
