import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SentMessageBox from './SentMessageBox';
import ReceivedMessageBox from './ReceivedMessageBox';
import { featuresToggle } from '../../features/toggle-slice/toggleSlice';

export default function Message(props) {
  const scroll = useRef(null);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const dispatch = useDispatch();

  useEffect(() => {
    scroll.current.scrollIntoView( { behavior: 'smooth' } );
  }, [props.elementArray.length])

  useEffect(() => {
    if (!selectedMessagesList.length) dispatch(featuresToggle(false));
    // eslint-disable-next-line
  }, [selectedMessagesList.length])

  let keyValue = 0;
  return (
    <div className='flex flex-col justify-end px-5 h-full overflow-y-scroll'>
      <div className='overflow-y-scroll'>{
        props.elementArray.map((element) => {
          keyValue++;
          if (element.senderID === props.googleID) {
            return <SentMessageBox key={keyValue} star={props.star} setStar={props.setStar} element={element} />;
          }
          return <ReceivedMessageBox key={keyValue} star={props.star} setStar={props.setStar} element={element} />;
        })
      }
      <div ref={ scroll }></div>
      </div>
    </div>
  )
}
