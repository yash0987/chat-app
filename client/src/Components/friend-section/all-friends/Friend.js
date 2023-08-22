import React from 'react';
import { useDispatch } from 'react-redux';
import { emptyChat } from './../../../features/chat-slice/chatSlice';
import { setTogglesToDefault } from '../../../features/toggle-slice/toggleSlice';

export default function Friend(props) {
  const dispatch = useDispatch();

  function openChat(event) {
    const ID = props.friendInfo.googleID;
    const fullName = props.friendInfo.fullName;
    const photoURL = props.friendInfo.photoURL;
    console.log({ID, fullName, photoURL})
    props.setOldChatPerson(props.secondPerson);
    props.setSecondPerson( { ID, fullName, photoURL } );
    props.setToggle('showChatSection');
    dispatch(setTogglesToDefault());
    dispatch(emptyChat());
  }

  return (
    <section onClick={openChat} className='flex justify-between mx-1 px-6 py-2 rounded-lg font-semibold hover:bg-violet-100'>
      <div className='flex'>
          <img src={ props.friendInfo.photoURL } alt="" className='w-10 rounded-full' />
          <div className='mx-4'>
            <p>{ props.friendInfo.fullName }</p>
            <p className='text-[10px] text-gray-400'>{ props.friendInfo.googleID }</p>
          </div>
      </div>
      {/* <div>
          <button onClick={openChat} className='my-2 px-3 py-1 text-xs rounded border-[1px] border-gray-400'>Message</button>
      </div> */}
    </section>
  )
}
