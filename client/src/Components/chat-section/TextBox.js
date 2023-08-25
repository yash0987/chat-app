import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { appendChat } from '../../features/chat-slice/chatSlice';
import sendMessageBtn from './../../img/sendMessageBtn.png';
import emoji from './../../img/emoji.png';

export default function TextBox(props) {
  const user = useSelector(state => state.auth.value.user);
  const dispatch = useDispatch();
  const messageBoxRef = useRef(null);
  const emojiPanelRef = useRef(null);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    messageBoxRef.current.focus();
  }, [])
  
  function currentTime() {
    const date = new Date();
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

  function displayMessage() {
    const collectedText = messageBoxRef.current.value;
    const currentMsgTime = currentTime();
    if (collectedText.trim() === "") return ;

    const sender = user.googleID;
    const receiver = props.secondPerson.ID;
    const messageID = sender + Date.now();
    const messageData = { messageID, collectedText, currentMsgTime, sender, receiver, star: false };

    let emojiPanel = emojiPanelRef.current;
    if (emojiPanel.style.display === 'block') {
      emojiPanel.style.display = 'none';
    }
    dispatch(appendChat([messageData]));
    props.ws.send(JSON.stringify({ ...messageData, action: 'send' }));
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
    const messageBoxValue = messageBoxRef.current.value;
    if (messageBoxValue.trim() !== "" && event.key === "Enter") {
      event.preventDefault();
      console.log("I am send message on click enter key");
      displayMessage();
    }
  }

  return (
    <>
      <div ref={emojiPanelRef} style={{display: 'none'}}>
        <EmojiPicker width={1024} height={350} previewConfig={{showPreview: false}} skinTonePickerLocation="SEARCH" onEmojiClick={selectEmoji} />
      </div>
      <div className='p-2 h-14 flex bg-white'>
        <img onClick={openEmojiPanel} src={emoji} alt="" className='w-10 p-2 rounded-full hover:bg-violet-200' />
        <textarea cols="0" rows="0" ref={messageBoxRef} placeholder='Type a message...' className='p-[6px] w-full resize-none focus:outline-none placeholder:text-violet-400'></textarea>
        <button onClick={displayMessage}>
          <img src={ sendMessageBtn } alt="" className='w-12 rounded-full bg-violet-400 hover:bg-violet-500' />
        </button>
      </div>
    </>
  )
}
