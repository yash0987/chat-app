import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { prependChat, appendChat } from '../../features/chat-slice/chatSlice';
import ChatBar from './chat-bar/ChatBar';
import Messages from './Messages';
import TextBox from './text-box/TextBox';
import DeleteForMeModal from './../modal/DeleteForMeModal';
import { ws } from './websocket';

export default function ChatSection(props) {
  const chat = useSelector(state => state.chat);
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  const chatInfo = useSelector(state => state.chatinfo.value);
  const dispatch = useDispatch();
  const [star, setStar] = useState(0);
  
  let room;
  if (chatInfo.newChat.isGroup) room = chatInfo.newChat.ID;
  else {
    let IDarray = [ chatInfo.newChat.ID, user.googleID ].sort();
    room = IDarray[0] + IDarray[1];
  }
  console.log(room);

  useEffect(() => {
    ws.onopen = () => console.log("connection has been established");
    return () => ws.onclose = () => console.error("closed connection");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const detailsForRoom = {
        senderID: user.googleID,
        newChat: chatInfo.newChat,
        latestChat: chatInfo.latestChat,
        action: 'join',
      };
      ws.send(JSON.stringify(detailsForRoom));
    }, 500);

    return () => clearTimeout();
    // eslint-disable-next-line
  }, [room]);
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message);
    console.log("I am receiving")
    dispatch(appendChat([message]));
  }

  async function getChat() {
    const getChatRequestURI = chatInfo.newChat.isGroup ? `http://localhost:5000/group/data?ID=${room}` :
    `http://localhost:5000/chat/data?ID=${room}`;
    const response = await fetch(getChatRequestURI, {
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
      dispatch(prependChat(data));
    })
  }
  
  useEffect(() => {
    reloadchat();
    // eslint-disable-next-line
  }, [room]);

  return (
    <section className={`w-[64.15rem] h-[91vh] flex flex-col overflow-hidden ${theme.bg50}`}>
      <ChatBar getChat={getChat} star={star} setStar={setStar} room={room} ws={ws} />
      <Messages star={star} setStar={setStar} elementArray={chat.value} googleID={user.googleID} />
      <TextBox ws={ws} />
      <DeleteForMeModal room={room} />
    </section>
  )
}