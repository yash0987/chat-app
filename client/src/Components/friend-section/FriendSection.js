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
  const buttonStyle = {
    activeBtn: `${theme.bg400} rounded-3xl w-12 transition-all duration-200`,
    inactiveBtn: `${theme.bg400} rounded-full hover:rounded-3xl w-12 transition-all duration-200`
  }

  const [block, setBlock] = useState(1);
  const [firstBtnStyle, setFirstBtnStyle] = useState(buttonStyle.activeBtn);
  const [secondBtnStyle, setSeocndBtnStyle] = useState(buttonStyle.inactiveBtn);
  const [thirdBtnStyle, setThirdBtnStyle] = useState(buttonStyle.inactiveBtn);

  function setFriendsList() {
    setFirstBtnStyle(buttonStyle.activeBtn);
    setSeocndBtnStyle(buttonStyle.inactiveBtn);
    setThirdBtnStyle(buttonStyle.inactiveBtn);
    setBlock(1);
  }
  
  function setGroupList() {
    setFirstBtnStyle(buttonStyle.inactiveBtn);
    setSeocndBtnStyle(buttonStyle.activeBtn);
    setThirdBtnStyle(buttonStyle.inactiveBtn);
    setBlock(2);
  }

  function setFriendRequests() {
    setFirstBtnStyle(buttonStyle.inactiveBtn);
    setSeocndBtnStyle(buttonStyle.inactiveBtn);
    setThirdBtnStyle(buttonStyle.activeBtn);
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
      <div className='grid grid-flow-row grid-rows-10 m-2'>
        <button onClick={() => setFriendsList()} id="allFriends">
          <img src={personIcon} alt="" className={firstBtnStyle} />
        </button>
        <button onClick={() => setGroupList()} id="groups">
          <img src={groupIcon} alt="" className={secondBtnStyle} />
        </button>
        <button onClick={() => setFriendRequests()} id="friendRequests">
          <img src={inboxIcon} alt="" className={thirdBtnStyle} />
        </button>
      </div>
    </section>
  )
}
