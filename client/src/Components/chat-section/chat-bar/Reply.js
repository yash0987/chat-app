import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import replyIcon from './../../../img/reply.png';
import { replyMessageToggle } from '../../../features/toggle-slice/toggleSlice';
import { reply } from '../../../features/reply-slice/replySlice';
import { unselectAllMessages } from '../../../features/select-message-slice/selectMessageSlice';

export default function Reply() {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const chat = useSelector(state => state.chat.value);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  function replyToThisMessage() {
    chat.forEach(element => {
      if (element.messageID === selectedMessagesList[0]) {
        dispatch(reply({
          replyToPerson: element.senderName,
          replyForMessage: element.collectedText,
          repliedMessageID: element.messageID
        }));
      }
    })
    dispatch(replyMessageToggle(true));
    dispatch(unselectAllMessages());
  }

  return (
    selectedMessagesList.length === 1 ? 
      <img onClick={ () => replyToThisMessage() } src={replyIcon} alt="" className={`mx-1 w-10 rounded-full ${theme.hoverBg400}`} /> 
    : null    
  )
}
