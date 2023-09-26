import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emptyChat } from './../../../features/chat-slice/chatSlice';
import { unselectAllMessages } from '../../../features/select-message-slice/selectMessageSlice';
import { replyMessageToggle, starMessagesToggle } from '../../../features/toggle-slice/toggleSlice';

export default function Friend(props) {
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  function openChat(event) {
    const ID = props.friendInfo.googleID;
    const fullName = props.friendInfo.fullName;
    const photoURL = props.friendInfo.photoURL;
    console.log({ID, fullName, photoURL})
    props.setOldChatPerson(props.secondPerson);
    props.setSecondPerson( { ID, fullName, photoURL } );
    props.setToggle('showChatSection');
    dispatch(unselectAllMessages());
    dispatch(starMessagesToggle(false));
    dispatch(replyMessageToggle(false));
    dispatch(emptyChat());
  }

  return (
    <section onClick={openChat} className={`flex justify-between mx-2 px-6 py-2 rounded-lg font-semibold ${theme.hoverBg100}`}>
      <div className='flex'>
        <img src={ props.friendInfo.photoURL } alt="" className='w-10 rounded-full' />
        <div className='mx-4'>
          <p>{ props.friendInfo.fullName }</p>
          <p className='text-[10px] text-gray-400'>{ props.friendInfo.googleID }</p>
        </div>
      </div>
    </section>
  )
}
