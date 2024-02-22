import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateChat } from '../../features/chat-slice/chatSlice';
import { showDeleteModal } from '../../features/modal-slice/modalSlice';
import { unselectAllMessages } from '../../features/select-message-slice/selectMessageSlice';

export default function DeleteForMeModal(props) {
  const chat = useSelector(state => state.chat.value);
  const deleteModalState = useSelector(state => state.modal.value[0]);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const theme = useSelector(state => state.theme.value);
  const isGroup = useSelector(state => state.chatinfo.value.newChat.isGroup);
  const dispatch = useDispatch();

  console.log(selectedMessagesList);

  async function deleteForMe() {
    let remainingMessages = chat;
    selectedMessagesList.forEach((elementToRemove) => {
      remainingMessages = remainingMessages.filter((element) => element.messageID !== elementToRemove);
    })
    dispatch(updateChat(remainingMessages))
    dispatch(unselectAllMessages());
    dispatch(showDeleteModal(false));

    const deleteMessageRequestURI = isGroup ? `http://localhost:5000/group/delete/messages?selectedMessages=${JSON.stringify(selectedMessagesList)}&ID=${props.room}` :
    `http://localhost:5000/delete/messages?selectedMessages=${JSON.stringify(selectedMessagesList)}&ID=${props.room}`;
    const response = await fetch(deleteMessageRequestURI, {
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

  return (
    deleteModalState && selectedMessagesList.length > 0 ?
    <section className='flex justify-center py-80 w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-20'>
      <div className='p-5 w-1/5 h-28 rounded-sm bg-violet-50'>
        <p>{ selectedMessagesList.length < 2 ? `Delete message?` : `Delete ${selectedMessagesList.length} messages?` }</p>
        <div className={`${theme.text600}`}>
          <button onClick={ () => deleteForMe() } className='flex justify-end'>Delete for me</button>
          <button onClick={ () => dispatch(showDeleteModal(false)) }>Cancel</button>
        </div>
      </div>
    </section> : null
  )
}
