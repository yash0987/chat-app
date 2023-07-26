import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import backButton from './../../img/backButton.png';
import menu from './../../img/menu.png';
import trash from './../../img/trash.png';
import star from './../../img/star.png';
import close from './../../img/close.png';
import { CurrentUser } from './../../context/CurrentUserContext';
import { emptyChat } from './../../features/chat-slice/chatSlice';

export default function ChatBar(props) {
  const users = CurrentUser();
  const dropboxRef = useRef(null);
  const dispatch = useDispatch();

  function closeChat() {
    props.setToggle('showSearch');
    props.ws.send(JSON.stringify({ action: 'leave', sender: users.googleID, receiver: props.secondPerson.ID }));
    dispatch(emptyChat());
  }

  function openProfile() {
    props.setToggle('showProfile');
  }

  function openDropBox(event) {
    let dropbox = dropboxRef.current.style.display;
    if (dropbox === 'block') {
      dropboxRef.current.style.display = 'none';
    }
    else {
      dropboxRef.current.style.display = 'block';
    }
  }

  window.onclick = function(event) {
    if (!event.target.matches('#dropboxBtn')) {
      dropboxRef.current.style.display = 'none';
    }
  }

  return (
    <div className='flex justify-between px-3 w-full bg-violet-300 text-white'>
      <div className='flex'>
        <button onClick={ closeChat }>
          <img src={ backButton } alt="" className='m-2 p-2 w-9 rounded-full hover:bg-violet-400' />
        </button>
        <img src={ props.secondPerson.photoURL } alt="" className='mx-4 my-2 w-12 rounded-full' />
        <p className='my-4 font-semibold text-lg'>{ props.secondPerson.fullName }</p>
      </div>

      <div className='mx-2 my-3 flex'>
        { props.deleteToggle ? (<div className='flex'>
          <img src={ star } alt="" className='w-10 rounded-full hover:bg-violet-400' />
          <img onClick={ () => props.deleteMessages() } src={ trash } alt="" className='mx-2 w-10 rounded-full hover:bg-violet-400' />
          <img onClick={ () => props.setDeleteToggle(false)}  src={ close } alt="" className='w-10 rounded-full hover:bg-violet-400' />
        </div>) :
        <img onClick={ openDropBox } src={ menu } id='dropboxBtn' alt="" className='w-10 rounded-full hover:bg-violet-400' /> }
      </div>

      <ul ref={ dropboxRef } className='absolute top-[5rem] right-[42.7%] z-10 shadow-lg bg-white text-black' style={{ display: 'none' }}>
        <li onClick={ openProfile } className='px-4 py-2 hover:bg-violet-100'>Profile</li>
        <li onClick={() => props.setDeleteToggle(true)} className='px-4 py-2 hover:bg-violet-100'>Select messages</li>
      </ul>
    </div>
  )
}
