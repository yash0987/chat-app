import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featuresToggle } from 'features/toggle-slice/toggleSlice';
import { dateFromEpoch } from 'utils/dateFromEpoch';
import Messagebox from 'views/chat-messages/components/Messagebox';
import PopupList from './PopupList';

export default function Message(props) {
  const [visibilityOfPopupList, setVisibilityOfPopupList] = useState({ status: false });
  const boxMeasurement = useRef(null);
  const scroll = useRef(null);
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  useEffect(() => {
    scroll.current.scrollIntoView( { behavior: 'smooth' } );
  }, [props.elementArray.length])
  
  useEffect(() => {
    if (!selectedMessagesList.length) dispatch(featuresToggle(false));
    // eslint-disable-next-line
  }, [selectedMessagesList.length])

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

  function popupList(e, message) {
    const divWidth = boxMeasurement.current.offsetWidth;
    const divHeight = boxMeasurement.current.offsetHeight;
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;

    const divStartXCoordinate = screenWidth - divWidth - 10;
    const divStartYCoordinate = screenHeight - divHeight - 135;
    
    const top = Math.min(e.clientY - divStartYCoordinate, divHeight - 235);
    const left = Math.min(e.clientX - divStartXCoordinate, divWidth - 165);
    let coordinates = { top, left };
    if (screenWidth - e.clientX < 165) {
      const right = Math.max(screenWidth - e.clientX - 10);
      coordinates = { top, right };
    }

    setVisibilityOfPopupList({ coordinates, message, status: true });
  }

  function isNewDate(currentMsgTime, index) {
    if (!index) return true;
    const firstRawEpoch = new Date(currentMsgTime);
    const secondRawEpoch = new Date(props.elementArray[index - 1].currentMsgTime);
    const firstDateEpoch = new Date(firstRawEpoch.getFullYear(), firstRawEpoch.getMonth(), firstRawEpoch.getDate()).getTime();
    const secondDateEpoch = new Date(secondRawEpoch.getFullYear(), secondRawEpoch.getMonth(), secondRawEpoch.getDate()).getTime();
    return Math.abs(firstDateEpoch - secondDateEpoch) >= 86400000;
  }
  
  const dateBar = (messageTimeEpoch, index) => {
    return isNewDate(messageTimeEpoch, index) ?
    <div className='flex place-items-center px-8'>
      <hr className={`w-full ${theme.border400}`} />
      <div className={`whitespace-nowrap px-1 text-xs font-semibold ${theme.text400}`}>{dateFromEpoch(messageTimeEpoch)}</div>
      <hr className={`w-full ${theme.border400}`} />
    </div> : null
  }

  return (
    <div ref={ boxMeasurement } className='flex flex-col justify-end relative h-[80vh] overflow-y-scroll'>
      <PopupList visibilityOfPopupList={visibilityOfPopupList} setVisibilityOfPopupList={setVisibilityOfPopupList} />
      <div className='overflow-y-scroll py-3'>{
        props.elementArray.map((element, index) => {
          let isPreviousMessagesUserDifferent = isNewDate(element.currentMsgTime, index) || element.replyToMessage;
          if (!isPreviousMessagesUserDifferent) isPreviousMessagesUserDifferent ||= props.elementArray[index - 1].senderID !== props.elementArray[index].senderID;
          return <div>
            { dateBar(element.currentMsgTime , index) }
            { <Messagebox key={element.messageID} isPreviousMessagesUserDifferent={isPreviousMessagesUserDifferent} star={props.star} setStar={props.setStar} fileSize={fileSize} element={element} visibilityOfPopupList={visibilityOfPopupList} popupList={popupList} /> }
          </div>
        })
      }
      <div ref={ scroll }></div>
      </div>
    </div>
  )
}
