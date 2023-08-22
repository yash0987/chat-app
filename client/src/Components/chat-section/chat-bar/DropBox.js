import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import menu from './../../../img/menu.png';
import { updateChat } from '../../../features/chat-slice/chatSlice';
import { showStarredMessages, toggleFeatures } from '../../../features/toggle-slice/toggleSlice';

export default function DropBox(props) {
  const dropboxRef = useRef(null);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const displayStarredMessages = useSelector(state => state.toggle.value.showStarredMessages);
  const dispatch = useDispatch();

  async function getStarredMessages() {
    const getStarredMessagesRequestURI = `http://localhost:5000/starred/messages?ID=${props.room}`;
    const response = await fetch(getStarredMessagesRequestURI, {
      method: 'GET',
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })

    const data = await response.json();
    dispatch(updateChat(data));
    dispatch(showStarredMessages());
    console.log(data);
  }

  function openDropBox() {
    let dropbox = dropboxRef.current.style.display;
    if (dropbox === 'block') dropboxRef.current.style.display = 'none';
    else dropboxRef.current.style.display = 'block';
  }

  window.onclick = function(event) {
    if (!event.target.matches('#dropboxBtn')) {
      dropboxRef.current.style.display = 'none';
    }
  }
  
  return (
    <>
      {
        !toggleFeaturesState ?
        <img onClick={ openDropBox } src={ menu } id='dropboxBtn' alt="" className='my-2 h-12 rounded-full hover:bg-violet-400' /> 
        : null
      }

      {
        !displayStarredMessages ? 
        <ul ref={ dropboxRef } className='absolute top-[5rem] right-[42.7%] z-10 shadow-lg bg-white text-black' style={{ display: 'none' }}>
          <li onClick={ () => props.setToggle('showProfile') } className='px-4 py-2 hover:bg-violet-100'>Profile</li>
          <li onClick={ () => dispatch(toggleFeatures()) } className='px-4 py-2 hover:bg-violet-100'>Select messages</li>
          <li onClick={ () => getStarredMessages() } className='px-4 py-2 hover:bg-violet-100'>Starred Messages</li>
          <li className='px-4 py-2 hover:bg-violet-100'>Disappearing messages</li>
          <li className='px-4 py-2 hover:bg-violet-100'>Wallpaper</li>
          <li className='px-4 py-2 hover:bg-violet-100'>More</li>
        </ul>
        : <ul ref={ dropboxRef } className='absolute top-[5rem] right-[42.7%] z-10 shadow-lg bg-white text-black' style={{ display: 'none' }}>
            <li onClick={ () => dispatch(toggleFeatures()) } className='px-4 py-2 hover:bg-violet-100'>Select messages</li>
          </ul>
      }
    </>
  )
}
