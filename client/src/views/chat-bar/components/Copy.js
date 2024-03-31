import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { unselectAllMessages } from 'features/select-message-slice/selectMessageSlice';
import { datetimeFromEpoch } from 'utils/datetimeFromEpoch';
import copy from 'assets/copy.png';

export default function Copy() {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const chat = useSelector(state => state.chat.value);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  function copyText() {
    let copiedText = "";
    if (selectedMessagesList.length === 1) {
      chat.forEach((element) => {
        if (element.messageID === selectedMessagesList[0]) copiedText += element.collectedText
      })
      
      navigator.clipboard.writeText(copiedText);
      dispatch(unselectAllMessages());
      return ;
    }

    selectedMessagesList.forEach((selectedMessageID) => {
      chat.forEach((element) => {
        if (element.messageID === selectedMessageID) {
          copiedText += 
          `[${datetimeFromEpoch(element.currentMsgTime)}] ${element.senderName}: ${element.collectedText}\n`;
        }
      })
    });
    
    navigator.clipboard.writeText(copiedText);
    dispatch(unselectAllMessages());
  }
  
  return (
    <section>
      <img onClick={ () => copyText() } src={copy} alt="" className={`mx-1 w-8 rounded-full ${theme.hoverBg400}`} />
    </section>
  )
}
