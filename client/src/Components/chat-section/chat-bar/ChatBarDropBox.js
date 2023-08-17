import React, { useRef } from 'react';
import menu from './../../img/menu.png';

export default function ChatBarDropBox(props) {
  const dropboxRef = useRef(null);

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
        !props.deleteToggle ?
        <img onClick={ openDropBox } src={ menu } id='dropboxBtn' alt="" className='my-2 h-12 rounded-full hover:bg-violet-400' /> 
        : null
      }
      <ul ref={ dropboxRef } className='absolute top-[5rem] right-[42.7%] z-10 shadow-lg bg-white text-black' style={{ display: 'none' }}>
        <li onClick={ () => props.setToggle('showProfile') } className='px-4 py-2 hover:bg-violet-100'>Profile</li>
        <li onClick={ () => props.setDeleteToggle(true) } className='px-4 py-2 hover:bg-violet-100'>Select messages</li>
      </ul>
    </>
  )
}
