import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import emoji from './../../img/emoji.png';
import { CurrentUser } from '../../context/CurrentUserContext';
import ChatBar from './ChatBar';
import sendMessageBtn from './../../img/sendMessageBtn.png';
import Messages from './Messages';
import { prependChat, appendChat, updateChat } from '../../features/chat-slice/chatSlice';

export default function ChatSection(props) {
  const chat = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const users = CurrentUser();
  const [deleteToggle, setDeleteToggle] = useState(false);
  const messageBoxRef = useRef(null);
  const emojiPanelRef = useRef(null);
  const messageSectionRef = useRef(null);
  const scroll = useRef(null);
  
  let IDarray = [ props.secondPerson.ID, users.googleID ];
  IDarray.sort();
  let room = IDarray[0] + IDarray[1];
  console.log(room);

  const ws = new WebSocket('ws://localhost:5000');

  useEffect(() => {
    ws.onopen = () => {
      console.log("connection has been established");
      ws.send(JSON.stringify({ action: 'join', sender: users.googleID, receiver: props.secondPerson.ID, oldReceiver: props.oldChatPerson.ID }));
    }
    // eslint-disable-next-line
  }, [room]);
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message);
    console.log("I am receiving")
    dispatch(appendChat([message]));
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
      dispatch(prependChat(data.chatMsg));
    })
  }
  
  useEffect(() => {
    reloadchat();
    // eslint-disable-next-line
  }, [room]);

  useEffect(() => {
    scroll.current.scrollIntoView( { behavior: 'smooth' } );
  }, [chat.value.length])

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
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
    if (collectedText.trim() === "") {
      return ;
    }
    
    const sender = users.googleID;
    const receiver = props.secondPerson.ID;
    const messageID = sender + Date.now();
    dispatch(appendChat([{ messageID, collectedText, currentMsgTime, sender, receiver }]));
    
    let emojiPanel = emojiPanelRef.current;
    if (emojiPanel.style.display === 'block') {
      emojiPanel.style.display = 'none';
    }

    ws.send(JSON.stringify({ messageID, collectedText, currentMsgTime, sender, receiver, deleteMsg: [], action: 'send' }));
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
    if (emojiPanel.style.display === 'none') {
      emojiPanel.style.display = 'block';
    }
    else {
      emojiPanel.style.display = 'none';
    }
  }

  const selectedMessageArray = [];
  async function deleteMessages() {
    selectedMessageArray.sort();
    const response = await fetch(`http://localhost:5000/delete/messages?selectedMessages=${JSON.stringify(selectedMessageArray)}&ID=${room}`, {
      method: 'DELETE',
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    });

    const data = await response.json();
    console.log(data);

    let remainingMessages = chat.value;
    selectedMessageArray.forEach((elementToRemove) => {
      remainingMessages = remainingMessages.filter((element) => element.messageID !== elementToRemove);
    })

    dispatch(updateChat(remainingMessages))
    setDeleteToggle(false);
    console.log(remainingMessages);
    console.log(selectedMessageArray)
  }

  return (
    <section className='m-2 w-[45rem] rounded overflow-hidden flex flex-wrap content-between bg-violet-50'>
      <ChatBar deleteToggle={deleteToggle} setDeleteToggle={setDeleteToggle} deleteMessages={deleteMessages} setToggle={props.setToggle} secondPerson={props.secondPerson} ws={props.ws} />
      <div id='messageSection' ref={messageSectionRef} className='px-10 w-[46.7%] max-h-[75.5%] overflow-y-scroll absolute bottom-[6rem]'>
        <Messages elementArray={chat.value} deleteToggle={deleteToggle} googleID={users.googleID} selectedMessageArray={selectedMessageArray} />
        <div ref={ scroll }></div>
      </div>

      <div className='m-3 p-2 w-full h-14 flex rounded-full bg-white'>
        <img onClick={openEmojiPanel} src={emoji} alt="" className='w-11 p-2 rounded-full hover:bg-violet-200' />
        <textarea cols="0" rows="0" ref={messageBoxRef} placeholder='Type a message...' className='p-[6px] w-full resize-none focus:outline-none placeholder:text-violet-400'></textarea>
        <button onClick={displayMessage}>
          <img src={ sendMessageBtn } alt="" className='w-12 rounded-full bg-violet-400 hover:bg-violet-500' />
        </button>
      </div>

      <div ref={emojiPanelRef} className='absolute bottom-24' style={{display: 'none'}}>
        <EmojiPicker width={720} height={350} previewConfig={{showPreview: false}} skinTonePickerLocation="SEARCH" onEmojiClick={selectEmoji} />
      </div>
    </section>
  )
}