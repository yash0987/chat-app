import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import replyIcon from '../../../assets/reply.png';
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
        let replyForMessage = element.collectedText.slice(0, Math.min(50, element.collectedText.length));
        let array = replyForMessage.split('\n');
        if (array.length > 3) {
          replyForMessage = array.splice(0, 3).join('\n') + '...';
        }
        dispatch(reply({
          repliedMessageID: element.messageID,
          replyToPerson: element.senderName,
          replyForMessage
        }));
      }
    })
    dispatch(replyMessageToggle(true));
    dispatch(unselectAllMessages());
  }

  return (
    selectedMessagesList.length === 1 ? 
      <img onClick={ () => replyToThisMessage() } src={replyIcon} alt="" className={`mx-1 w-8 rounded-full ${theme.hoverBg400}`} /> 
    : null    
  )
}
