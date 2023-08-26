import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { toggleFeatures } from '../../../features/toggle-slice/toggleSlice';
import copy from './../../../img/copy.png';

export default function CopyMessages() {
  const selectedMessagesList = useSelector(state => state.selectmessage.value);
  const chat = useSelector(state => state.chat.value);
  const dispatch = useDispatch();

  function copyText() {
    let copiedText = "";
    if (selectedMessagesList.length === 1) {
      chat.forEach((element) => {
        if (element.messageID === selectedMessagesList[0]) copiedText += element.collectedText
      })
      
      navigator.clipboard.writeText(copiedText);
      dispatch(toggleFeatures());
      return ;
    }

    selectedMessagesList.forEach((selectedMessageID) => {
      chat.forEach((element) => {
        if (element.messageID === selectedMessageID) {
          copiedText += 
          `[${element.currentMsgTime}] ${element.senderName}: ${element.collectedText}\n`;
        }
      })
    });
    
    navigator.clipboard.writeText(copiedText);
    dispatch(toggleFeatures());
  }
  
  return (
    <section>
      <img onClick={ () => copyText() } src={copy} alt="" className='mx-1 w-10 rounded-full hover:bg-violet-400' />
    </section>
  )
}
