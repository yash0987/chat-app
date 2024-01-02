import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FriendRequests from './friend-requests/FriendRequests';
import GroupSection from './groups/GroupSection';
import AllFriendsSection from './all-friends/AllFriendsSection';
import personIcon from './../../img/personw.png';
import groupIcon from './../../img/groupw.png';
import inboxIcon from './../../img/inbox.png';

export default function FriendList(props) {  
  const theme = useSelector(state => state.theme.value);
  const [block, setBlock] = useState(1);
  const style = {
    activeBtn: `${theme.bg500} ${theme.hoverBg600} w-12 rounded-2xl transition-all duration-200`,
    inactiveBtn: `${theme.bg400} ${theme.hoverBg500} w-12 rounded-full hover:rounded-2xl hover:transition-all hover:duration-200 transition-all duration-200`
  }

  const [buttonStyle, setbuttonStyle] = useState({
    first: style.activeBtn,
    second: style.inactiveBtn,
    third: style.inactiveBtn
  });

  function setFriendsList() {
    setbuttonStyle({
      first: style.activeBtn,
      second: style.inactiveBtn,
      third: style.inactiveBtn
    });
    setBlock(1);
  }
  
  function setGroupList() {
    setbuttonStyle({
      first: style.inactiveBtn,
      second: style.activeBtn,
      third: style.inactiveBtn
    });
    setBlock(2);
  }

  function setFriendRequests() {
    setbuttonStyle({
      first: style.inactiveBtn,
      second: style.inactiveBtn,
      third: style.activeBtn
    });
    setBlock(3);
  }
 
  return (
    <section className='grid grid-flow-col'>
      <div className={`h-[91vh] border-l-[1px] ${theme.borderL700} font-semibold ${theme.bg50}`}>
        <div className='min-w-[27rem]'>{
          block === 1 ? (<AllFriendsSection setOldChatPerson={props.setOldChatPerson} secondPerson={props.secondPerson} setSecondPerson={props.setSecondPerson} setToggle={props.setToggle} />) :
          block === 2 ? (<GroupSection setToggle={props.setToggle} setOldChatPerson={props.setOldChatPerson} secondPerson={props.secondPerson} setSecondPerson={props.setSecondPerson} />) : 
          (<FriendRequests />)
        }</div>
      </div>
      <div className='grid grid-flow-row grid-rows-10 my-2 ml-2'>
        <button onClick={() => setFriendsList()} className='flex items-center justify-between' id='firstbtn'>
          <img src={personIcon} alt="" className={buttonStyle.first} />
          <div className={`${block === 1? `h-[2rem] ${theme.bg600}`:`h-[7px] ${theme.bg500}`} my-1 w-[5px] rounded-l-full animation-bar`}></div>
        </button>
        <button onClick={() => setGroupList()} className='flex items-center justify-between' id='secondbtn'>
          <img src={groupIcon} alt="" className={buttonStyle.second} />
          <div className={`${block === 2? `h-[2rem] ${theme.bg600}`:`h-[7px] ${theme.bg500}`} my-1 w-[5px] rounded-l-full animation-bar`}></div>
        </button>
        <button onClick={() => setFriendRequests()} className='flex items-center justify-between' id='thirdbtn'>
          <img src={inboxIcon} alt="" className={buttonStyle.third} />
          <div className={`${block === 3? `h-[2rem] ${theme.bg600}`:`h-[7px] ${theme.bg500}`} my-1 w-[5px] rounded-l-full animation-bar`}></div>
        </button>
      </div>
    </section>
  )
}
