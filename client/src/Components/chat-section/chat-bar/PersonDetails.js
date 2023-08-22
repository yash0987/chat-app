import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emptyChat, updateChat } from './../../../features/chat-slice/chatSlice';
import { setTogglesToDefault } from '../../../features/toggle-slice/toggleSlice';
import backButton from './../../../img/backButton.png';
import { ws } from '../websocket';

export default function PersonDetails(props) {
  const user = useSelector(state => state.auth.value.user);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const displayStarredMessages = useSelector(state => state.toggle.value.showStarredMessages);
  const dispatch = useDispatch();

  function closeChat() {
    props.setToggle('showSearch');
    ws.send(JSON.stringify({ action: 'leave', sender: user.googleID, receiver: props.secondPerson.ID }));
    dispatch(emptyChat());
  }

  function resetChatOrCloseChat() {
    if (toggleFeaturesState || displayStarredMessages) {
      if (displayStarredMessages) {
        props.getChat().then((data) => {
          dispatch(updateChat(data))
        })
      }
      dispatch(setTogglesToDefault());
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
          <img src={ props.secondPerson.photoURL } alt="" className='mx-4 my-2 w-12 rounded-full' />
          <p className='my-4 font-semibold text-lg'>{ props.secondPerson.fullName }</p>
        </div> : null
      }
      { displayStarredMessages ? <p className='m-4 font-semibold text-lg'>Starred Messages</p> : null }
    </div>
  )
}
