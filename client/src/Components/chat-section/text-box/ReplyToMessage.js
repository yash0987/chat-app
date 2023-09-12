import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { replyMessageToggle } from '../../../features/toggle-slice/toggleSlice';

export default function ReplyToMessage() {
  const user = useSelector(state => state.auth.value.user);
  const replyMessageToggleState = useSelector(state => state.toggle.value.replayMessage);
  const dispatch = useDispatch();
  console.log("this is reply message")
  console.log(replyMessageToggleState);

  return (
    replyMessageToggleState ?
    <div className='bg-white p-2'>
      <div className='border-l-4 border-pink-500 bg-gray-100 w-full p-2 rounded'>
        <div className='flex justify-between'>     
          <p className='text-pink-500 '>{ user.firstName + " " + user.familyName }</p>
          <button onClick={ () => dispatch(replyMessageToggle(false)) } className='text-gray-700 relative -top-1 left-1 rounded-full hover:bg-gray-200 px-2'>&#215;</button>
        </div>
        <p className='text-gray-500'>reply To Message</p>
      </div>
    </div> 
    : null
  )
}
