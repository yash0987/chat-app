import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { emptyChat } from '../../../features/chat-slice/chatSlice';
import { unselectAllMessages } from '../../../features/select-message-slice/selectMessageSlice';
import { replyMessageToggle, starMessagesToggle } from '../../../features/toggle-slice/toggleSlice';
import { startNewChat } from '../../../features/chatinfo-slice/chatInfoSlice';

export default function Group(props) {
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  function openChat() {
    console.log(props.groupInfo);
    const ID = props.groupInfo.groupID;
    const fullName = props.groupInfo.groupName;
    const photoURL = props.groupInfo.groupPhotoURL;
    dispatch(startNewChat({ ID, fullName, photoURL, isGroup: true }));
    dispatch(unselectAllMessages());
    dispatch(starMessagesToggle(false));
    dispatch(replyMessageToggle(false));
    dispatch(emptyChat());
  }

  return (
    <Link to={`/groups/${props.groupInfo.groupID}`} onClick={() => openChat()} className={`flex justify-between mx-2 px-6 py-2 rounded-lg font-semibold ${theme.hoverBg100}`}>
      <div className='flex'>
        <img src={ props.groupInfo.groupPhotoURL } alt="" className='w-10 rounded-full' />
        <div className='mx-4'>
          <p>{ props.groupInfo.groupName }</p>
          <p className='text-[10px] text-gray-400'>{ props.groupInfo.groupID }</p>
        </div>
      </div>
    </Link>
  )
}
