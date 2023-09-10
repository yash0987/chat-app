import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SenderMsg from './SenderMsg';
import ReceiverMsg from './ReceiverMsg';
import { toggleFeatures } from '../../features/toggle-slice/toggleSlice';

export default function Message(props) {
  const scroll = useRef(null);
  const chat = useSelector(state => state.chat.value);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const dispatch = useDispatch();

  useEffect(() => {
    scroll.current.scrollIntoView( { behavior: 'smooth' } );
  }, [chat.length])

  useEffect(() => {
    if (!selectedMessagesList.length) dispatch(toggleFeatures());
    // eslint-disable-next-line
  }, [selectedMessagesList.length])

  let keyValue = 0;
  return (
    <div className='flex flex-col justify-end px-5 h-full overflow-y-scroll'>
      <div className='overflow-y-scroll'>{
        props.elementArray.map((element) => {
          keyValue++;
          if (element.senderID === props.googleID) {
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
