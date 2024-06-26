import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startNewChat } from 'features/chatinfo-slice/chatInfoSlice';
import { emptyChat } from 'features/chat-slice/chatSlice';
import { unselectAllMessages } from 'features/select-message-slice/selectMessageSlice';
import { replyMessageToggle } from 'features/toggle-slice/toggleSlice';

export default function Chatbox(props) {
  const theme = useSelector(state => state.theme.value);
  const newChat = useSelector(state => state.chatinfo.value.newChat);
  const dispatch = useDispatch();

  function openChat() {
    const ID = props.chat._id;
    const fullName = props.chat.name;
    const photoURL = props.chat.photoURL;
    const isGroup = props.chat.isGroup;
    if (newChat.ID === ID) return ;
    console.log(ID, fullName, photoURL, isGroup);
    dispatch(startNewChat({ ID, fullName, photoURL, isGroup }));
    dispatch(unselectAllMessages());
    dispatch(replyMessageToggle(false));
    dispatch(emptyChat());
  }

  return (
    <Link to={props.route} onClick={() => openChat()} className={`flex justify-between mx-2 p-2 rounded-lg font-semibold ${theme.hoverBg200}`}>
      <div className='grid grid-flow-col'>
        <img src={ props.chat.photoURL } alt="" className='size-10 rounded-full object-cover' />
        <div className='mx-4'>
          <p>{ props.chat.name }</p>
          <p className='text-[10px] text-gray-400'>{ props.chat._id }</p>
        </div>
      </div>
    </Link>
  )
}
