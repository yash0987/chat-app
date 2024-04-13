import React from 'react';
import { useSelector } from 'react-redux';

export default function ChatBar(props) {
  const theme = useSelector(state => state.theme.value);
  const newChat = useSelector(state => state.chatinfo.value.newChat);
  
  return (
    <section className={`px-8 py-1 relative flex justify-between text-white ${theme.bg400}`}>
      <div className='grid grid-flow-col'>
        <div className='grid grid-flow-col place-items-center'>
          <img src={ newChat.photoURL } alt="" className='mx-3 size-8 rounded-full object-cover' />
          <p className='font-semibold'>{ newChat.fullName }</p>
        </div>
      </div>
    </section>
  )
}
