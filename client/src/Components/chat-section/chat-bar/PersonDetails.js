import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emptyChat } from './../../features/chat-slice/chatSlice';
import backButton from './../../img/backButton.png';

export default function PersonDetails(props) {
  const user = useSelector(state => state.auth.value.user);
  const dispatch = useDispatch();

  function closeChat() {
    props.setToggle('showSearch');
    props.ws.send(JSON.stringify({ action: 'leave', sender: user.googleID, receiver: props.secondPerson.ID }));
    dispatch(emptyChat());
  }

  return (
    <div className='flex'>
      <button onClick={ () => props.deleteToggle ? props.setDeleteToggle(false) : closeChat() }>
        <img src={ backButton } alt="" className='m-2 p-2 w-9 rounded-full' />
      </button>
      {
        !props.deleteToggle ?  <div className='flex'>
          <img src={ props.secondPerson.photoURL } alt="" className='mx-4 my-2 w-12 rounded-full' />
          <p className='my-4 font-semibold text-lg'>{ props.secondPerson.fullName }</p>
        </div> : null
      }
    </div>
  )
}
