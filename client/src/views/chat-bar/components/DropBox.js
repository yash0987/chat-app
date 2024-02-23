import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import menu from '../../../assets/menu.png';
import { updateChat } from '../../../features/chat-slice/chatSlice';
import { starMessagesToggle } from '../../../features/toggle-slice/toggleSlice';

export default function DropBox(props) {
  const dropboxRef = useRef(null);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const displayStarredMessages = useSelector(state => state.toggle.value.showStarredMessages);
  const theme = useSelector(state => state.theme.value);
  const isGroup = useSelector(state => state.chatinfo.value.newChat.isGroup);
  const dispatch = useDispatch();

  async function getStarredMessages() {
    const getStarredMessagesRequestURI = isGroup ? `http://localhost:5000/group/starred/messages?ID=${props.room}` :
    `http://localhost:5000/starred/messages?ID=${props.room}`;
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
    dispatch(starMessagesToggle(true));
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
        !toggleFeaturesState && !displayStarredMessages ?
        <img onClick={ openDropBox } src={ menu } id='dropboxBtn' alt="" className={`w-10 rounded-full ${theme.hoverBg400}`} /> 
        : null
      }

      <ul ref={ dropboxRef } className={`absolute top-12 right-0 z-10 shadow-lg ${theme.bg50} text-black`} style={{ display: 'none' }}>
        <li className={`px-4 py-2 ${theme.hoverBg100}`}>Profile</li>
        <li onClick={ () => getStarredMessages() } className={`px-4 py-2 ${theme.hoverBg100}`}>Starred Messages</li>
        <li className={`px-4 py-2 ${theme.hoverBg100}`}>Disappearing messages</li>
        <li className={`px-4 py-2 ${theme.hoverBg100}`}>Wallpaper</li>
        <li className={`px-4 py-2 ${theme.hoverBg100}`}>More</li>
      </ul>
    </>
  )
}