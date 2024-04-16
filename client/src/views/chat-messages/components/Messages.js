import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editMessageToggle } from 'features/toggle-slice/toggleSlice';
import { ws } from 'utils/websocket';
import { updateChat } from 'features/chat-slice/chatSlice';
import { unselectAllMessages } from 'features/select-message-slice/selectMessageSlice';
import { dateFromEpoch } from 'utils/dateFromEpoch';
import Messagebox from 'views/chat-messages/components/Messagebox';
import PopupList from './PopupList';

export default function Messages(props) {
  const [visibilityOfPopupList, setVisibilityOfPopupList] = useState({ status: false });
  const boxMeasurement = useRef(null);
  const scroll = useRef(null);
  const theme = useSelector(state => state.theme.value);
  const user = useSelector(state => state.auth.value.user);
  const newChat = useSelector(state => state.chatinfo.value.newChat);
  const dispatch = useDispatch();

  useEffect(() => {
    scroll.current.scrollIntoView( { behavior: 'smooth' } );
  }, [props.elementArray.length])

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

  async function editSelectedMessage(editedMessage, messageID) {    
    let messageData = {
      editedMessage,
      messageID,
      senderID: user._id,
      newChat,
      type: 'text',
      action: 'edit'
    };
    ws.send(JSON.stringify([messageData]));

    const updatedMessagesList = props.elementArray.map((element) => {
      if (element.messageID === messageID) {
        return {
          ...element,
          collectedText: editedMessage,
          editedStatus: true
        }
      }
      return element;
    })
    dispatch(updateChat(updatedMessagesList));
    dispatch(unselectAllMessages());
    dispatch(editMessageToggle(false));
  }

  function cancelEditMessage() {
    dispatch(unselectAllMessages());
    dispatch(editMessageToggle(false));
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
      <PopupList visibilityOfPopupList={visibilityOfPopupList} setVisibilityOfPopupList={setVisibilityOfPopupList} room={props.room} />
      <div className='overflow-y-scroll py-3'>{
        props.elementArray.map((element, index) => {
          let isPreviousMessagesUserDifferent = isNewDate(element.currentMsgTime, index) || element.replyToMessage;
          if (!isPreviousMessagesUserDifferent) isPreviousMessagesUserDifferent ||= props.elementArray[index - 1].senderID !== props.elementArray[index].senderID;
          return <div>
            { dateBar(element.currentMsgTime , index) }
            { <Messagebox key={element.messageID} isPreviousMessagesUserDifferent={isPreviousMessagesUserDifferent} fileSize={fileSize} element={element} visibilityOfPopupList={visibilityOfPopupList} popupList={popupList} editSelectedMessage={editSelectedMessage} cancelEditMessage={cancelEditMessage} /> }
          </div>
        })
      }
      <div ref={ scroll }></div>
      </div>
    </div>
  )
}
