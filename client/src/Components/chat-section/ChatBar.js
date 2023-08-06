import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import backButton from './../../img/backButton.png';
import menu from './../../img/menu.png';
import trash from './../../img/trash.png';
import unstar from './../../img/unstar.png';
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
    <section className={`flex justify-between px-3 w-full ${props.deleteToggle ? 'bg-violet-500 saturate-[.80]' : 'bg-violet-400'} text-white`}>
      <div className='flex'>
        <button onClick={ () => props.deleteToggle ? props.setDeleteToggle(false) : closeChat() }>
          <img src={ backButton } alt="" className='m-2 p-2 w-9 rounded-full' />
        </button>
        { !props.deleteToggle ?  <div className='flex'>
            <img src={ props.secondPerson.photoURL } alt="" className='mx-4 my-2 w-12 rounded-full' />
            <p className='my-4 font-semibold text-lg'>{ props.secondPerson.fullName }</p>
          </div> : null }
      </div>

      <div className='mx-2 my-3 flex'>
        { props.deleteToggle ? (<div className='flex'>
          {
            props.star ? <span onClick={ () => props.starAndUnstarMessage() } className='mx-1 px-2 text-3xl rounded-full hover:bg-violet-400'>&#9733;</span> : 
            <img onClick={ () => props.starAndUnstarMessage() } src={unstar} alt="" className='mx-1 w-10 rounded-full hover:bg-violet-400' />
          }
          <img onClick={ () => props.setShowDeleteModal(true) } src={ trash } alt="" className='mx-1 w-10 rounded-full hover:bg-violet-400' />
          <span onClick={ () => props.setDeleteToggle(false) } className='px-[10px] text-3xl rounded-full hover:bg-violet-400'>&times;</span>
        </div>) :
        <img onClick={ openDropBox } src={ menu } id='dropboxBtn' alt="" className='w-10 rounded-full hover:bg-violet-400' /> }
      </div>

      <ul ref={ dropboxRef } className='absolute top-[5rem] right-[42.7%] z-10 shadow-lg bg-white text-black' style={{ display: 'none' }}>
        <li onClick={ openProfile } className='px-4 py-2 hover:bg-violet-100'>Profile</li>
        <li onClick={ () => props.setDeleteToggle(true) } className='px-4 py-2 hover:bg-violet-100'>Select messages</li>
      </ul>
    </section>
  )
}
