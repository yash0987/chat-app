import React, { useState } from 'react';
import FriendRequests from './friend-requests/FriendRequests';
import GroupSection from './groups/GroupSection';
import AllFriendsSection from './all-friends/AllFriendsSection';

export default function FriendList(props) {  
  const [block, setBlock] = useState(1);

  function setFriendsList(event) {
    event.target.className = 'bg-violet-300 px-5 py-2 rounded-lg'
    event.target.nextElementSibling.className = 'px-5 py-2 rounded-lg hover:bg-violet-200';
    event.target.parentElement.lastElementChild.className = 'px-5 py-2 rounded-lg hover:bg-violet-200';
    setBlock(1);
  }
  
  function setGroupList(event) {
    event.target.previousElementSibling.className = 'px-5 py-2 rounded-lg hover:bg-violet-200';
    event.target.className = 'bg-violet-300 px-5 py-2 rounded-lg';
    event.target.nextElementSibling.className = 'px-5 py-2 rounded-lg hover:bg-violet-200';
    setBlock(2);
  }

  function setFriendRequests(event) {
    event.target.parentElement.firstElementChild.className = 'px-5 py-2 rounded-lg hover:bg-violet-200';
    event.target.previousElementSibling.className = 'px-5 py-2 rounded-lg hover:bg-violet-200';
    event.target.className = 'bg-violet-300 px-5 py-2 rounded-lg';
    setBlock(3);
  }
 
  return (
    <section className='h-[91vh] border-l-[1px] border-l-violet-700 font-semibold bg-violet-50'>
      <input type="search" name="" id="" placeholder='Search friends' className='my-4 mx-9 px-5 py-1 w-[85%] rounded-sm bg-violet-50 border-[1px] border-b-[3px] border-violet-500 font-normal focus:outline-none placeholder:text-violet-400' />
      <div className='mb-4 flex justify-evenly'>
        <button onClick={setFriendsList} id="allFriends" className='bg-violet-300 px-5 py-2 rounded-lg'>All friends</button>
        <button onClick={setGroupList} id="groups" className='px-5 py-2 rounded-lg hover:bg-violet-200'>Groups</button>
        <button onClick={setFriendRequests} id="friendRequests" className='px-5 py-2 rounded-lg hover:bg-violet-200'>Friend Requests</button>
      </div>
      <div>{
          block === 1 ? (<AllFriendsSection setOldChatPerson={props.setOldChatPerson} secondPerson={props.secondPerson} setSecondPerson={props.setSecondPerson} setToggle={props.setToggle} />) :
          block === 2 ? (<GroupSection setToggle={props.setToggle} />) : (<FriendRequests />)
      }</div>
    </section>
  )
}
