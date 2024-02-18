import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emptyChat, updateChat } from './../../../features/chat-slice/chatSlice';
import { unselectAllMessages } from '../../../features/select-message-slice/selectMessageSlice';
import { setTogglesToDefault } from '../../../features/toggle-slice/toggleSlice';
import { ws } from '../websocket';
import backButton from './../../../img/backButton.png';

export default function PersonDetails(props) {
  const user = useSelector(state => state.auth.value.user);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const displayStarredMessages = useSelector(state => state.toggle.value.showStarredMessages);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const newChat = useSelector(state => state.chatinfo.value.newChat);
  const dispatch = useDispatch();

  function closeChat() {
    ws.send(JSON.stringify({ action: 'leave', senderID: user.googleID, receiverID: newChat.ID }));
    dispatch(setTogglesToDefault());
    dispatch(emptyChat());
  }
  
  function resetChatOrCloseChat() {
    if (toggleFeaturesState && displayStarredMessages) {
      dispatch(unselectAllMessages());
    }
    else if (toggleFeaturesState || displayStarredMessages) {
      if (displayStarredMessages) {
        props.getChat().then((data) => {
          dispatch(updateChat(data));
        })
        dispatch(setTogglesToDefault());
      }
      dispatch(unselectAllMessages());
    }
    else closeChat();
  }

  return (
    <div className='grid grid-flow-col'>
      <button onClick={ () => resetChatOrCloseChat() }>
        <img src={ backButton } alt="" className='w-5 rounded-full' />
      </button>
      {
        !toggleFeaturesState && !displayStarredMessages ? <div className='grid grid-flow-col place-items-center'>
          <img src={ newChat.photoURL } alt="" className='mx-3 size-8 rounded-full object-cover' />
          <p className='font-semibold'>{ newChat.fullName }</p>
        </div> : null
      }
      { displayStarredMessages ? <p className='mx-5 my-2 font-semibold'>Starred Messages</p> : null }
      { toggleFeaturesState ? <p className='mx-5 my-2 fount-semibold'>{ selectedMessagesList.length }</p> : null }
    </div>
  )
}
