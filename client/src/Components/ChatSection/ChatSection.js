import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import emoji from './../../Img/emoji.png';
import { CurrentUser } from '../../Context/CurrentUserContext';
import ChatBar from './ChatBar';
import sendMessageBtn from './../../Img/sendMessageBtn.png';
import Message from './Message';

export default function ChatSection(props) {
  const ws = props.ws;
  const users = CurrentUser();
  const [chat, setChat] = useState(null);
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [elementArray, setElementArray] = useState([]);
  const messageBoxRef = useRef(null);
  const emojiPanelRef = useRef(null);
  const messageSectionRef = useRef(null);
  
  let IDarray = [ props.secondPerson.ID, users.googleID ];
  IDarray.sort();
  let room = IDarray[0] + IDarray[1];
  
  // const ws = new WebSocket('ws://localhost:5000');
  // ws.onopen = () => {
  //   console.log("connection has been established");
  // }

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    let arr = [...elementArray, message];
    setElementArray(arr);
  }

  async function getChat() {
    const response = await fetch(`http://localhost:5000/chat/data?ID=${room}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    });

    const data = await response.json();
    return data;
  }

  function reloadchat() {
    getChat().then((data) => {
      if (chat === null) {
        setChat(data);
      }
      else if (chat.chatID !== data.chatID) {
        setChat(data);
      }
    })
  }

  function selectMessage() {
    setDeleteToggle(true);
  }

  useEffect(() => {
    // reloadchat();
    // setElementArray([]);
    // eslint-disable-next-line
  }, [room]);

  function currentTime() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  function displayMessage() {
    const collectedText = messageBoxRef.current.value;
    const currentMsgTime = currentTime();
    if (collectedText.trim() === "") {
      return ;
    }
    
    const sender = users.googleID;
    const receiver = props.secondPerson.ID;
    let arr = [...elementArray, { collectedText, currentMsgTime, sender, receiver, room }];
    props.setElementArray(arr);
    
    let emojiPanel = emojiPanelRef.current;
    if (emojiPanel.style.display === 'block') {
      emojiPanel.style.display = 'none';
    }

    ws.send(JSON.stringify({ collectedText, currentMsgTime, sender, receiver, action: 'send' }));
  }

  function selectEmoji(event) {
    let emojiUnified = event.unified.split('-');
    let codeArray = [];
    emojiUnified.forEach(element => codeArray.push('0x' + element));
    let emoji = String.fromCodePoint(...codeArray);
    let text = messageBoxRef.current.value;
    text += emoji;
    messageBoxRef.current.value = text;
    console.log(emoji);
  }

  function openEmojiPanel() {
    let emojiPanel = emojiPanelRef.current;
    if (emojiPanel.style.display === 'none') {
      emojiPanel.style.display = 'block';
    }
    else {
      emojiPanel.style.display = 'none';
    }
  }
  
  // props.toggle === 'showChatSection' ? (ws.send({ action: 'join', room })) : (ws.onclose = () => console.log("connection has been closed"));

  return (
    <section className='m-2 w-[45rem] rounded overflow-hidden flex flex-wrap content-between bg-violet-50'>
      <ChatBar deleteToggle={deleteToggle} setDeleteToggle={setDeleteToggle} selectMessage={selectMessage} setToggle={props.setToggle} secondPerson={props.secondPerson} />
      <div id='messageSection' ref={messageSectionRef} className='px-10 w-[46.7%] max-h-[75.5%] overflow-y-scroll absolute bottom-[6rem]'>
        {/* { chat ? <Message elementArray={chat.chatMsg} deleteToggle={deleteToggle} googleID={users.googleID} /> : null } */}
        <Message elementArray={elementArray} deleteToggle={deleteToggle} googleID={users.googleID} />
      </div>

      <div className='m-3 p-2 w-full h-14 flex rounded-full bg-white'>
        <img onClick={ openEmojiPanel } src={emoji} alt="" className='w-11 p-2 rounded-full hover:bg-violet-200' />
        <textarea cols="0" rows="0" ref={messageBoxRef} placeholder='Type a message...' className='p-[6px] w-full resize-none focus:outline-none placeholder:text-violet-400'></textarea>
        <button onClick={ displayMessage }>
          <img src={ sendMessageBtn } alt="" className='w-12 rounded-full bg-violet-400 hover:bg-violet-500' />
        </button>
      </div>

      <div ref={emojiPanelRef} className='absolute bottom-24' style={{display: 'none'}}>
        <EmojiPicker width={720} height={350} previewConfig={ { showPreview: false } } skinTonePickerLocation="SEARCH" onEmojiClick={ selectEmoji } />
      </div>
    </section>
  )
}