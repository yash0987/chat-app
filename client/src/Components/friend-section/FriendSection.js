import React, { useState } from 'react';
import LogoutBar from './LogoutBar';
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
    <section className='m-2 w-[30rem] h-[95.5vh] rounded font-semibold bg-violet-50'>
      <LogoutBar />
      <div className='mb-4 flex justify-evenly'>
        <button onClick={setFriendsList} id="allFriends" className='bg-violet-300 px-5 py-2 rounded-lg'>All friends</button>
        <button onClick={setGroupList} id="groups" className='px-5 py-2 rounded-lg hover:bg-violet-200'>Groups</button>
        <button onClick={setFriendRequests} id="friendRequests" className='px-5 py-2 rounded-lg hover:bg-violet-200'>Friend Requests</button>
      </div>
      <div>
        {
          block === 1 ? (<AllFriendsSection setSecondPerson={props.setSecondPerson} setToggle={props.setToggle} />) :
          block === 2 ? (<GroupSection setToggle={props.setToggle} />) : (<FriendRequests />)
        }
      </div>
    </section>
  )
}
