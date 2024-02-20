import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SentMessageBox from './SentMessageBox';
import ReceivedMessageBox from './ReceivedMessageBox';
import { featuresToggle } from '../../features/toggle-slice/toggleSlice';

export default function Message(props) {
  const scroll = useRef(null);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const dispatch = useDispatch();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function currentTime(timeEpoch) {
    const date = new Date(timeEpoch);
    let day = date.getDay();
    let dd = date.getDate(), mm = date.getMonth(), yy = date.getFullYear();
    let hours = date.getHours(), minutes = date.getMinutes();
    
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    let strTime = `${weekDays[day]}, ${dd} ${months[mm]} ${yy} ${hours}:${minutes} ${ampm}`;
    return strTime;
  }

  function fileSize(dataSize) {
    let count = 0;
    let bytes = Number(dataSize);
    while (bytes > 1024) {
      bytes /= 1024;
      count++;
    }

    const unitOfDigits = ['B', 'kB', 'MB', 'GB'];
    return `${bytes.toFixed(1)} ${unitOfDigits[count]}`;
  }

  useEffect(() => {
    scroll.current.scrollIntoView( { behavior: 'smooth' } );
  }, [props.elementArray.length])

  useEffect(() => {
    if (!selectedMessagesList.length) dispatch(featuresToggle(false));
    // eslint-disable-next-line
  }, [selectedMessagesList.length])

  return (
    <div className='flex flex-col justify-end px-8 h-full overflow-y-scroll'>
      <div className='overflow-y-scroll'>{
        props.elementArray.map((element) => {
          if (element.senderID === props.googleID) {
            return <SentMessageBox key={element.messageID} star={props.star} setStar={props.setStar} currentTime={currentTime} fileSize={fileSize} element={element} />;
          }
          return <ReceivedMessageBox key={element.messageID} star={props.star} setStar={props.setStar} currentTime={currentTime} fileSize={fileSize} element={element} />;
        })
      }
      <div ref={ scroll }></div>
      </div>
    </div>
  )
}
