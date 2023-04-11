import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import emoji from './../../Img/emoji.png';
import { CurrentUser } from '../../Context/CurrentUserContext';
import ChatBar from './ChatBar';
import sendMessageBtn from './../../Img/sendMessageBtn.png';

export default function ChatSection(props) {
  const socket = io('http://localhost:5000');
  const users = CurrentUser();
  const [chat, setChat] = useState(null);
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [elementArray, setElementArray] = useState([]);
  const messageBoxRef = useRef(null);
  const emojiPanelRef = useRef(null);


  let IDarray = [ props.secondPerson.ID, users.googleID ];
  IDarray.sort();
  let room = IDarray[0] + IDarray[1];
  let keyValue = 0;

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

  useEffect(() => {
    socket.on('connect', () => {
      console.log("socket is connnect to this ID: " + socket.id);
    })

    socket.on('receive-message', (message) => {
      const collectedText = message.collectedText;
      const currentMsgTime = message.currentMsgTime;

      const receiverMessageElement = (
        <label className = 'message flex justify-start my-1'>
          { deleteToggle ? <input type="checkbox" name="" id="" className='ml-3' /> : null }
          <p className = 'whitespace-pre-line px-2 py-1 rounded-md text-white bg-violet-500'>
            { collectedText }
            <span className = 'flex justify-end text-[10px] text-white'> { currentMsgTime } </span>
          </p>
        </label>
      );

      console.log(collectedText);
    
      let arr = [...elementArray];
      arr.push(receiverMessageElement);
      setElementArray(arr);
    })

    return () => {
      socket.removeAllListeners();
    }
    // eslint-disable-next-line
  }, []);

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

    const senderMessageElement = (
      <label className = 'message flex justify-end my-1'>
        <p className = 'whitespace-pre-line px-2 py-1 max-w-2/3 rounded-md bg-gray-200 text-gray-600'>
          { collectedText }
          <span className = 'flex justify-end text-[10px]'> { currentMsgTime } </span>
        </p>
        { deleteToggle ? <input type="checkbox" name="" id="" className='ml-3' /> : null }
      </label>
    );

    console.log(collectedText);
    
    const sender = users.googleID;
    const receiver = props.secondPerson.ID;
    socket.emit('chat-message', { collectedText, currentMsgTime, sender, receiver }, room);

    let arr = [...elementArray];
    arr.push(senderMessageElement);
    setElementArray(arr);
    console.log(arr)
    
    let emojiPanel = emojiPanelRef.current;
    if (emojiPanel.style.display === 'block') {
      emojiPanel.style.display = 'none';
    }
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
  
  props.toggle === 'showChatSection' ? (socket.emit('join-room', room)) : (socket.emit('leave-room', room))

  return (
    <section className='m-2 w-[45rem] rounded overflow-hidden flex flex-wrap content-between bg-violet-50'>
      <ChatBar deleteToggle={deleteToggle} setDeleteToggle={setDeleteToggle} selectMessage={selectMessage} setToggle={props.setToggle} secondPerson={props.secondPerson} />
      <div id='messageSection' className='px-10 w-[46.7%] max-h-[75.5%] overflow-y-scroll absolute bottom-[6rem]'>
        {/* <div> {
          // eslint-disable-next-line
          chat ? chat.chatMsg.map((element) => {
            keyValue++;
            if (element.sender === users.googleID) {
              return (
                <label key={ keyValue } className = 'message flex justify-end my-1'>
                  <p className = 'whitespace-pre-line px-2 py-1 max-w-2/3 rounded-md bg-gray-200 text-gray-600'>
                    { element.collectedText }
                    <span className = 'flex justify-end text-[10px]'> { element.currentMsgTime } </span>
                  </p>
                  <input type="checkbox" name="" id="" className='ml-3 hidden' />
                </label>
              );
            }

            return (
              <label key={ keyValue } className = 'message flex justify-start my-1'>
                <input type="checkbox" name="" id="" className='mr-3 hidden' />
                <p className = 'whitespace-pre-line px-2 py-1 rounded-md text-white bg-violet-500'>
                  { element.collectedText }
                  <span className = 'flex justify-end text-[10px] text-white'> { element.currentMsgTime } </span>
                </p>
              </label>
            );
          }) : null
        } </div> */}

        { 
          // eslint-disable-next-line
          elementArray.map((element) => {
            keyValue++;
            return <div key={keyValue}>{ element }</div>
          }) 
        }
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