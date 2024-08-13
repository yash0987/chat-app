import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateChat } from 'features/chat-slice/chatSlice';
import { showDeleteModal } from 'features/modal-slice/modalSlice';
import { unselectAllMessages } from 'features/select-message-slice/selectMessageSlice';
import { fetchRequest } from 'utils/fetchRequest';

export default function DeleteForMeModal(props) {
  const chat = useSelector(state => state.chat.value);
  const deleteModalState = useSelector(state => state.modal.value[0]);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const theme = useSelector(state => state.theme.value);
  const location = useLocation();
  const dispatch = useDispatch();

  console.log(selectedMessagesList);

  async function deleteForMe() {
    let remainingMessages = chat;
    selectedMessagesList.forEach((elementToRemove) => {
      remainingMessages = remainingMessages.filter((element) => element.messageID !== elementToRemove);
    })
    
    const deleteMessageRequestURI = location.pathname.slice(0, 7) === '/groups' ? 
    'http://localhost:5000/group/delete/messages' : 'http://localhost:5000/delete/messages';
    
    const data = await fetchRequest({ url: deleteMessageRequestURI, method: 'DELETE', body: { selectedMessages: selectedMessagesList, room: props.room } });
    dispatch(updateChat(remainingMessages));
    dispatch(showDeleteModal(false));
    dispatch(unselectAllMessages());
    console.log(data);
  }

  return (
    deleteModalState ?
    <section className='grid place-items-center w-screen h-screen fixed top-0 left-0 bg-black/20 text-slate-700 font-semibold'>
      <div className='w-[27%] rounded-sm bg-violet-50'>
        <h3 className='pt-4 px-4 text-lg'>Delete Message</h3> 
        <p className='pb-4 px-4'>Are you sure you want to delete this message?</p>

        <div className={`p-4 flex justify-end text-sm ${theme.bg100}`}>
          <button onClick={() => dispatch(showDeleteModal(false))} className='px-6 py-2'>Cancel</button>
          <button onClick={() => deleteForMe()} className='px-6 py-2 rounded-sm bg-red-500 text-white'>Delete</button>
        </div>
      </div>
    </section> : null
  )
}
