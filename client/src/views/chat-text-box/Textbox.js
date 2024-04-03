import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { appendChat } from 'features/chat-slice/chatSlice';
import { ws } from 'utils/websocket';
import Replybox from 'views/chat-text-box/components/Replybox';
import UploadFiles from 'views/chat-text-box/components/UploadFiles';
import AlertBar from 'components/AlertBar';
import plusIcon from 'assets/plus.png';
import emoji from 'assets/emoji.png';

export default function Textbox(props) {
  const [displayEmojiPanel, setDisplayEmojiPanel] = useState(0);
  const [uploadfiles, setUploadfiles] = useState(false);
  const messageBoxRef = useRef(null);
  const user = useSelector(state => state.auth.value.user);
  const reply = useSelector(state => state.reply.value);
  const showReplyMessage = useSelector(state => state.toggle.value.replyMessage);
  const theme = useSelector(state => state.theme.value);
  const newChat = useSelector(state => state.chatinfo.value.newChat);
  const dispatch = useDispatch();

  useEffect(() => {
    messageBoxRef.current.focus();
  }, [displayEmojiPanel]);

  function displayMessage() {
    const collectedText = messageBoxRef.current.value;
    const currentMsgTime = Date.now();
    if (collectedText.trim() === "") return ;

    let messageData = {
      messageID: user._id + currentMsgTime,
      collectedText,
      currentMsgTime,
      senderID: user._id,
      senderName: user.name,
      senderPhotoURL: user.photoURL,
      newChat,
      star: false,
      type: 'text',
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

    setDisplayEmojiPanel(0);
    dispatch(appendChat([messageData]));
    ws.send(JSON.stringify([messageData]));
  }

  function selectEmoji(event) {
    let emojiUnified = event.unified.split('-');
    let codeArray = [];
    emojiUnified.forEach(element => codeArray.push('0x' + element));
    let emoji = String.fromCodePoint(...codeArray);
    let text = messageBoxRef.current.value;
    text += emoji;
    messageBoxRef.current.value = text;
    messageBoxRef.current.focus();
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
      <Replybox />
      { uploadfiles ? <UploadFiles ws={props.ws} /> : null }
      <div className='mb-2 px-2 w-[94%] rounded-lg flex place-items-center bg-white'>
        <button onClick={() => setUploadfiles(uploadfiles ^ 1)} className={`rounded-full text-4xl text-white ${theme.bg200} ${theme.hoverBg300}`}><img src={plusIcon} alt="" className='w-8 p-1' /></button>
        <button onClick={() => setDisplayEmojiPanel(displayEmojiPanel ^ 1)} className='mx-2'><img src={emoji} alt="" className={`w-9 p-1 rounded-full ${theme.hoverBg200}`} /></button>
        <textarea cols="0" rows="0" ref={messageBoxRef} placeholder='Type a message...' className={`w-full mt-2 h-8 resize-none focus:outline-none ${theme.placeholderText400}`}></textarea>
      </div>
      {
        displayEmojiPanel ? 
        <div className='absolute right-5 bottom-14'>
          <EmojiPicker width={500} height={350} previewConfig={{showPreview: false}} skinTonePickerLocation="SEARCH" onEmojiClick={selectEmoji} />
        </div> : null
      }
        
    </div>
  )
}
