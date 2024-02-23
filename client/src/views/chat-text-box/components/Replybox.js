import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { replyMessageToggle } from '../../../features/toggle-slice/toggleSlice';

export default function Replybox() {
  const showReplyMessage = useSelector(state => state.toggle.value.replyMessage);
  const reply = useSelector(state => state.reply.value);
  const dispatch = useDispatch();

  return (
    showReplyMessage ?
    <div className='w-[94%] rounded-lg bg-white p-2'>
      <div className='border-l-4 border-pink-500 bg-gray-100 w-full p-2 rounded'>
        <div className='flex justify-between'>     
          <p className='text-pink-500 '>{ reply.replyToPerson }</p>
          <button onClick={ () => dispatch(replyMessageToggle(false)) } className='text-gray-700 relative -top-1 left-1 rounded-full hover:bg-gray-200 px-2'>&#215;</button>
        </div>
        <p className='whitespace-pre-wrap break-words text-gray-500'>{ reply.replyForMessage }</p>
      </div>
    </div> : null
  )
}
