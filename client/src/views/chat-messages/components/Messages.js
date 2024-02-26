import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featuresToggle } from 'features/toggle-slice/toggleSlice';
import Messagebox from 'views/chat-messages/components/Messagebox';

export default function Message(props) {
  const scroll = useRef(null);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  function currentTime(timeEpoch) {
    const date = new Date(timeEpoch);
    let day = date.getDay();
    let dd = date.getDate(), mm = date.getMonth(), yy = date.getFullYear();
    let hours = date.getHours(), minutes = date.getMinutes();
    
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    let strTime = `${weekDays[day]}, ${dd} ${months[mm].slice(0, 3)} ${yy} ${hours}:${minutes} ${ampm}`;
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

  function calculateDate(epoch) {
    const date = new Date(epoch);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  function isNewDate(currentMsgTime, index) {
    if (!index) return true;
    const firstRawEpoch = new Date(currentMsgTime);
    const secondRawEpoch = new Date(props.elementArray[index - 1].currentMsgTime);
    const firstDateEpoch = new Date(firstRawEpoch.getFullYear(), firstRawEpoch.getMonth(), firstRawEpoch.getDate()).getTime();
    const secondDateEpoch = new Date(secondRawEpoch.getFullYear(), secondRawEpoch.getMonth(), secondRawEpoch.getDate()).getTime();
    return Math.abs(firstDateEpoch - secondDateEpoch) >= 86400000;
  }

  useEffect(() => {
    scroll.current.scrollIntoView( { behavior: 'smooth' } );
  }, [props.elementArray.length])

  useEffect(() => {
    if (!selectedMessagesList.length) dispatch(featuresToggle(false));
    // eslint-disable-next-line
  }, [selectedMessagesList.length])

  const dateBar = (messageTimeEpoch, index) => {
    return isNewDate(messageTimeEpoch, index) ?
    <div className='flex place-items-center'>
      <hr className={`w-full ${theme.border400}`} />
      <div className={`whitespace-nowrap px-1 text-xs font-semibold ${theme.text400}`}>{calculateDate(messageTimeEpoch)}</div>
      <hr className={`w-full ${theme.border400}`} />
    </div> : null
  }

  return (
    <div className='flex flex-col justify-end px-8 h-[79vh] overflow-y-scroll'>
      <div className='overflow-y-scroll'>{
        props.elementArray.map((element, index) => {
          return <div>
            { dateBar(element.currentMsgTime , index) }
            { <Messagebox key={element.messageID} star={props.star} setStar={props.setStar} currentTime={currentTime} fileSize={fileSize} calculateDate={calculateDate} element={element} /> }
          </div>
        })
      }
      <div ref={ scroll }></div>
      </div>
    </div>
  )
}
