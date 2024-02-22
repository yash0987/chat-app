import React from 'react';
import { useSelector } from 'react-redux';

export default function ReplyToMessage(props) {
  const theme = useSelector(state => state.theme.value);
  const user = useSelector(state => state.auth.value.user);

  return (
    props.element.replyToMessage ?
    <a href={`#${props.element.replyToMessage.repliedMessageID}`}>            
      <div className={`border-l-4 border-pink-500 w-full p-2 rounded text-sm ${props.element.senderID !== user.googleID ? theme.bg300 : 'bg-gray-100'}`}>
        <div className='flex justify-between'>
          <p className='text-pink-500'>{ props.element.replyToMessage.replyToPerson }</p>
        </div>
        <p className={`whitespace-pre-wrap break-words leading-tight ${props.element.senderID !== user.googleID ? 'text-white' : 'text-gray-500' }`}>{ props.element.replyToMessage.replyForMessage }</p>
      </div>
    </a> : null
  )
}
