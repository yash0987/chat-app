import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { appendChat } from '../../../features/chat-slice/chatSlice';
// import sendMessageBtn from './../../../img/sendMessageBtn.png';
import plusIcon from './../../../img/plus.png';
import emoji from './../../../img/emoji.png';
import ReplyToMessage from './ReplyToMessage';
import AlertBar from '../../AlertBar';
import UploadFiles from './UploadFiles';

export default function TextBox(props) {
  const user = useSelector(state => state.auth.value.user);
  const reply = useSelector(state => state.reply.value);
  const showReplyMessage = useSelector(state => state.toggle.value.replyMessage);
  const theme = useSelector(state => state.theme.value);
  const newChat = useSelector(state => state.chatinfo.value.newChat);
  const dispatch = useDispatch();
  const messageBoxRef = useRef(null);
  const emojiPanelRef = useRef(null);

  useEffect(() => {
    messageBoxRef.current.focus();
  }, []);

  function displayMessage() {
    const collectedText = messageBoxRef.current.value;
    const currentMsgTime = Date.now();
    if (collectedText.trim() === "") return ;

    const senderID = user.googleID;
    const senderName = user.firstName + " " + user.familyName;
    const senderPhotoURL = user.photoURL;
    const messageID = senderID + currentMsgTime;
    let messageData = {
      messageID,
      collectedText,
      currentMsgTime,
      senderID,
      senderName,
      senderPhotoURL,
      newChat,
      star: false,
      action: 'send'
    };

    if (showReplyMessage) {
      messageData = { 
        ...messageData,
        replyToMessage: {
          replyToPerson: reply.replyToPerson,
          replyForMessage: reply.replyForMessage,
          repliedMessageID: reply.repliedMessageID
        }
      };
    }

    let emojiPanel = emojiPanelRef.current;
    if (emojiPanel.style.display === 'block') {
      emojiPanel.style.display = 'none';
    }
    dispatch(appendChat([messageData]));
    props.ws.send(JSON.stringify(messageData));
  }

  function selectEmoji(event) {
    let emojiUnified = event.unified.split('-');
    let codeArray = [];
    emojiUnified.forEach(element => codeArray.push('0x' + element));
    let emoji = String.fromCodePoint(...codeArray);
    let text = messageBoxRef.current.value;
    text += emoji;
    messageBoxRef.current.value = text;
  }

  function openEmojiPanel() {
    let emojiPanel = emojiPanelRef.current;
    if (emojiPanel.style.display === 'none') emojiPanel.style.display = 'block';
    else emojiPanel.style.display = 'none';
  }

  window.onkeydown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const messageBoxValue = messageBoxRef.current.value;
      if (messageBoxValue.trim() === "") return ;
      console.log("I am send message on click enter key");
      displayMessage();
    }
  }

  return (
    <div className='relative w-full grid place-items-center'>
      <AlertBar />
      <ReplyToMessage />
      <UploadFiles />
      <div className='mb-2 px-2 w-[94%] rounded-lg flex place-items-center bg-white'>
        <div className='grid grid-flow-col'>
          <button className={`rounded-full text-4xl text-white ${theme.bg200} ${theme.hoverBg300}`}>
            <img src={plusIcon} alt="" className='w-8 p-1' />
          </button>
          <button className='mx-2'>
            <img onClick={openEmojiPanel} src={emoji} alt="" className={`w-9 p-1 rounded-full ${theme.hoverBg200}`} />
          </button>
        </div>
        <div className='w-full'>
          <textarea cols="0" rows="0" ref={messageBoxRef} placeholder='Type a message...' className={`w-full mt-2 h-7 resize-none focus:outline-none ${theme.placeholderText400}`}></textarea>
        </div>
        {/* <button>
            <img onClick={displayMessage} src={ sendMessageBtn } alt="" className={`w-8 rounded-full ${theme.bg400} ${theme.hoverBg500}`} />
        </button> */}
      </div>
      <div ref={emojiPanelRef} style={{display: 'none'}}>
        <EmojiPicker width={1024} height={350} previewConfig={{showPreview: false}} skinTonePickerLocation="SEARCH" onEmojiClick={selectEmoji} />
      </div>
    </div>
  )
}
