import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { emptyChat } from 'features/chat-slice/chatSlice';
import { unselectAllMessages } from 'features/select-message-slice/selectMessageSlice';
import { replyMessageToggle } from 'features/toggle-slice/toggleSlice';

export default function Chatbox(props) {
  const theme = useSelector(state => state.theme.value);
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const chatType = location.pathname.slice(0, 7) === '/groups' ? 'group' : 'private';
  
  function openChat() {
    if (params.id === props.chat._id) return ;
    dispatch(unselectAllMessages());
    dispatch(replyMessageToggle(false));
    dispatch(emptyChat());
  }

  return (
    <Link to={props.route} state={{ _id: chatType === 'group' ? props.chat._id : props.chat.personalId }} onClick={() => openChat()} className={`flex justify-between mx-2 p-2 rounded-lg font-semibold ${theme.hoverBg200}`}>
      <div className='grid grid-flow-col'>
        <img src={ props.chat.photoURL } alt="" className='size-10 rounded-full object-cover' />
        <div className='mx-4'>
          <p>{ props.chat.name }</p>
          <p className='text-[10px] text-gray-400'>{ chatType === 'group' ? props.chat._id : props.chat.personalId }</p>
        </div>
      </div>
    </Link>
  )
}
