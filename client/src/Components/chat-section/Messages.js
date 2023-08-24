import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import SenderMsg from './SenderMsg';
import ReceiverMsg from './ReceiverMsg';

export default function Message(props) {
  const scroll = useRef(null);
  const chat = useSelector(state => state.chat.value);

  useEffect(() => {
    scroll.current.scrollIntoView( { behavior: 'smooth' } );
  }, [chat.length])

  let keyValue = 0;
  return (
    <div className='flex flex-col justify-end px-5 h-full overflow-y-scroll'>
      <div className='overflow-y-scroll'>{
        props.elementArray.map((element) => {
          keyValue++;
          if (element.sender === props.googleID) {
            return <SenderMsg key={keyValue} star={props.star} setStar={props.setStar} element={element} />;
          }
          return <ReceiverMsg key={keyValue} star={props.star} setStar={props.setStar} element={element} />;
        })
      }
      <div ref={ scroll }></div>
      </div>
    </div>
  )
}
