import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateChat } from '../../features/chat-slice/chatSlice';
import { showDeleteModal } from './../../features/modal-slice/modalSlice';
import { unselectAllMessages } from '../../features/select-message-slice/selectMessageSlice';

export default function DeleteMessage(props) {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const chat = useSelector(state => state.chat.value);
  const dispatch = useDispatch();

  async function deleteMessages() {
    let remainingMessages = chat;
    selectedMessagesList.forEach((elementToRemove) => {
      remainingMessages = remainingMessages.filter((element) => element.messageID !== elementToRemove);
    })
    dispatch(updateChat(remainingMessages))
    dispatch(unselectAllMessages());
    props.setDeleteToggle(false);

    const response = await fetch(`http://localhost:5000/delete/messages?selectedMessages=${JSON.stringify(selectedMessagesList)}&ID=${props.room}`, {
      method: 'DELETE',
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    });

    const data = await response.json();
    console.log(data);
  }

  function deleteForMe() {
    deleteMessages();
    props.setDeleteToggle(false);
    dispatch(showDeleteModal());
  }
  
  return (
    <section className='flex justify-center py-80 w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-20'>
      <div className='p-5 w-1/5 rounded-sm bg-violet-50'>
        <p>{ selectedMessagesList.length < 2 ? `Delete message?` : `Delete ${selectedMessagesList.length} messages?` }</p>
        <div className='text-violet-600'>
          <button onClick={ () => deleteForMe() } className='flex justify-end'>Delete for me</button>
          <button onClick={ () => dispatch(showDeleteModal()) }>Cancel</button>
        </div>
      </div>
    </section>
  )
}
