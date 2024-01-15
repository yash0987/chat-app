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
    <div className='flex'>
      <button onClick={ () => resetChatOrCloseChat() }>
        <img src={ backButton } alt="" className='m-2 p-2 w-9 rounded-full' />
      </button>
      {
        !toggleFeaturesState && !displayStarredMessages ? <div className='flex'>
          <img src={ newChat.photoURL } alt="" className='mx-4 my-2 w-12 rounded-full' />
          <p className='my-4 font-semibold text-lg'>{ newChat.fullName }</p>
        </div> : null
      }
      { displayStarredMessages ? <p className='m-4 font-semibold text-lg'>Starred Messages</p> : null }
      { toggleFeaturesState ? <p className='m-4 fount-semibold text-xl'>{ selectedMessagesList.length }</p> : null }
    </div>
  )
}
