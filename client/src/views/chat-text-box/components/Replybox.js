import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { replyMessageToggle } from 'features/toggle-slice/toggleSlice';
import { reply } from 'features/reply-slice/replySlice';

export default function Replybox() {
  const showReplyMessage = useSelector(state => state.toggle.value.replyMessage);
  const replyToMessage = useSelector(state => state.reply.value);
  const dispatch = useDispatch();

  function cancelReply() {
    dispatch(replyMessageToggle(false));
    dispatch(reply({
      replyToPerson: null,
      replyForMessage: null,
      repliedMessageID: null
    }));
  }

  return (
    showReplyMessage ?
    <div className='w-[94%] px-3 py-1 rounded text-gray-700 bg-white absolute bottom-[50px]'>
      <div className='w-full flex justify-between'>
        <p className='font-thin text-sm'>Replying to <span className='font-semibold'>{ replyToMessage.replyToPerson }</span></p>
        <button onClick={ () => cancelReply() } className='text-gray-700 rounded-full'>&#215;</button>
      </div>
    </div> : null
  )
}
